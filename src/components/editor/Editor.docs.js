import { html } from "htm/preact";

export default {
  name: "Editor",
  description: "Editor",
  tag: "j-editor",
  component: ({ changeProp, ...props }) =>
    html`<j-editor
      onChange=${(e) => changeProp("value", e.target.value)}
      ...${props}
    >
      Editor
    </j-editor>`,
};
