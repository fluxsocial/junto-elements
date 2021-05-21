import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createPopper } from "@popperjs/core";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    position: relative;
  }
  [part="base"] {
  }
  [part="input"]::part(input-field) {
    cursor: pointer;
  }
  [part="menu"] {
    position: absolute;
    left: 0;
    top: 80px;
    max-height: 400px;
    overflow-y: auto;
    width: 250px;
    visibility: hidden;
  }
  :host([open]) [part="menu"] {
    height: fit-content;
    visibility: visible;
    z-index: 999;
  }
`;

@customElement("j-select")
export default class Select extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Selected
   * @type {String}
   * @attr
   */
  @property({
    type: String,
    reflect: true,
  })
  value = "";

  /**
   * Label
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  label = "";

  /**
   * Open
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Input value
   * @type {Boolean}
   * @attr
   */
  @property({ type: String, reflect: true })
  inputValue = "";

  firstUpdated() {
    const input = this.renderRoot.querySelector("[part='input-wrapper']");
    const menu = this.renderRoot.querySelector("[part='menu']") as any;

    const options = this.querySelectorAll("[value]");

    options.forEach((option) => {
      option.addEventListener("mousedown", (e: any) => {
        this.open = false;
        this.value = e.target.value;
        this.inputValue = e.target.label;
      });
    });

    // Handle click outside
    window.addEventListener("click", (e) => {
      const clickedInput = this.contains(e.target as Node);
      const clickedMenu = this.contains(e.target as Node);
      if (!clickedInput && !clickedMenu) {
        this.open = false;
      }
    });
  }

  _handleInputClick(e) {
    e.preventDefault();
    setTimeout(() => {
      this.open = true;
    }, 0);
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("value")) {
      this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
      this.querySelectorAll("[value]").forEach((option) => {
        option.removeAttribute("selected");
        if (option.getAttribute("value") === this.value) {
          option.setAttribute("selected", "");
        }
      });
    }

    return true;
  }

  render() {
    return html` <div part="base">
      <j-input
        label=${this.label}
        readonly
        @click=${this._handleInputClick}
        .value=${this.inputValue}
        part="input"
      ></j-input>

      <nav part="menu">
        <slot></slot>
      </nav>
    </div>`;
  }
}
