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
  :host [part="content"] {
    z-index: 999;
    display: none;
  }
  :host([open]) [part="content"] {
    display: inline-block;
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

  constructor() {
    super();
    this._openMenuHandler = this._openMenuHandler.bind(this);
  }

  get triggerPart(): HTMLElement {
    return this.renderRoot.querySelector("[part='trigger']");
  }

  get contentPart(): HTMLElement {
    return this.renderRoot.querySelector("[part='content']");
  }

  get triggerAssignedNode(): Node {
    const slot: HTMLSlotElement =
      this.renderRoot.querySelector("[name='trigger']");
    return slot.assignedNodes()[0];
  }

  get contentAssignedNode(): Node {
    const slot: HTMLSlotElement =
      this.renderRoot.querySelector("[name='content']");
    return slot.assignedNodes()[0];
  }

  firstUpdated() {
    const trigger = this.triggerPart;
    const content = this.contentPart;

    console.log(trigger);

    trigger.addEventListener(this.event, this._openMenuHandler);

    if (this.event === "mouseover") {
      trigger.addEventListener("mouseover", () => (this.open = true));
      trigger.addEventListener("mouseleave", () => (this.open = false));
      trigger.addEventListener("mouseleave", () => (this.open = false));
    }

    // Handle click outside
    window.addEventListener("mousedown", (e) => {
      const clickedTrigger = this.triggerAssignedNode.contains(
        e.target as Node
      );
      const clickedInside = this.contentAssignedNode.contains(e.target as Node);
      if (!clickedInside && !clickedTrigger) {
        this.open = false;
      }
    });
  }

  _openMenuHandler(e) {
    //e.stopPropagation();
    e.preventDefault();
    this.open = true;

    const trigger = this.triggerPart;
    const content = this.contentPart;

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

      const instance = createPopper(virtualElement, content, {
        placement: this.placement as Placement,
        strategy: "fixed",
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
      createPopper(trigger, content, {
        placement: this.placement as Placement,
        strategy: "fixed",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [10, 10],
            },
          },
          {
            name: "computeStyles",
            options: {
              gpuAcceleration: false, // true by default
            },
          },
        ],
      });
    }
  }

  render() {
    return html`
      <div part="base">
        <span part="trigger"><slot name="trigger"></slot></span>
        <span part="content"><slot name="content"></slot></span>
      </div>
    `;
  }
}
