import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-community-item-depth: 0;
    --j-community-item-size: var(--j-element-xl);
    --j-community-item-border: 3px solid transparent;
  }
  :host(:hover) {
    --j-community-item-depth: var(--j-depth-100);
  }
  :host([selected]) {
    --j-community-item-depth: var(--j-depth-200);
    --j-community-item-border: 3px solid var(--j-color-primary-500);
  }
  [part="base"] {
    background: none;
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
`;

@customElement("j-community-item")
export default class Component extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: String, reflect: true }) src = "";

  @property({ type: Boolean, reflect: true }) selected = false;

  render() {
    return html`<button part="base">
      <img part="img" src=${this.src} />
    </button>`;
  }
}
