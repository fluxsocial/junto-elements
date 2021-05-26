import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-menu-item-border-left: none;
    --j-menu-item-border-radius: none;
    --j-menu-item-height: var(--j-element-md);
    --j-menu-item-bg: transparent;
    --j-menu-item-bg-hover: var(--j-color-ui-50);
    --j-menu-item-color: var(--j-color-ui-600);
    --j-menu-item-color-hover: var(--j-color-ui-600);
    --j-menu-item-padding: 0 var(--j-space-500) 0 var(--j-space-500);
    --j-menu-item-font-weight: 400;
  }
  :host([active]) {
    --j-menu-item-font-weight: 400;
    --j-menu-item-bg: var(--j-color-ui-50);
    --j-menu-item-bg-hover: var(--j-color-ui-50);
    --j-menu-item-color: var(--j-color-ui-600);
    --j-menu-item-color-hover: var(--j-color-ui-600);
  }
  :host([selected]),
  :host([selected]) [part="base"]:hover {
    --j-menu-item-font-weight: 500;
    --j-menu-item-bg: var(--j-color-primary-100);
    --j-menu-item-bg-hover: var(--j-color-primary-100);
    --j-menu-item-color: var(--j-color-primary-500);
    --j-menu-item-color-hover: var(--j-color-primary-500);
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
    gap: var(--j-space-500);
    border-radius: var(--j-menu-item-border-radius);
    background: var(--j-menu-item-bg);
    text-decoration: none;
    cursor: pointer;
    font-size: var(--j-font-size-500);
    height: var(--j-menu-item-height);
    padding: var(--j-menu-item-padding);
    color: var(--j-menu-item-color);
    font-weight: var(--j-menu-item-font-weight);
    border-left: var(--j-menu-item-border-left);
  }
  [part="base"]:hover {
    color: var(--j-menu-item-color-hover);
    background: var(--j-menu-item-bg-hover);
  }
  [part="content"] {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
   * Active
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  active = false;

  /**
   * Value
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  value = "";

  @state()
  _label = "";

  get label() {
    return this._label || this.getAttribute("label") || this.innerText;
  }

  set label(val) {
    this._label = val;
    this.setAttribute("label", val);
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
