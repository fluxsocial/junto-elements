import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-message-item-padding: var(--j-space-300) var(--j-space-500);
  }
  [part="base"] {
    display: flex;
    position: relative;
    padding: var(--j-message-item-padding);
    gap: var(--j-space-200);
    border-radius: none;
    font-size: var(--j-font-size-500);
  }
  [part="base"]:hover {
    background: var(--j-color-ui-50);
  }
  :host([hideuser]) [part="base"] [part="timestamp"] {
    display: none;
  }
  :host([hideuser]) [part="base"]:hover [part="timestamp"] {
    display: block;
  }
  [part="sidebar"] {
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  [part="main"] {
    flex: 1;
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
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 100%;
  }
  [name="message"]::slotted(pre) {
    background: var(--j-color-black);
    color: var(--j-color-white);
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

  /**
   * Hide user
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  hideuser = false;

  render() {
    const shortTime = this.timestamp
      ? new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(this.timestamp))
      : null;

    const longTime = this.timestamp
      ? new Intl.DateTimeFormat("en-US").format(new Date(this.timestamp))
      : null;

    function timeStamp() {
      return html`
        <j-tooltip placement="top" title=${longTime}>
          <span part="timestamp">${shortTime}</span>
        </j-tooltip>
      `;
    }

    return html`
      <div part="base" role="listitem">
        <div part="sidebar">
          ${this.hideuser
            ? timeStamp()
            : html`<slot part="avatar" name="avatar"></slot>`}
        </div>
        <div part="main">
          ${this.hideuser
            ? null
            : html`<div part="metadata">
                <slot part="username" name="username"></slot>
                ${timeStamp()}
              </div>`}
          <div part="message">
            <slot name="message"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
