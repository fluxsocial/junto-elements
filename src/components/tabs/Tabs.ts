import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-tabs-padding: 4px;
    --j-tabs-height: var(--j-size-md);
    --j-tabs-indicator-bg: var(--j-color-primary-50);
    --j-tabs-indicator-width: 0px;
    --j-tabs-indicator-left: 0px;
  }
  :host {
    position: relative;
  }
  [part="base"] {
    height: var(--j-tabs-height);
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    gap: var(--j-space-200);
    background: var(--j-color-white);
    border-radius: var(--j-border-radius);
    border: 1px solid var(--j-border-color);
    padding: 0 var(--j-tabs-padding);
    position: relative;
  }
  [part="base"]:before {
    display: block;
    content: "";
    z-index: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: var(--j-tabs-indicator-left);
    width: var(--j-tabs-indicator-width);
    height: calc(100% - calc(var(--j-tabs-padding) * 2));
    background: var(--j-tabs-indicator-bg);
    border-radius: var(--j-border-radius);
    transition: all 0.2s ease;
  }
  :host([size="sm"]) {
    --j-tabs-height: var(--j-size-sm);
  }
  :host([size="lg"]) {
    --j-tabs-height: var(--j-size-lg);
  }
`;

@customElement("j-tabs")
export default class Menu extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Value
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  value = "";

  /**
   * Size
   * @type {""|"sm"|"lg"}
   * @attr
   */
  @property({ type: String, reflect: true })
  size = "";

  get optionElements() {
    return [...this.children];
  }

  get selectedElement() {
    return this.optionElements.find(
      (opt: any) => opt.value === this.value
    ) as any;
  }

  firstUpdated() {}

  shouldUpdate(changedProperties) {
    if (changedProperties.has("value")) {
      this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
    }
    return true;
  }

  selectTab(value) {
    this.optionElements.forEach((el: any) => {
      const isChecked = el.value === value;
      el.checked = isChecked;
      this.value = value;
      if (isChecked) {
        this.style.setProperty(
          "--j-tabs-indicator-width",
          el.offsetWidth + "px"
        );
        this.style.setProperty("--j-tabs-indicator-left", el.offsetLeft + "px");
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.value) {
      setTimeout(() => {
        this.selectTab(this.value);
      }, 100);
    }

    this.addEventListener("tab-selected", (e: any) => {
      e.stopPropagation();
      this.selectTab(e.target.value);
    });
  }

  render() {
    return html` <div part="base" role="tablist"><slot></slot></div>`;
  }
}
