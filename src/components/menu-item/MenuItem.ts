import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-menu-item-border-radius: var(--j-border-radius);
    --j-menu-item-height: var(--j-element-md);
    --j-menu-item-bg: transparent;
    --j-menu-item-color: var(--j-color-ui-600);
    --j-menu-item-color-hover: var(--j-color-ui-800);
    --j-menu-item-bg-hover: rgba(0, 0, 0, 0.05);
    --j-menu-item-padding: 0 var(--j-space-500);
  }
  :host([selected]),
  :host([selected]) [part="base"]:hover {
    --j-menu-item-bg: var(--j-color-primary-50);
    --j-menu-item-bg-hover: var(--j-color-primary-50);
    --j-menu-item-color: var(--j-color-primary-600);
    --j-menu-item-color-hover: var(--j-color-primary-600);
  }
  :host([size="sm"]) {
    --j-menu-item-height: var(--j-element-sm);
  }
  :host([size="lg"]) {
    --j-menu-item-height: var(--j-element-lg);
  }
  :host([size="xl"]) {
    --j-menu-item-height: var(--j-element-xl);
  }
  :host(:last-of-type) [part="base"] {
    margin-bottom: 0;
  }
  [part="base"] {
    display: flex;
    align-items: center;
    gap: var(--j-space-400);
    border-radius: var(--j-menu-item-border-radius);
    background: var(--j-menu-item-bg);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    height: var(--j-menu-item-height);
    padding: var(--j-menu-item-padding);
    color: var(--j-menu-item-color);
    font-weight: 400;
  }
  [part="base"]:hover {
    color: var(--j-menu-item-color-hover);
    background: var(--j-menu-item-bg-hover);
  }
  [part="content"] {
    flex: 1;
  }
  [part="start"]::slotted(*) {
    margin-left: var(--j-space-100);
  }
  [part="end"]::slotted(*) {
    margin-left: var(--j-space-100);
  }
`;

@customElement("j-menu-item")
export default class MenuItem extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Selected
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Value
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  value = "";

  /**
   * Label
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  label = "";

  firstUpdated() {
    if (!this.label) {
      this.label = this.innerText;
    }
  }

  render() {
    return html`<div part="base" role="menuitem">
      <slot name="start"></slot>
      <div part="content">
        <slot></slot>
      </div>
      <slot name="end"></slot>
    </div>`;
  }
}
