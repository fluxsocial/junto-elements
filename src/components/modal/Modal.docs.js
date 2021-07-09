import {
  html,
  Component,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Modal",
  description: "",
  tag: "j-modal",
  component: () => {
    const [open, setOpen] = useState(false);

    return html`
      <j-button onClick=${() => setOpen(true)}>Toggle </j-button>
      <j-modal
        open=${open}
        onToggle=${(e) => setOpen(e.target.open)}
        id="modalexample"
      >
        <header slot="header">
          <j-text variant="heading">Create something</j-text>
          <j-text variant="ingress">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries.
          </j-text>
        </header>
        <div>
          <j-input
            label="Your group name"
            help-text="Here is some help text"
          ></j-input>
        </div>
        <footer slot="footer">
          <j-flex gap="400">
            <j-button onClick=${() => setOpen(false)} size="lg">
              Cancel
            </j-button>
            <j-button variant="primary" size="lg">Create</j-button>
          </j-flex>
        </footer>
      </j-modal>
    `;
  },
};
