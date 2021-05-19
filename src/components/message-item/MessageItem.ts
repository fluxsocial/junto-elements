import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-message-item-padding: 0 var(--j-space-500);
  }
  [part="content"] {
    position: relative;
    padding-right: var(--j-space-400);
    padding-top: var(--j-space-500);
    padding-bottom: var(--j-space-500);
    padding-left: var(--j-space-1000);
    border-radius: var(--j-border-radius);
    box-shadow: var(--j-depth-100);
  }
  [part="content"]:hover {
    background: var(--j-color-ui-50);
  }
  [part="metadata"] {
    display: flex;
    align-items: center;
    gap: var(--j-space-300);
    margin-bottom: var(--j-space-300);
  }
  [part="username"]::slotted(*) {
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
  }
  [part="timestamp"] {
    color: var(--j-color-ui-400);
    font-size: var(--j-font-size-300);
  }
  [part="username"]::slotted(*:hover) {
    text-decoration: underline;
  }
  [part="avatar"]::slotted(*) {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 100%;
    position: absolute;
    top: 15px;
    left: 15px;
  }
`;

@customElement("j-message-item")
export default class Button extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Date
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  timestamp = "";

  render() {
    const formattedTime = this.timestamp
      ? new Intl.DateTimeFormat("en-US").format(new Date(this.timestamp))
      : null;

    return html`
      <div part="base" role="listitem">
        <div part="content">
          <slot name="avatar" part="avatar"></slot>
          <div part="metadata">
            <slot part="username" name="username"></slot>
            <span part="timestamp">${formattedTime}</span>
          </div>
          <slot part="message" name="message"><slot></slot></slot>
        </div>
      </div>
    `;
  }
}
