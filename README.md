# toggle-nav component

[demo](https://2908.app/toggle-nav/demo/)

Drop in solution for handling show/hide navigation. 


## Things
  - Styleable.
  - Traps focus by making the underlying page elements [inert](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert) when the element is active, though it does leak to the browser.
  - When not expanded, the element is `inert` and `hidden`.
  - Handles focus when opening and closing the nav, e.g. focus returns to open trigger on close.
  - Helps set the correct ARIA attributes.
  - Can be opened with default button within the component itself, or an 'external-trigger' attribute is    accepted, to allow the menu to be opened from a button elsewhere on the page.
  - Closes on ESC, or by clicking outside of the element.
  - Slots for ordering content.

### Styling
Most of the styling can be done by overriding these custom properties (with defaults):

```
--toggle-nav-background: rgb(225 225 225);
--toggle-nav-border-radius: 0;
--toggle-nav-button-focus-outline: 2px solid blue;
--toggle-nav-button-padding: 10px;
--toggle-nav-close-button-margin-inline-start: auto;
--toggle-nav-inline-size: min(100vw, 32.5rem);
--toggle-nav-inset-block: 0;
--toggle-nav-inset-inline-start: calc(100% + var(--toggle-nav-inline-size));
--toggle-nav-expanded-inset-inline-start: calc(100% - var(--toggle-nav-inline-size));
--toggle-nav-list-gap: 10px;
--toggle-nav-overlay-background: rgb(0 0 0 / 0.25);
--toggle-nav-padding: 20px;
--toggle-nav-text-size: 1rem;
--toggle-nav-transition: inset 350ms ease-in-out;
```

For example, you could do something like:
```
toggle-nav {
  --toggle-nav-inset-inline-start: calc(0px - var(--toggle-nav-inline-size));
  --toggle-nav-expanded-inset-inline-start: 0;
}
```
... in your stylesheet, to make the element appear from the left of your screen.

Some sections of the element can also be styled using the ::part pseudo-selector...
```
toggle-nav::part(header) {
  background-color: green;
}
```
Available ::part(s) to style are (header), (main), (footer). More styling can be achieved by editing toggle-nav.js directly.

### Slots
  - `open-button` and `close-button` slots mean that you can replace the default text content, or drop 
  an SVG icon in there. Like `<svg slot="open-button"></svg>`
  - Content can be placed in the `header-content`, `main-content` and `footer-content` slots. They place the content where you'd expect.

### Optional attributes
  - externalTrigger (external-trigger), Boolean: Add this to the toggle-nav element to use another element within your page as the trigger to open the navigation. Also add `data-toggle-nav-open` to the element that you want to use. `<toggle-nav external-trigger></toggle-nav>` and elsewhere `<button id="my-button" data-toggle-nav-open>My button</button>`. `aria-expanded` will be set on the external button too.
  - name (name), String: Can be added to provide an `aria-label` to the `nav` element within the component.



  
 

 

