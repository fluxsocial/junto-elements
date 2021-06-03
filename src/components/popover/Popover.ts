import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createPopper } from "@popperjs/core";
import sharedStyles from "../../shared/styles";

type Placement =
  | "auto"
  | "auto-start"
  | "auto-end"
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "right"
  | "right-start"
  | "right-end"
  | "left"
  | "left-start"
  | "left-end";

const styles = css`
  :host {
    z-index: 999;
    display: none;
  }
  :host([open]) {
    display: inline-block;
  }
  :host [part="base"] {
    display: none;
  }
  :host([open]) [part="base"] {
    display: block;
    animation: fade-in 0.2s ease;
  }
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

@customElement("j-popover")
export default class Popover extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Open
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Placement
   * @type {"auto"|"auto-start"|"auto-end"|"top"|"top-start"|"top-end"|"bottom"|"bottom-start"|"bottom-end"|"right"|"right-start"|"right-end"|"left"|"left-start"|"left-end}
   * @attr
   */
  @property({ type: String, reflect: true })
  placement = "auto";

  /**
   * Open
   * @type {"contextmenu"|"mouseover"|"click"}
   * @attr
   */
  @property({ type: String, reflect: true })
  event = "click";

  /**
   * Selector
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  selector = "";

  constructor() {
    super();
    this._openMenuHandler = this._openMenuHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    const trigger = document.querySelector(this.selector);

    trigger.addEventListener(this.event, this._openMenuHandler);

    if (this.event === "mouseover") {
      this.addEventListener("mouseover", () => (this.open = true));
      this.addEventListener("mouseleave", () => (this.open = false));
      trigger.addEventListener("mouseleave", () => (this.open = false));
    }

    // Handle click outside
    window.addEventListener("mousedown", (e) => {
      const clickedTrigger = trigger.contains(e.target as Node);
      const clickedInside = this.contains(e.target as Node);
      if (!clickedInside && !clickedTrigger) {
        this.open = false;
      }
    });
  }

  _openMenuHandler(e) {
    //e.stopPropagation();
    e.preventDefault();
    this.open = true;

    const trigger = document.querySelector(this.selector);

    if (this.event === "contextmenu") {
      const generateGetBoundingClientRect = (x = 0, y = 0) => {
        return () => ({
          width: 0,
          height: 0,
          top: y,
          right: x,
          bottom: y,
          left: x,
        });
      };

      const virtualElement = {
        contextElement: trigger,
        getBoundingClientRect: generateGetBoundingClientRect(),
      };

      const instance = createPopper(virtualElement, this, {
        placement: this.placement as Placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [10, 10],
            },
          },
        ],
      });

      virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
        e.clientX,
        e.clientY
      );
      instance.update();
    } else {
      createPopper(trigger, this, {
        placement: this.placement as Placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [10, 10],
            },
          },
        ],
      });
    }
  }

  render() {
    return html` <div part="base"><slot></slot></div> `;
  }
}
