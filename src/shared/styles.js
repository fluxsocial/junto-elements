import { css } from "lit";

export default css`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *:before,
  :host *:after {
    box-sizing: inherit;
  }

  :host *:focus {
    outline: 0;
  }

  [hidden] {
    display: none !important;
  }
`;
