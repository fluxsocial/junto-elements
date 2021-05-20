import { LitElement, html, css } from "lit";
import sharedStyles from "../../shared/styles";

const styles = css``;

class Checkbox extends LitElement {
  constructor() {
    super();
    this.checked = false;
    this.full = false;
    this.disabled = false;
    this.size = "";
    this.value = "";
    this._handleChange = this._handleChange.bind(this);
  }

  static get properties() {
    return {
      checked: { type: Boolean },
      disabled: { type: Boolean },
      full: { type: Boolean },
      size: { type: String, reflect: true },
      value: { type: String },
    };
  }

  static get styles() {
    return [styles, sharedStyles];
  }

  _handleChange(e) {
    e.stopPropagation();
    this.checked = e.target.checked;
    this.dispatchEvent(new CustomEvent("change", e));
  }

  render() {
    return html`
      <label part="base">
        <input
          ?disabled=${this.disabled}
          @change=${this._handleChange}
          ?checked=${this.checked}
          value=${this.value}
          type="checkbox"
        />
        <span part="label"><slot></slot></span>
        <span aria-hidden="true" part="indicator"></span>
      </label>
    `;
  }
}

customElements.define("j-checkbox", Checkbox);

export default Checkbox;
