import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Popover",
  description: "",
  tag: "j-popover",
  component: () => html`<j-popover>
    <j-button slot="trigger">Trigger</j-button>
    <j-menu slot="content">
      <j-menu-item>Menu item</j-menu-item>
      <j-menu-item>Menu item</j-menu-item>
    </j-menu>
  </j-popover>`,
};
