import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-toast-border: 1px solid var(--j-color-ui-100);
    --j-toast-background: var(--j-color-ui-50);
    --j-toast-color: var(--j-color-ui-700);
  }
  :host([variant="success"]) {
    --j-toast-border: 1px solid var(--j-color-success-100);
    --j-toast-background: var(--j-color-success-50);
    --j-toast-color: var(--j-color-success-700);
  }
  :host([variant="danger"]) {
    --j-toast-border: 1px solid var(--j-color-danger-100);
    --j-toast-background: var(--j-color-danger-50);
    --j-toast-color: var(--j-color-danger-700);
  }
  :host([variant="warning"]) {
    --j-toast-border: 1px solid var(--j-color-warning-100);
    --j-toast-background: var(--j-color-warning-50);
    --j-toast-color: var(--j-color-warning-700);
  }
  :host {
    display: none;
  }
  :host([open]) {
    display: block;
    animation: fade-up 0.2s ease;
  }
  [part="base"] {
    box-shadow: var(--j-depth-100);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: var(--j-border-radius);
    position: absolute;
    bottom: var(--j-space-400);
    left: 50%;
    transform: translateX(-50%);
    background: var(--j-toast-background);
    border: var(--j-toast-border);
    color: var(--j-toast-color);
    max-width: 500px;
    min-width: 150px;
    width: 400px;
    padding: var(--j-space-500);
  }

  @keyframes fade-up {
    from {
      transform: translateY(20px);
    }
    to {
      transform: translateY(0px);
    }
  }
`;

@customElement("j-toast")
export default class Component extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Variant
   * @type {""|"success"|"danger"|"warning"}
   * @attr
   */
  @property({ type: String, reflect: true }) variant = "";

  /**
   * Open
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Number of seconds before toast autohides
   * @type {Number}
   * @attr
   */
  @property({ type: Number, reflect: true }) autohide = 5;

  autoClose() {
    if (this.autohide > 0) {
      setTimeout(() => {
        this.open = false;
      }, this.autohide * 1000);
    }
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("open")) {
      this.autoClose();
      this.dispatchEvent(new CustomEvent("toggle", { bubbles: true }));
    }
    return true;
  }

  render() {
    return html`<div part="base">
      <div part="content"><slot></slot></div>
      <j-button
        @click=${() => (this.open = false)}
        size="sm"
        variant="transparent"
      >
        <j-icon size="sm" name="x"></j-icon>
      </j-button>
    </div>`;
  }
}
