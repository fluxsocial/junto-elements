import { html, css, LitElement } from "lit";
import { unsafeSVG } from "lit-html/directives/unsafe-svg";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-icon-color: currentColor;
    --j-icon-size: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  :host svg {
    color: var(--j-icon-color);
    fill: var(--j-icon-color);
    display: block;
    width: var(--j-icon-size);
    height: var(--j-icon-size);
  }
  :host([size="xs"]) svg {
    --j-icon-size: 16px;
  }
  :host([size="sm"]) svg {
    --j-icon-size: 18px;
  }
  :host([size="lg"]) svg {
    --j-icon-size: 32px;
  }
  :host([size="xl"]) svg {
    --j-icon-size: 48px;
  }
`;

@customElement("j-icon")
export default class Icon extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Open
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  name = "";

  /**
   * Size
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  size = "";

  /**
   * Color
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  color = "";

  @state()
  svg = "";

  firstUpdated() {
    this.fetchIcon();
  }

  fetchIcon() {
    fetch(`https://unpkg.com/bootstrap-icons@1.5.0/icons/${this.name}.svg`)
      .then((res) => res.text())
      .then((svg) => (this.svg = svg));
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("name")) {
      this.fetchIcon();
    }

    if (changedProperties.has("color") && this.color) {
      this.style.setProperty("--j-icon-color", `var(--j-color-${this.color})`);
    }

    return true;
  }

  render() {
    return html`${unsafeSVG(this.svg)}`;
  }
}
