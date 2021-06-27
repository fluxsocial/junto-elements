import { html, css, LitElement } from "lit";
import renderIcon from "@holo-host/identicon";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-avatar-depth: 0;
    --j-avatar-size: var(--j-size-md);
    --j-avatar-border: 2px solid none;
    --j-avatar-color: var(--j-color-white);
    --j-avatar-bg: var(--j-color-ui-200);
  }
  :host([selected]) {
    --j-avatar-border: 2px solid var(--j-color-primary-500);
  }
  :host([online]) {
    --j-avatar-border: 2px solid var(--j-color-success-500);
  }
  :host([size="xs"]) {
    --j-avatar-size: var(--j-size-xs);
  }
  :host([size="sm"]) {
    --j-avatar-size: var(--j-size-sm);
  }
  :host([size="lg"]) {
    --j-avatar-size: var(--j-size-lg);
  }
  :host([size="xl"]) {
    --j-avatar-size: var(--j-size-xl);
  }
  [part="base"] {
    color: var(--j-avatar-color);
    background: var(--j-avatar-bg);
    box-shadow: var(--j-avatar-depth);
    border: var(--j-avatar-border);
    padding: 0;
    width: var(--j-avatar-size);
    height: var(--j-avatar-size);
    border-radius: 50%;
  }
  [part="icon"] {
    --j-icon-size: calc(var(--j-avatar-size) * 0.6);
  }
  [part="img"] {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  [part="initials"] {
    font-weight: 600;
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
   * Hash
   * @type {String}
   * @attr
   */
  @property({ type: Uint8Array, reflect: true }) hash = null;

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

  firstUpdated() {
    const canvas = this.shadowRoot.querySelector("#identicon");
    const opts = {
      hash: this.hash,
      size: 100,
    };
    if (canvas) {
      renderIcon(opts, canvas);
    }
  }

  render() {
    if (this.hash) {
      return html`<canvas
        part="base"
        id="identicon"
        width="1"
        height="1"
      ></canvas>`;
    }

    if (this.src) {
      return html`<button part="base">
        <img part="img" src=${this.src} />
      </button>`;
    }

    if (this.initials) {
      return html`<button part="base">
        <span part="initials">${this.initials}</span>
      </button>`;
    }

    return html`<button part="base">
      <j-icon part="icon" name="person-fill"></j-icon>
    </button>`;
  }
}
