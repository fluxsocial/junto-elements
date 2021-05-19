import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-menu-item-bg: transparent;
    --j-menu-item-bg-hover: var(--j-color-ui-50);
  }
  :host([selected]) {
    --j-menu-item-bg: var(--j-color-primary-300);
    --j-menu-item-bg-hover: var(--j-color-primary-300);
  }
  :host(:last-of-type) [part="base"] {
    margin-bottom: 0;
  }
  [part="base"] {
    display: flex;
    gap: var(--j-space-400);
    border-radius: var(--j-border-radius);
    background: var(--j-menu-item-bg);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    padding: var(--j-space-400) var(--j-space-500);
  }
  [part="base"]:hover {
    background: var(--j-menu-item-bg-hover);
  }
  [part="content"] {
    flex: 1;
  }
  [part="title"] {
    font-size: var(--j-font-size-500);
    color: var(--j-color-ui-800);
  }
  [part="description"] {
    font-size: var(--j-font-size-400);
    color: var(--j-color-ui-500);
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
   * Title
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  title = "";

  /**
   * Description
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  description = "";

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
        <div part="title">${this.title}</div>
        <div part="description">${this.description}</div>
      </div>
      <slot name="end"></slot>
    </div>`;
  }
}
