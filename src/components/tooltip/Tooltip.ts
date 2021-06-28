import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
  }
  :host([open]) [part="tooltip"] {
    display: inline-block;
  }
  [part="tooltip"] {
    white-space: nowrap;
    z-index: 999;
    display: none;
    font-size: var(--j-font-size-400);
    padding: var(--j-space-100) var(--j-space-300);
    background: var(--j-color-ui-800);
    color: var(--j-color-ui-200);
    border-radius: var(--j-border-radius);
  }
  [part="arrow"],
  [part="arrow"]::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  [part="arrow"] {
    visibility: hidden;
  }

  [part="arrow"]::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }
  [part="tooltip"][data-popper-placement^="top"] > [part="arrow"] {
    bottom: -4px;
  }

  [part="tooltip"][data-popper-placement^="bottom"] > [part="arrow"] {
    top: -4px;
  }

  [part="tooltip"][data-popper-placement^="left"] > [part="arrow"] {
    right: -4px;
  }

  [part="tooltip"][data-popper-placement^="right"] > [part="arrow"] {
    left: -4px;
  }
`;

@customElement("j-tooltip")
export default class Tooltip extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Open
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Title
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  title = "";

  /**
   * Placement
   * @type {"auto"|"auto-start"|"auto-end"|"top"|"top-start"|"top-end"|"bottom"|"bottom-start"|"bottom-end"|"right"|"right-start"|"right-end"|"left"|"left-start"|"left-end}
   * @attr
   */
  @property({ type: String, reflect: true })
  placement = "auto";

  @state()
  popperInstance = null;

  get tooltipEl() {
    return this.renderRoot.querySelector("[part='tooltip'") as any;
  }

  get contentEl() {
    return this.renderRoot.querySelector("[part='content'") as any;
  }

  firstUpdated() {
    this.popperInstance = createPopper(this.contentEl, this.tooltipEl, {
      placement: this.placement as Placement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ],
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("mouseover", () => this.show());
    this.addEventListener("mouseleave", () => this.hide());
    this.addEventListener("focusin", () => this.show());
    this.addEventListener("focusout", () => this.hide());
  }

  show() {
    this.open = true;
    this.popperInstance.update();
  }

  hide() {
    this.open = false;
    this.tooltipEl.removeAttribute("data-show");
  }

  render() {
    return html`
      <div part="base">
        <div part="tooltip">
          ${this.title}
          <div part="arrow" data-popper-arrow></div>
        </div>
        <div part="content" @click=${() => this.hide()}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
