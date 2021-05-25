import { html, css, LitElement } from "lit";
import { unsafeSVG } from "lit-html/directives/unsafe-svg";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  :host svg {
    display: block;
    width: 24px;
    height: 24px;
  }
  :host([size="xs"]) svg {
    width: 16px;
    height: 16px;
  }
  :host([size="sm"]) svg {
    width: 18px;
    height: 18px;
  }
  :host([size="lg"]) svg {
    width: 32px;
    height: 32px;
  }
  :host([size="xl"]) svg {
    width: 48px;
    height: 48px;
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

    return true;
  }

  render() {
    return html`${unsafeSVG(this.svg)}`;
  }
}
