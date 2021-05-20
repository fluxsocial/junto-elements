import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

const styles = css`
  :host {
    --j-modal-backdrop-bg-color: rgba(0, 0, 0, 0.1);
    --j-modal-backdrop-transition: all 0.2s
      cubic-bezier(0.785, 0.135, 0.15, 0.86);
    --j-modal-transition: all 0.4s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    --j-modal-box-shadow: none;
    --j-modal-width: 100%;
    --j-modal-max-height: 90%;
    --j-modal-min-height: 300px;
    --j-modal-max-width: 600px;
    --j-modal-min-width: 200px;
    --j-modal-padding: var(--j-space-400);
    --j-modal-border: 1px solid transparent;
    --j-modal-translateY: 100%;
    --j-modal-translateX: 0px;
    --j-modal-justify: center;
    --j-modal-align: center;
  }

  :host {
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: var(--j-modal-align);
    justify-content: var(--j-modal-justify);
    visibility: hidden;
  }

  :host([open]) {
    visibility: visible;
  }

  [part="base"] {
    border-radius: var(--j-border-radius);
    padding: var(--j-space-300);
    min-width: 200px;
    background: var(--j-color-white);
    border: 1px solid var(--j-color-ui-200);
  }
`;

@customElement("j-modal")
export default class Menu extends LitElement {
  static styles = [sharedStyles, styles];

  /**
   * Date
   * @type {Boolean}
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  render() {
    return html` <div part="base">
      <slot></slot>
    </div>`;
  }
}
