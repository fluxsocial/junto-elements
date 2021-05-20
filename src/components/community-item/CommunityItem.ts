import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-community-item-depth: 0;
    --j-community-item-size: var(--j-element-xl);
    --j-community-item-border: 2px solid transparent;
  }
  :host(:hover) {
    --j-community-item-depth: var(--j-depth-100);
  }
  :host([selected]) {
    --j-community-item-depth: var(--j-depth-200);
    --j-community-item-border: 2px solid var(--j-color-primary-500);
  }
  [part="base"] {
    background: var(--j-color-ui-100);
    box-shadow: var(--j-community-item-depth);
    border: var(--j-community-item-border);
    cursor: pointer;
    padding: 0;
    width: var(--j-community-item-size);
    height: var(--j-community-item-size);
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

@customElement("j-community-item")
export default class Component extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: String, reflect: true }) src = "";

  @property({ type: Boolean, reflect: true }) selected = false;

  @property({ type: String, reflect: true }) initials = false;

  render() {
    return html`<button part="base">
      ${this.src
        ? html`<img part="img" src=${this.src} />`
        : html`<span part="initials">${this.initials}</span>`}
    </button>`;
  }
}
