import { LitElement, html, css } from "lit";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-input-label-size: var(--j-font-size-500);
    --j-input-height: var(--j-element-md);
  }
  :host([size="sm"]) {
    --j-input-height: var(--j-element-sm);
  }
  :host([size="lg"]) {
    --j-input-height: var(--j-element-lg);
  }
  [part="base"] {
    display: block;
  }
  [part="label"] {
    display: inline-block;
    color: var(--j-color-ui-800);
    font-weight: 500;
    font-size: var(--j-input-label-size);
    margin-bottom: var(--j-space-400);
  }
  [part="input-wrapper"] {
    display: block;
    position: relative;
    height: var(--j-input-height);
  }
  [part="input-field"] {
    font-size: var(--j-font-size-400);
    color: var(--j-color-black);
    background: var(--j-color-white);
    border-radius: var(--j-border-radius);
    border: 1px solid var(--j-color-ui-200);
    height: 100%;
    width: 100%;
    min-width: 200px;
    padding: 0px var(--j-space-400);
  }
  [part="help-text"],
  [part="error-text"] {
    margin-top: var(--j-space-300);
    font-size: var(--j-font-size-400);
  }
  [part="error-text"] {
    color: var(--j-color-danger-500);
  }
  [part="end"]::slotted(*) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: var(--j-space-400);
  }
`;

class Input extends LitElement {
  constructor() {
    super();
    this.value = "";
    this.max = "";
    this.min = "";
    this.maxlength = "";
    this.autocomplete = false;
    this.autofocus = false;
    this.placeholder = "";
    this.disabled = false;
    this.full = false;
    this.label = "";
    this.size = "";
    this.error = false;
    this.required = false;
    this.readonly = false;
    this.errorText = "";
    this.helpText = "";
    this.type = "text";
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this._initialValue = "";
  }

  static get properties() {
    return {
      errorText: { type: String, attribute: "error-text" },
      helpText: { type: String, attribute: "help-text" },
      size: { type: String, reflect: true },
      placeholder: { type: String },
      label: { type: String },
      full: { type: Boolean },
      value: { type: String, reflect: true },
      error: { type: Boolean },
      max: { type: String },
      min: { type: String },
      maxlength: { type: String },
      autocomplete: { type: Boolean },
      autofocus: { type: Boolean },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      required: { type: Boolean },
      type: { type: String },
    };
  }

  static get styles() {
    return [styles, sharedStyles];
  }

  connectedCallback() {
    super.connectedCallback();
    this._initialValue = this.value;
  }

  onInput(e) {
    // First stop default input event to bubble up
    e.stopPropagation();
    // Set the value to the target value
    // this will then become the e.target.value of the custom event
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent("input", e));
  }

  onChange(e) {
    // First stop default input event to bubble up
    e.stopPropagation();
    // Set the value to the target value
    // this will then become the e.target.value of the custom event
    this.value = e.target.value;

    const valid = this.renderRoot.querySelector("input").checkValidity();

    const message = this.renderRoot.querySelector("input").validationMessage;

    if (!this.errorText) {
      this.errorText = message;
    }

    if (!valid) {
      this.error = true;
    } else {
      this.error = false;
    }

    this.dispatchEvent(new CustomEvent("change", e));
  }

  onFocus(e) {
    e.stopPropagation();
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent("change", e));
  }

  onBlur(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("blur", e));
  }

  render() {
    return html`
      <div part="base">
        ${this.label && html` <label part="label">${this.label}</label> `}
        <div part="input-wrapper">
          <slot part="start" name="start"></slot>
          <input
            part="input-field"
            .value=${this.value}
            max=${this.max}
            min=${this.min}
            @input=${this.onInput}
            @blur=${this.onBlur}
            @focus=${this.onFocus}
            @change=${this.onChange}
            @invalid=${this.onInvalid}
            maxlength=${this.maxlength}
            ?autocomplete=${this.autocomplete}
            ?autofocus=${this.autofocus}
            ?readonly=${this.readonly}
            ?disabled=${this.disabled}
            placeholder="${this.placeholder}"
            type=${this.type}
          />
          <slot part="end" name="end"></slot>
        </div>
        ${this.error
          ? html` <div part="error-text">${this.errorText}</div> `
          : html` <div part="help-text">${this.helpText}</div> `}
      </div>
    `;
  }
}

customElements.define("j-input", Input);

export default Input;
