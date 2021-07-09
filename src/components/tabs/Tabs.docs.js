import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Tabs",
  description: "",
  tag: "j-tabs",
  component: () => html`<j-tabs>
    <j-tab-item value="1">Tab 1</j-tab-item>
    <j-tab-item value="2">Tab 2</j-tab-item>
    <j-tab-item value="3">Tab 3</j-tab-item>
  </j-tabs>`,
};
