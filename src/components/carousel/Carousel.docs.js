import {
  html,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default {
  name: "Carousel",
  description: "Carousel",
  tag: "j-carousel",
  component: () => {
    const [value, setValue] = useState(0);

    function handleChange(e) {
      setValue(e.target.value);
    }

    return html`
      <j-carousel value=${value} onChange=${handleChange}>
        <j-box p="900" bg="ui-200">Slide 1</j-box>
        <j-box p="900" bg="ui-200">Slide 2</j-box>
        <j-box p="900" bg="ui-200">Slide 3</j-box>
      </j-carousel>
    `;
  },
};
