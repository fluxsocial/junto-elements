import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Menu",
  description: "Menu",
  tag: "j-menu",
  component: () => html`<j-menu>
    <j-menu-item>Menu item</j-menu-item>
    <j-menu-item>Menu item</j-menu-item>
  </j-menu>`,
};
