import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createPopper } from "@popperjs/core";
import sharedStyles from "../../shared/styles";

const keyCodes = {
  32: "space",
  27: "escape",
  13: "enter",
  8: "backspace",
  38: "up",
  40: "down",
};

const styles = css`
  :host {
  }
  [part="base"] {
    position: relative;
  }
  [part="input"]::part(input-field) {
    cursor: pointer;
  }
  [part="menu"] {
    background: var(--j-color-white);
    position: absolute;
    left: 0;
    top: 120%;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    border: 1px solid var(--j-color-ui-100);
    border-radius: var(--j-border-radius);
    visibility: hidden;
  }
  :host([open]) [part="menu"] {
    height: fit-content;
    visibility: visible;
    z-index: 999;
  }
  [part="arrow"] {
    position: absolute;
    right: var(--j-space-400);
    top: 55%;
    transform: translateY(-50%);
  }
`;

@customElement("j-select")
export default class Select extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Value
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

  get optionElements() {
    return [...this.querySelectorAll("[value]")];
  }

  get selectedElement() {
    return this.optionElements.find((el: any) => el.value === this.value);
  }

  get activeElement() {
    return this.optionElements.find((el) => el.hasAttribute("active")) as any;
  }

  firstUpdated() {
    this.optionElements.forEach((option) => {
      option.addEventListener("mousedown", (e: any) => {
        this.open = false;
        this.value = e.target.value;
        this.inputValue = e.target.label;
      });
    });

    this.addEventListener("keydown", (e) => {
      e.preventDefault();
      const { keyCode } = e;

      const keyName = keyCodes[keyCode];

      if (keyName === "escape") {
        this.open = false;
        return;
      }

      if ((keyName === "up" || "down" || "enter" || "space") && !this.open) {
        this.open = true;
        this.optionElements.forEach((el, index) => {
          if (index === 0) el.setAttribute("active", "");
          else el.removeAttribute("active");
        });
        return;
      }

      if (keyName === "enter" && this.open && this.activeElement) {
        this.value === this.activeElement.value;
        this.inputValue = this.activeElement.label;
        this.open = false;
      }

      if (keyName === "down" && this.open) {
        const activeIndex = this.optionElements.findIndex((el) =>
          el.hasAttribute("active")
        );
        this.activeElement?.removeAttribute("active");
        this.optionElements.forEach((el, index) => {
          if (index + 1 > this.optionElements.length) {
            this.optionElements[0].setAttribute("active", "");
          } else if (index === activeIndex + 1) {
            el.setAttribute("active", "");
          }
        });
      }

      if (keyName === "up" && this.open) {
        const activeIndex = this.optionElements.findIndex((el) =>
          el.hasAttribute("active")
        );

        this.optionElements.forEach((el, index) => {
          if (activeIndex === 0) {
            this.optionElements[this.optionElements.length - 1].setAttribute(
              "active",
              ""
            );
          } else if (index === activeIndex - 1) {
            el.setAttribute("active", "");
          } else {
            this.activeElement?.removeAttribute("active");
          }
        });
      }
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
        if (option.getAttribute("value") === this.value) {
          option.setAttribute("selected", "");
        } else {
          option.removeAttribute("selected");
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
      <j-icon part="arrow" name="chevron-down"></j-icon>
      <nav part="menu">
        <slot></slot>
      </nav>
    </div>`;
  }
}
