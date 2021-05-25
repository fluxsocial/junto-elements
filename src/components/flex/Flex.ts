import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

// TODO: Do we need this type  of generic component?

const styles = css`
  :host {
    --j-flex-gap: none;
    --j-flex-align-items: top;
    --j-flex-justify-content: start;
    --j-flex-display: flex;
    --j-flex-wrap: nowrap;
    --j-flex-direction: row;
  }
  :host([inline]) {
    --j-flex-display: inline-flex;
  }
  :host([wrap]) {
    --j-flex-wrap: wrap;
  }
  :host([a="center"]) {
    --j-flex-align-items: center;
  }
  :host([a="start"]) {
    --j-flex-align-items: start;
  }
  :host([a="end"]) {
    --j-flex-align-items: end;
  }
  :host([j="between"]) {
    --j-flex-justify-content: space-between;
  }
  :host([j="around"]) {
    --j-flex-justify-content: space-around;
  }
  :host([j="center"]) {
    --j-flex-justify-content: center;
  }
  [part="base"] {
    display: var(--j-flex-display);
    gap: var(--j-flex-gap);
    flex-direction: var(--j-flex-direction);
    align-items: var(--j-flex-align-items);
    justify-content: var(--j-flex-justify-content);
    flex-wrap: var(--j-flex-wrap);
  }
`;

@customElement("j-flex")
export default class Box extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Justify content
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  j = "";

  /**
   * Align items
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  a = "";

  /**
   * Wrap
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  wrap = false;

  /**
   * Gap
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  gap = "";

  /**
   * Direction
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  direction = "";

  shouldUpdate(changedProperties) {
    if (changedProperties.has("gap")) {
      this.style.setProperty("--j-flex-gap", `var(--j-space-${this.gap})`);
    }
    if (changedProperties.has("direction")) {
      this.style.setProperty("--j-flex-direction", this.direction);
    }
    return true;
  }

  render() {
    return html`
      <div part="base">
        <slot></slot>
      </div>
    `;
  }
}
