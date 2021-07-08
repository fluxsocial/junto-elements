import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Menu Group",
  description: "Menu group",
  tag: "j-menu-group-item",
  component: () => html`<j-menu-group-item title="Hello">
    <j-menu-item>Menu item</j-menu-item>
    <j-menu-item>Menu item</j-menu-item>
    <j-menu-item>Menu item</j-menu-item>
  </j-menu-group-item>`,
};
