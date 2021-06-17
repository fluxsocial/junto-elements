import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

// TODO: Do we need this type  of generic component?

const styles = css`
  :host {
    --j-box-bg-color: none;
    --j-box-bg-color-hover: none;
    --j-box-border-color: none;
    --j-box-border-color-hover: none;
    --j-box-display: block;
    --j-box-padding-left: 0px;
    --j-box-padding-right: 0px;
    --j-box-padding-top: 0px;
    --j-box-padding-bottom: 0px;
    --j-box-margin-left: 0px;
    --j-box-margin-right: 0px;
    --j-box-margin-top: 0px;
    --j-box-margin-bottom: 0px;
  }
  :host([inline]) {
    --j-box-display: inline-block;
  }
  [part="base"] {
    background-color: var(--j-box-bg-color);
    padding-left: var(--j-box-padding-left);
    padding-right: var(--j-box-padding-right);
    padding-top: var(--j-box-padding-top);
    padding-right: var(--j-box-padding-right);
    padding-bottom: var(--j-box-padding-bottom);
    margin-left: var(--j-box-margin-left);
    margin-right: var(--j-box-margin-right);
    margin-top: var(--j-box-margin-top);
    margin-right: var(--j-box-margin-right);
  }
  [part="base"]:hover {
    background-color: var(--j-box-bg-color-hover);
    border-color: var(--j-box-border-color);
  }
`;

@customElement("j-box")
export default class Box extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Padding
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  p = "";

  /**
   * Padding left
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  pl = "";

  /**
   * Padding right
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  pr = "";

  /**
   * Padding top
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  pt = "";

  /**
   * Padding bottom
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  pb = "";

  /**
   * Padding horistonal
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  px = "";

  /**
   * Padding vertical
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  py = "";

  /**
   * Margin
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  m = "";

  /**
   * Margin left
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  ml = "";

  /**
   * Margin right
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  mr = "";

  /**
   * Margin top
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  mt = "";

  /**
   * Margin bottom
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  mb = "";

  /**
   * Margin horistonal
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  mx = "";

  /**
   * Margin vertical
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  my = "";

  /**
   * Background color
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  bg = "";

  /**
   * Background hover color
   * @type {""|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900}
   * @attr
   */
  @property({ type: String, reflect: true })
  bghover = "";

  shouldUpdate(changedProperties) {
    if (changedProperties.has("bg")) {
      this.style.setProperty("--j-bg-color", `var(--j-color-${this.bg})`);
    }
    if (changedProperties.has("bghover")) {
      this.style.setProperty(
        "--j-bg-color-hover",
        `var(--j-color-${this.bghover})`
      );
    }
    if (changedProperties.has("pl") && this.pl) {
      this.style.setProperty(
        "--j-box-padding-left",
        `var(--j-space-${this.pl})`
      );
    }
    if (changedProperties.has("pr") && this.pr) {
      this.style.setProperty(
        "--j-box-padding-right",
        `var(--j-space-${this.pr})`
      );
    }
    if (changedProperties.has("pt") && this.pt) {
      this.style.setProperty(
        "--j-box-padding-top",
        `var(--j-space-${this.pt})`
      );
    }
    if (changedProperties.has("pb") && this.pb) {
      this.style.setProperty(
        "--j-box-padding-bottom",
        `var(--j-space-${this.pb})`
      );
    }
    if (changedProperties.has("px") && this.px) {
      this.style.setProperty(
        "--j-box-padding-left",
        `var(--j-space-${this.px})`
      );
      this.style.setProperty(
        "--j-box-padding-right",
        `var(--j-space-${this.px})`
      );
    }
    if (changedProperties.has("py") && this.py) {
      this.style.setProperty(
        "--j-box-padding-top",
        `var(--j-space-${this.px})`
      );
      this.style.setProperty(
        "--j-box-padding-bottom",
        `var(--j-space-${this.px})`
      );
    }
    if (changedProperties.has("p") && this.p) {
      this.style.setProperty(
        "--j-box-padding-left",
        `var(--j-space-${this.p})`
      );
      this.style.setProperty(
        "--j-box-padding-right",
        `var(--j-space-${this.p})`
      );
      this.style.setProperty(
        "--j-box-padding-bottom",
        `var(--j-space-${this.p})`
      );
      this.style.setProperty("--j-box-padding-top", `var(--j-space-${this.p})`);
    }
    if (changedProperties.has("ml") && this.ml) {
      this.style.setProperty(
        "--j-box-margin-left",
        `var(--j-space-${this.ml})`
      );
    }
    if (changedProperties.has("mr") && this.mr) {
      this.style.setProperty(
        "--j-box-margin-right",
        `var(--j-space-${this.mr})`
      );
    }
    if (changedProperties.has("mt") && this.mt) {
      this.style.setProperty("--j-box-margin-top", `var(--j-space-${this.mt})`);
    }
    if (changedProperties.has("mb") && this.mb) {
      this.style.setProperty(
        "--j-box-margin-bottom",
        `var(--j-space-${this.mb})`
      );
    }
    if (changedProperties.has("mx") && this.mx) {
      this.style.setProperty(
        "--j-box-margin-left",
        `var(--j-space-${this.mx})`
      );
      this.style.setProperty(
        "--j-box-margin-right",
        `var(--j-space-${this.mx})`
      );
    }
    if (changedProperties.has("my") && this.my) {
      this.style.setProperty("--j-box-margin-top", `var(--j-space-${this.mx})`);
      this.style.setProperty(
        "--j-box-margin-bottom",
        `var(--j-space-${this.mx})`
      );
    }
    if (changedProperties.has("m") && this.m) {
      this.style.setProperty("--j-box-margin-left", `var(--j-space-${this.m})`);
      this.style.setProperty(
        "--j-box-margin-right",
        `var(--j-space-${this.m})`
      );
      this.style.setProperty(
        "--j-box-margin-bottom",
        `var(--j-space-${this.m})`
      );
      this.style.setProperty("--j-box-margin-top", `var(--j-space-${this.m})`);
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
