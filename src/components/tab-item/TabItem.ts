import { LitElement, html, css } from "lit";
import { state, customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    z-index: 1;
  }
  [part="base"] {
    outline: 0;
    font-family: var(--j-font-family);
    color: var(--j-color-ui-600);
    cursor: pointer;
    z-index: 1;
    border: 0;
    font-weight: 500;
    font-size: var(--j-font-size-500);
    background: 0;
    padding: 0 var(--j-space-500);
  }
  [part="base"]:hover {
    color: var(--j-color-primary-500);
  }
  :host([checked]) [part="base"] {
    color: var(--j-color-primary-500);
  }
`;

@customElement("j-tab-item")
class TabItem extends LitElement {
  /**
   * Checked
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /**
   * Full width
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  full = false;

  /**
   * Disabled
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  _label = "";

  @state()
  _value = "";

  get label() {
    return (
      this._label ||
      this.getAttribute("label") ||
      this.innerText ||
      this.innerHTML
    );
  }

  set label(val) {
    this._label = val;
    this.setAttribute("label", val);
  }

  get value() {
    return (
      this._value ||
      this.getAttribute("value") ||
      this.innerText ||
      this.innerHTML
    );
  }

  set value(val) {
    this._value = val;
    this.setAttribute("value", val);
  }

  static get styles() {
    return [styles, sharedStyles];
  }

  _handleChange(e) {
    e.stopPropagation();
    this.checked = true;
    this.dispatchEvent(new CustomEvent("tab-selected", { bubbles: true }));
  }

  render() {
    return html`
      <button
        aria-selected=${this.checked}
        aria-controls=${this.value}
        @click=${this._handleChange}
        part="base"
        role="tab"
      >
        <slot></slot>
      </button>
    `;
  }
}

export default TabItem;
