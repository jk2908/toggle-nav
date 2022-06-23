import { ToggleNav, externalTrigger } from './src/ToggleNav';

if (
  document.querySelector('[data-toggle-nav-open]') &&
  document.querySelector('toggle-nav').hasAttribute('external-trigger')
) {
  externalTrigger();
}

if (!customElements.get('toggle-nav')) {
  customElements.define('toggle-nav', ToggleNav);
}
