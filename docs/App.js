import { html } from "https://unpkg.com/htm/preact/standalone.module.js";
import els from "./elements.js";
import variables from "./variables.js";
import ThemeEditor from "./ThemeEditor.js";

const elements = Object.values(els);

export default function App() {
  return html`<div id="app">
    <main class="layout">
      <aside class="sidebar">
        <div class="logo">
          <div>
            <img
              class="logo__img"
              width="25"
              src="https://junto.foundation/dist/junto-home-2.0__logo--rainbow.png?d9ff94e4e39bfd0536e60f760a9e6bd7"
            />
          </div>
          <j-text nomargin class="logo_text" size="600">Junto Elements</j-text>
        </div>

        <nav id="navtarget" class="nav">
          <j-menu-group-item title="Getting started">
            <a class="sidebar-link" href="#installation">
              <j-menu-item>Installation</j-menu-item>
            </a>
            <a class="sidebar-link" href="#theming">
              <j-menu-item>Theming</j-menu-item>
            </a>
          </j-menu-group-item>
          <j-menu-group-item title="Variables">
            ${Object.keys(variables).map((name) => {
              return html`<a class="sidebar-link" href=${`#${name}`}>
                <j-menu-item>${name}</j-menu-item>
              </a>`;
            })}
          </j-menu-group-item>
          <j-menu-group-item title="Elements">
            ${elements.map((el) => {
              return html`
                <a class="sidebar-link" href=${"#" + el.tag}>
                  <j-menu-item>${el.name}</j-menu-item>
                </a>
              `;
            })}
          </j-menu-group-item>
        </nav>
      </aside>
      <div class="main-content">
        <section class="section" id="gettingstarted">
          <section class="section" id="installation">
            <j-text variant="heading-lg">Installation</j-text>
            <j-text variant="heading">NPM</j-text>
            <j-text>npm install --save @junto-foundation/junto-elements</j-text>
            <j-text>import "@junto-foundation/junto-elements"</j-text>
            <j-text>
              import "@junto-foundation/junto-elements/dist/main.css"
            </j-text>
          </section>
          <section class="section" id="theming">
            <j-text variant="heading-lg">Theming</j-text>
            <${ThemeEditor} />
          </section>
        </section>

        <section id="variables">
          <j-text variant="heading-lg">Elements</j-text>
          ${Object.keys(variables).map((name) => {
            const vars = variables[name];

            return html`<section class="section" id=${name}>
              <j-text variant="heading">${name}</j-text>
              ${vars.map((variable) => {
                return html`<j-text variant="heading-sm"
                    >${variable.name}</j-text
                  >
                  ${variable.render(variable)}`;
              })}
            </section>`;
          })}
        </section>

        <section id="elements">
          <j-text variant="heading-lg">Elements</j-text>
          ${elements.map((el) => {
            return html`<section class="section" id=${el.tag}>
              <j-text variant="heading">${el.name}</j-text>
              <j-knobs element=${el.tag}><${el.component} /></j-text>
            </section>`;
          })}
        </section>
      </div>
    </main>
  </div>`;
}
