import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Message item",
  description: "",
  tag: "j-message-item",
  component: () => html`<j-message-item>
    <j-avatar slot="avatar"></j-avatar>
    <j-text slot="username">Username</j-text>
    <j-text slot="message">Message</j-text>
  </j-message-item> `,
};
