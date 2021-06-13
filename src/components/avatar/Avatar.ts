import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-avatar-depth: 0;
    --j-avatar-size: var(--j-element-md);
    --j-avatar-border: 2px solid transparent;
  }
  :host([selected]) {
    --j-avatar-border: 2px solid var(--j-color-primary-500);
  }
  :host([online]) {
    --j-avatar-border: 2px solid var(--j-color-success-500);
  }
  :host([size="xs"]) {
    --j-avatar-size: var(--j-element-xs);
  }
  :host([size="sm"]) {
    --j-avatar-size: var(--j-element-sm);
  }
  :host([size="lg"]) {
    --j-avatar-size: var(--j-element-lg);
  }
  :host([size="xl"]) {
    --j-avatar-size: var(--j-element-xl);
  }
  [part="base"] {
    background: var(--j-color-ui-100);
    box-shadow: var(--j-avatar-depth);
    border: var(--j-avatar-border);
    cursor: pointer;
    padding: 0;
    width: var(--j-avatar-size);
    height: var(--j-avatar-size);
    border-radius: 50%;
  }
  [part="img"] {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  [part="initials"] {
    color: var(--j-color-black);
    text-transform: uppercase;
  }
`;

@customElement("j-avatar")
export default class Component extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Img src
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true }) src = "";

  /**
   * Avatar is selected
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /**
   * User is online
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true }) online = false;

  /**
   * Placeholder initials
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true }) initials = "";

  /**
   * Sizes
   * @type {""|"xs"|"sm"|"lg"|"xl"}
   * @attr
   */
  @property({ type: String, reflect: true }) size = "";

  render() {
    return html`<button part="base">
      ${this.src
        ? html`<img part="img" src=${this.src} />`
        : html`<span part="initials">${this.initials}</span>`}
    </button>`;
  }
}
