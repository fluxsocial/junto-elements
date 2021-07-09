import {
  html,
  useEffect,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

function getPropValue(name) {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name);
}

function setProp(name, value) {
  document.documentElement.style.setProperty(name, value);
}

export default function ThemeEditor() {
  const hueName = "--j-color-primary-hue";
  const saturationName = "--j-color-saturation";
  const radiusName = "--j-border-radius";
  const fontSizeName = "--j-font-base-size";

  const [hue, setHue] = useState(getPropValue(hueName));
  const [saturation, setSaturation] = useState(
    getPropValue(saturationName).replace("%", "")
  );
  const [radius, setRadius] = useState(
    getPropValue(radiusName).replace("px", "")
  );
  const [baseSize, setBaseSize] = useState(
    getPropValue(fontSizeName).replace("px", "")
  );

  useEffect(() => {
    setProp(hueName, hue);
    setProp(saturationName, saturation + "%");
    setProp(radiusName, radius + "px");
    setProp(fontSizeName, baseSize + "px");
  }, [hue, saturation, radius, baseSize]);

  console.log(saturation);

  return html`<div>
    <j-flex direction="column" gap="300">
      <j-text variant="label">Base font size: ${baseSize}px</j-text>
      <input
        onInput=${(e) => setBaseSize(e.target.value)}
        min="14"
        step="0.5"
        max="20"
        type="range"
      />
    </j-flex>
    <j-flex direction="column" gap="300">
      <j-text variant="label">Hue: ${hue}</j-text>
      <input
        onInput=${(e) => setHue(e.target.value)}
        min="0"
        max="360"
        type="range"
      />
    </j-flex>
    <j-flex direction="column" gap="300">
      <j-text variant="label">Saturation: ${saturation}%</j-text>
      <input
        onInput=${(e) => setSaturation(e.target.value)}
        min="0"
        max="360"
        type="range"
      />
    </j-flex>
    <j-flex direction="column" gap="300">
      <j-text variant="label">Border radius: ${radius}px</j-text>
      <input
        onInput=${(e) => setRadius(e.target.value)}
        min="0"
        max="50"
        type="range"
      />
    </j-flex>
  </div>`;
}
