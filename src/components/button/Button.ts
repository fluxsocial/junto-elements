import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-button-depth: none;
    --j-button-display: inline-flex;
    --j-button-width: initial;
    --j-button-padding: 0 var(--j-space-500);
    --j-button-bg: var(--j-color-white);
    --j-button-bg-hover: var(--j-color-white);
    --j-button-border: 1px solid var(--j-color-ui-100);
    --j-button-border-hover: 1px solid var(--j-color-ui-200);
    --j-button-text: var(--j-color-ui-800);
    --j-button-height: var(--j-element-md);
    --j-button-border-radius: var(--j-border-radius);
    --j-button-font-size: var(--j-font-size-500);
  }
  button {
    transition: box-shadow 0.2s ease;
    cursor: pointer;
    border: 0;
    align-items: center;
    justify-content: center;
    box-shadow: var(--j-button-depth);
    display: var(--j-button-display);
    width: var(--j-button-width);
    padding: var(--j-button-padding);
    height: var(--j-button-height);
    border-radius: var(--j-button-border-radius);
    background: var(--j-button-bg);
    color: var(--j-button-text);
    fill: var(--j-button-text);
    font-size: var(--j-button-font-size);
    font-family: inherit;
    border: var(--j-button-border);
    position: relative;
  }

  button:not([disabled]):hover {
    border: var(--j-button-border-hover);
    background-color: var(--j-button-bg-hover);
  }
  button[disabled] {
    opacity: 0.5;
    cursor: default;
  }

  j-spinner {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  :host([loading]) j-spinner {
    display: block;
    --j-spinner-color: var(--j-button-text);
  }

  :host([loading]) [part="base"] slot {
    visibility: hidden;
    opacity: 0;
  }

  :host([variant="primary"]) {
    --j-button-bg: var(--j-color-primary-600);
    --j-button-bg-hover: var(--j-color-primary-500);
    --j-button-text: var(--j-color-white);
    --j-button-border: 1px solid transparent;
    --j-button-border-hover: 1px solid transparent;
  }
  :host([variant="transparent"]) {
    --j-button-bg: transparent;
    --j-button-text: var(--j-color-font);
    --j-button-bg-hover: transparent;
    --j-button-border: 1px solid transparent;
    --j-button-border-hover: 1px solid transparent;
  }
  :host([variant="success"]) {
    --j-button-bg: var(--j-color-success-400);
    --j-button-bg-hover: var(--j-color-success-500);
    --j-button-text: var(--j-color-white);
    --j-button-border: 1px solid transparent;
    --j-button-border-hover: 1px solid transparent;
  }
  :host([variant="danger"]) {
    --j-button-bg: var(--j-color-danger-400);
    --j-button-bg-hover: var(--j-color-danger-500);
    --j-button-text: var(--j-color-white);
    --j-button-border: 1px solid transparent;
    --j-button-border-hover: 1px solid transparent;
  }
  :host([size="sm"]) {
    --j-button-font-size: var(--j-font-size-400);
    --j-button-padding: 0 var(--j-space-400);
    --j-button-height: var(--j-element-sm);
  }
  :host([size="lg"]) {
    --j-button-font-size: var(--j-font-size-500);
    --j-button-height: var(--j-element-lg);
    --j-button-padding: 0 var(--j-space-600);
  }
  :host([size="xl"]) {
    --j-button-font-size: var(--j-font-size-700);
    --j-button-height: var(--j-element-xl);
    --j-button-padding: 0 var(--j-space-600);
  }
  :host([full]) {
    --j-button-display: flex;
    --j-button-width: 100%;
  }
  :host([square]) {
    --j-button-padding: 0;
    --j-button-width: var(--j-button-height);
  }
  :host([circle]) {
    --j-button-border-radius: 50%;
  }
`;

@customElement("j-button")
export default class Button extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Variations
   * @type {""|"primary"|"transparent"|"success"|"danger"}
   * @attr
   */
  @property({ type: String, reflect: true })
  variant = "";

  /**
   * Sizes
   * @type {""|"sm"|"lg"}
   * @attr
   */
  @property({ type: String, reflect: true })
  size = "";

  /**
   * Disabled
   * @type {boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Loading
   * @type {boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * Squared
   * @type {boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  square = false;

  /**
   * Full
   * @type {boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  full = false;

  /**
   * Circle
   * @type {boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  circle = false;

  render() {
    return html`
      <button part="base" ?disabled=${this.disabled}>
        <j-spinner size="sm"></j-spinner>
        <slot></slot>
      </button>
    `;
  }
}
