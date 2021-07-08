import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Select",
  description: "",
  tag: "j-select",
  component: () => html`<j-select>
    <j-menu>
      <j-menu-item value="1">Menu item</j-menu-item>
      <j-menu-item value="2">Menu item 2</j-menu-item>
      <j-menu-item value="3">Menu item 3</j-menu-item>
    </j-menu>
  </j-select>`,
};
