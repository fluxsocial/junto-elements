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

  :host([open]) [part="modal"] {
    opacity: 1;
    transform: scale(1);
  }

  [part="modal"] {
    transition: all 0.2s ease;
    opacity: 0;
    transform: scale(0.95);
    padding: var(--j-space-800);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 999;
    border-radius: var(--j-border-radius);
    min-width: 80vw;
    min-height: 50vh;
    background: var(--j-color-white);
    border: 1px solid var(--j-color-ui-200);
  }

  [part="content"] {
    flex: 1;
  }

  @media (min-width: 800px) {
    [part="modal"] {
      min-width: 600px;
      min-height: 400px;
    }
  }

  [part="close-button"] {
    cursor: pointer;
    padding: 0;
    background: none;
    border: 0;
    width: 15px;
    height: 15px;
    position: absolute;
    right: var(--j-space-600);
    top: var(--j-space-600);
  }

  [part="close-icon"] {
    width: 15px;
    height: 15px;
  }

  [part="backdrop"] {
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    overflow: visible;
    z-index: 400;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
  }

  :host([open]) [part="backdrop"] {
    opacity: 1;
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
  @property({
    type: Boolean,
    reflect: true,
    hasChanged(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "visible";
      }
      return true;
    },
  })
  open = false;

  render() {
    return html` <div part="base">
      <div part="backdrop" @click=${() => (this.open = false)}></div>
      <div part="modal">
        <button @click=${() => (this.open = false)} part="close-button">
          <svg
            part="close-icon"
            viewBox="0 0 329.26933 329"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
            />
          </svg>
        </button>
        <slot name="header" part="header"></slot>
        <div part="content"><slot></slot></div>
        <slot name="footer" part="footer"></slot>
      </div>
    </div>`;
  }
}
