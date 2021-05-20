import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createPopper } from "@popperjs/core";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
  }
  [part="base"] {
    border: 1px solid var(--j-color-ui-200);
    background: var(--j-color-white);
    height: var(--j-element-md);
    position: relative;
    width: 250px;
  }
  [part="input"] {
    width: 100%;
  }
  [part="overlay"] {
    width: 250px;
    visibility: hidden;
  }
  :host([open]) [part="overlay"] {
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
  @property({ type: String, reflect: true })
  value = "";

  /**
   * Selected
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  firstUpdated() {
    const input = this.renderRoot.querySelector("input");
    const menu = this.renderRoot.querySelector("nav");

    createPopper(input, menu, {
      placement: "bottom",
    });

    // Handle click outside
    window.addEventListener("mousedown", (e) => {
      const clickedInput = input.contains(e.target as Node);
      const clickedMenu = this.contains(e.target as Node);
      if (!clickedInput && !clickedMenu) {
        this.open = false;
      }
    });
  }

  _handleInputClick(e) {
    this.open = true;
  }

  render() {
    return html`<div part="base">
      <input
        @click=${this._handleInputClick}
        .value=${this.value}
        part="input"
      />
      <nav part="overlay">
        <slot></slot>
      </nav>
    </div>`;
  }
}
