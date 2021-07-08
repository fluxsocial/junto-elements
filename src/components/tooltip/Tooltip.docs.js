import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Tooltip",
  description: "",
  tag: "j-tooltip",
  component: () => html`<j-tooltip title="Hello">
    <j-button>Hover over me</j-button>
  </j-tooltip>`,
};
