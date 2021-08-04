import { html } from "htm/preact";

export default {
  name: "Icon",
  description: "Icon",
  tag: "j-icon",
  component: (props) => html`<j-icon ...${props} name="sun"></j-icon>`,
};
