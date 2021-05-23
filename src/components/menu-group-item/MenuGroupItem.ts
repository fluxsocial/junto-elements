import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
  }
  [part="summary"] {
    position: relative;
    cursor: pointer;
    list-style: none;
    text-transform: uppercase;
    font-size: var(--j-font-size-400);
    color: var(--j-color-ui-400);
    font-weight: 500;
    padding-left: var(--j-space-800);
    -webkit-appearance: none;
  }
  [part="summary"]::marker {
    display: none;
  }
  [part="summary"]:hover {
    color: var(--j-color-ui-700);
  }
  [part="summary"]:after {
    top: 6px;
    left: var(--j-space-500);
    position: absolute;
    display: block;
    content: "";
    border-right: 1px solid var(--j-color-ui-500);
    border-bottom: 1px solid var(--j-color-ui-500);
    width: 4px;
    height: 4px;
    transition: all 0.2s ease;
    transform: rotate(-45deg);
    transform-origin: center;
  }
  :host([open]) [part="summary"]:after {
    transform: rotate(45deg);
  }
  [part="content"] {
    margin-top: var(--j-space-300);
    margin-bottom: var(--j-space-300);
  }
`;

@customElement("j-menu-group-item")
export default class MenuItem extends LitElement {
  static styles = [styles, sharedStyles];

  /**
   * Open
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  open = "";

  /**
   * Title
   * @type {String}
   * @attr
   */
  @property({ type: String, reflect: true })
  title = "";

  render() {
    return html`<details
      .open=${this.open}
      @toggle=${(e) => (this.open = e.target.open)}
      part="base"
      role="menuitem"
    >
      <summary part="summary">${this.title}</summary>
      <div part="content">
        <slot></slot>
      </div>
    </details>`;
  }
}
