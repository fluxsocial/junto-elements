import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-text-font-color: var(--j-color-ui-800);
    --j-text-font-weight: initial;
    --j-text-font-size: var(--j-font-size-500);
    --j-text-margin-bottom: 0;
  }

  :host > *:first-child {
    margin: 0;
    color: var(--j-text-font-color);
    font-weight: var(--j-text-font-weight);
    font-size: var(--j-text-font-size);
    margin-bottom: var(--j-text-margin-bottom);
  }

  :host([variant="heading"]) {
    --j-text-font-color: var(--j-color-ui-700);
    --j-text-font-size: var(--j-font-size-800);
    --j-text-font-weight: 600;
    --j-text-margin-bottom: var(--j-space-700);
  }

  :host([variant="heading-sm"]) {
    --j-text-font-color: var(--j-color-ui-700);
    --j-text-font-size: var(--j-font-size-700);
    --j-text-font-weight: 600;
    --j-text-margin-bottom: var(--j-space-600);
  }

  :host([variant="heading-lg"]) {
    --j-text-font-color: var(--j-color-ui-700);
    --j-text-font-size: var(--j-font-size-900);
    --j-text-font-weight: 600;
    --j-text-margin-bottom: var(--j-space-900);
  }

  :host([variant="ingress"]) {
    --j-text-font-color: var(--j-color-ui-700);
    --j-text-font-size: var(--j-font-size-600);
    --j-text-font-weight: 400;
    --j-text-margin-bottom: var(--j-space-500);
  }

  :host([variant="subheading"]) {
    --j-text-font-color: var(--j-color-ui-800);
    --j-text-font-size: var(--j-font-size-700);
    --j-text-font-weight: 400;
    --j-text-margin-bottom: var(--j-space-600);
  }

  :host([variant="body"]) {
    --j-text-font-color: var(--j-color-ui-600);
    --j-text-font-size: var(--j-font-size-500);
    --j-text-font-weight: 400;
    --j-text-margin-bottom: var(--j-space-400);
  }

  :host([variant="footnote"]) {
    --j-text-font-color: var(--j-color-ui-600);
    --j-text-font-size: var(--j-font-size-400);
    --j-text-font-weight: 400;
    --j-text-margin-bottom: var(--j-space-300);
  }

  :host([nomargin]) {
    --j-text-margin-bottom: 0;
  }

  :host([size="200"]) {
    --j-text-font-size: var(--j-font-size-200);
  }

  :host([size="300"]) {
    --j-text-font-size: var(--j-font-size-300);
  }

  :host([size="400"]) {
    --j-text-font-size: var(--j-font-size-400);
  }

  :host([size="500"]) {
    --j-text-font-size: var(--j-font-size-x-md);
  }

  :host([size="600"]) {
    --j-text-font-size: var(--j-font-size-600);
  }

  :host([size="700"]) {
    --j-text-font-size: var(--j-font-size-700);
  }

  :host([size="800"]) {
    --j-text-font-size: var(--j-font-size-800);
  }

  :host([size="900"]) {
    --j-text-font-size: var(--j-font-size-900);
  }

  :host([size="1000"]) {
    --j-text-font-size: var(--j-font-size-1000);
  }
`;

@customElement("j-text")
export default class Text extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Sizes
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900"|"1000"}
   * @attr
   */
  @property({ type: String, reflect: true }) size = "";

  /**
   * Variants
   * @type {""|"heading-lg"|"heading"|"heading-sm"|"subheading"|""ingress"|"body"|"footnote"}
   * @attr
   */
  @property({ type: String, reflect: true }) variant = "body";

  /**
   * Tag to render
   * @type {""|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"p"|"small"|"b"|"span"|"div"}
   * @attr
   */
  @property({ type: String, reflect: true }) tag = "";

  /**
   * No margin
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true }) nomargin = "";

  render() {
    switch (this.tag) {
      case "h1":
        return html`<h1 part="base"><slot></slot></h1>`;
      case "h2":
        return html`<h2 part="base"><slot></slot></h2>`;
      case "h3":
        return html`<h3 part="base"><slot></slot></h3>`;
      case "h4":
        return html`<h4 part="base"><slot></slot></h4>`;
      case "h5":
        return html`<h5 part="base"><slot></slot></h5>`;
      case "h6":
        return html`<h6 part="base"><slot></slot></h6>`;
      case "p":
        return html`<p part="base"><slot></slot></p>`;
      case "small":
        return html`<small part="base"><slot></slot></small>`;
      case "b":
        return html`<b part="base"><slot></slot></b>`;
      case "i":
        return html`<i part="base"><slot></slot></i>`;
      case "span":
        return html`<span part="base"><slot></slot></span>`;
      case "div":
        return html`<div part="base"><slot></slot></div>`;
      default:
        return html`<div part="base"><slot></slot></div>`;
    }
  }
}
