import { html } from "htm/preact";

export default {
  name: "Tooltip",
  description: "",
  tag: "j-tooltip",
  component: ({ title = "Hello", ...props }) =>
    html`<j-tooltip ...${props} title=${title}>
      <j-button>Hover over me</j-button>
    </j-tooltip>`,
};
