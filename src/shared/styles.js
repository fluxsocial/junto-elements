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

  ::-webkit-scrollbar {
    width: var(--j-scrollbar-width, 10px);
  }

  ::-webkit-scrollbar-track {
    background-image: var(--j-scrollbar-background-image, none);
    background: var(--j-scrollbar-background, transparent);
  }

  ::-webkit-scrollbar-corner {
    background: var(--j-scrollbar-corner-background, #dfdfdf);
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: var(--j-scrollbar-thumb-box-shadow, none);
    border-radius: var(--j-scrollbar-thumb-border-radius, 300px);
    background-color: var(
      --j-scrollbar-thumb-background,
      rgba(180, 180, 180, 0.5)
    );
  }
`;
