export class ToggleNav extends HTMLElement {
  constructor() {
    super();

    this._isExpanded = false;
    this._externalTrigger = false;
    this._name = '';
    this.shadow = this.attachShadow({ mode: 'open' });

    this.open = () => this.handleOpen();
    this.close = () => this.handleClose();
    this.keys = e => this.handleKeys(e);
    this.trap = () => this.handleFocusTrap();
  }

  static get observedAttributes() {
    return ['is-expanded', 'external-trigger', 'name'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;

    if (property === 'is-expanded') {
      this._isExpanded = !this._isExpanded;
    }

    if (property === 'external-trigger') {
      this._externalTrigger = true;
    }

    if (property === 'name') {
      this._name = newValue;
    }
  }

  connectedCallback() {
    this.shadow.innerHTML = `
      <style>
        :host {
          --toggle-nav-background: rgb(225 225 225);
          --toggle-nav-border-radius: 0;
          --toggle-nav-button-focus-outline: 2px solid blue;
          --toggle-nav-button-padding: 10px;
          --toggle-nav-close-button-margin-inline-start: auto;
          --toggle-nav-inline-size: min(100vw, 32.5rem);
          --toggle-nav-inset-block: 0;
          --toggle-nav-inset-inline-start: calc(100% + var(--toggle-nav-inline-size));
          --toggle-nav-list-gap: 10px;
          --toggle-nav-expanded-inset-inline-start: calc(100% - var(--toggle-nav-inline-size));
          --toggle-nav-overlay-background: rgb(0 0 0 / 0.25);
          --toggle-nav-padding: 20px;
          --toggle-nav-text-size: 1rem;
          --toggle-nav-transition: inset 350ms ease-in-out;

          font: inherit;
          position: relative;
        }

        :host([is-expanded]) > nav > .toggle-nav-container {
          inset-inline-start: var(--toggle-nav-expanded-inset-inline-start);
        }

        :host([external-trigger]) > nav > [data-toggle-nav-open] {
          display: none;
        }

        :host([is-expanded]) > [data-toggle-nav-overlay] {
          display: block;
        }

        .toggle-nav-container {
          background-color: var(--toggle-nav-background, #000);
          border-radius: var(--toggle-nav-border-radius);
          box-sizing: inherit;
          display: flex;
          flex-direction: column;
          inline-size: var(--toggle-nav-inline-size);
          inset-block: var(--toggle-nav-inset-block);
          inset-inline-start: var(--toggle-nav-inset-inline-start);
          position: fixed;
          transition: var(--toggle-nav-transition);
          z-index: 2;
        }

        .toggle-nav-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          padding: var(--toggle-nav-padding, 20px);
        }

        .toggle-nav-content {
          flex-grow: 1;
          list-style: none;
          padding: var(--toggle-nav-padding, 20px);
        }

        .toggle-nav-content > ul {
          display: flex;
          flex-direction: column;
          gap: var(--toggle-nav-list-gap, 10px);
        }

        .toggle-nav-footer {
          padding: var(--toggle-nav-padding, 20px);
        }

        [data-toggle-nav-close] {
          margin-inline-start: var(--close-toggle-margin-inline-start);
        }

        .nav-button {
          appearance: none;
          cursor: pointer;
          font: inherit;
          padding: var(--toggle-nav-button-padding, 10px);
        }

        .nav-button:focus {
          outline: var(--toggle-nav-button-focus-outline);
        }

        [data-toggle-nav-overlay] {
          background-color: var(--toggle-nav-overlay-background);
          display: none;
          inset: 0;
          position: fixed;
          z-index: 1;
        }
      </style>

      <nav>
        <button data-toggle-nav-open class="nav-button">
          <slot name="open-button">Open nav</slot>
        </button>

        <div class="toggle-nav-container">
          <header part="header" class="toggle-nav-header">
            <slot name="header-content"></slot>
            <button data-toggle-nav-close class="nav-button">
              <slot name="close-button">Close nav</slot>
            </button>
          </header>
          <div part="main" class="toggle-nav-content">
            <slot name="main-content"></slot>
          </div>
          <footer part="footer" class="toggle-nav-footer">
            <slot name="footer-content"></slot>
          </footer>
        </div>
      </nav>

      <div data-toggle-nav-overlay></div>
    `;

    this.container = this.shadow.querySelector('.toggle-nav-container');
    this.openEl = this.shadow.querySelector('[data-toggle-nav-open]');
    this.closeEl = this.shadow.querySelector('[data-toggle-nav-close]');
    this.nav = this.shadow.querySelector('nav');
    this.overlay = this.shadow.querySelector('[data-toggle-nav-overlay]');

    this.container.setAttribute('inert', '');
    this.container.setAttribute('hidden', '');

    if (this._externalTrigger === false) {
      this.openEl.addEventListener('click', () => (this._isExpanded === false ? this.open() : ''));
    }

    if (this._name) {
      this.nav.setAttribute('aria-label', this._name);
    }
  }

  handleOpen() {
    this.setAttribute('is-expanded', '');
    this.previouslyFocused = this.shadow.activeElement ?? document.activeElement;
    this.previouslyFocused.setAttribute('aria-expanded', '');
    this.container.removeAttribute('inert');
    this.container.removeAttribute('hidden');
    this.closeEl.focus();
    this.trap();
    document.body.style.overflow = 'hidden';

    this.closeEl.addEventListener('click', this.close);
    this.overlay.addEventListener('click', this.close);
    this.shadow.addEventListener('keydown', this.keys);
  }

  handleClose() {
    this.removeAttribute('is-expanded');
    this.previouslyFocused.removeAttribute('aria-expanded');
    this.container.setAttribute('inert', '');
    this.container.setAttribute('hidden', '');
    this.trap();
    this.previouslyFocused.focus();
    document.body.style.overflow = 'auto';

    this.closeEl.removeEventListener('click', this.close);
    this.overlay.removeEventListener('click', this.close);
    this.shadow.removeEventListener('keydown', this.keys);
  }

  handleKeys(e) {
    if (e.code === 'Escape') this.close();
  }

  handleFocusTrap() {
    // focusable-selectors - https://github.com/KittyGiraudel/focusable-selectors
    const selectors = [
      'a[href]:not([tabindex^="-"])',
      'area[href]:not([tabindex^="-"])',
      'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
      'input[type="radio"]:not([disabled]):not([tabindex^="-"])',
      'select:not([disabled]):not([tabindex^="-"])',
      'textarea:not([disabled]):not([tabindex^="-"])',
      'button:not([disabled]):not([tabindex^="-"])',
      'iframe:not([tabindex^="-"])',
      'audio[controls]:not([tabindex^="-"])',
      'video[controls]:not([tabindex^="-"])',
      '[contenteditable]:not([tabindex^="-"])',
      '[tabindex]:not([tabindex^="-"])',
    ].join(',');

    const [...all] = document.querySelectorAll(selectors);
    const [...slotted] = this.querySelectorAll(selectors);
    const inert = all.filter(el => !slotted.includes(el));

    if (this._isExpanded === true) {
      this.openEl.setAttribute('inert', '');
      inert.forEach(el => el.setAttribute('inert', ''));
    }

    if (this._isExpanded === false) {
      this.openEl.removeAttribute('inert');
      inert.forEach(el => el.removeAttribute('inert'));
    }
  }
}

export const externalTrigger = () => {
  const openEl = document.querySelector('[data-toggle-nav-open]');
  const toggleNavEl = document.querySelector('toggle-nav');

  toggleNavEl._externalTrigger = true;
  openEl.addEventListener('click', () => toggleNavEl.handleOpen());
}
