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
  }
  [part="overlay"] {
    display: none;
  }
  :host([open]) [part="overlay"] {
    display: block;
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

  connectedCallback() {
    super.connectedCallback();

    const trigger = this.renderRoot.querySelector("input");
    const menu = this.renderRoot.querySelector("nav");

    createPopper(trigger, menu, {
      placement: "auto",
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
