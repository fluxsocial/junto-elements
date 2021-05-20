import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-menu-item-height: var(--j-element-md);
    --j-menu-item-bg: transparent;
    --j-menu-item-bg-hover: var(--j-color-ui-50);
  }
  :host([selected]) {
    --j-menu-item-bg: var(--j-color-primary-300);
    --j-menu-item-bg-hover: var(--j-color-primary-300);
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
    border-radius: var(--j-border-radius);
    background: var(--j-menu-item-bg);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    height: var(--j-menu-item-height);
    padding: 0 var(--j-space-500);
    color: var(--j-color-ui-500);
    font-weight: 400;
  }
  [part="base"]:hover {
    color: var(--j-color-ui-800);
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
