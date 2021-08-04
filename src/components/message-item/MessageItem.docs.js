import { html } from "htm/preact";

export default {
  name: "Message item",
  description: "",
  tag: "j-message-item",
  component: (props) => html`<j-message-item ...${props}>
    <j-avatar slot="avatar"></j-avatar>
    <j-text slot="username">Username</j-text>
    <j-text slot="message">Message</j-text>
  </j-message-item> `,
};
