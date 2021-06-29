import { html, css, LitElement } from "lit";
import { createPopper } from "@popperjs/core";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

import { Editor as TipTap } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import { Mention } from "./Mention";

const styles = css`
  :host {
    width: 100%;
    --j-editor-border-color: var(--j-border-color);
  }
  :host(:focus-within) {
    --j-editor-border-color: var(--j-focus-color);
  }
  [part="base"] {
    font-size: var(--j-font-size-500);
    width: 100%;
    border: 1px solid var(--j-editor-border-color);
    border-radius: var(--j-border-radius);
  }
  [part="toolbar"] {
    border-top: 1px solid var(--j-border-color);
    padding: var(--j-space-200);
  }
  [part="editor"] {
    padding: var(--j-space-500);
    width: 100%;
  }
  [part="editor"]:focus-within {
    outline: 0;
  }
  [part="editor"] *:first-of-type {
    margin-top: 0;
  }
  [part="editor"] *:last-of-type {
    margin-bottom: 0;
  }
  [part="suggestions"] {
    display: none;
    visibility: hidden;
  }
  [part="suggestions"][open] {
    z-index: 100;
    display: block;
    visibility: visible;
  }
  [part="editor"] pre {
    background: #0d0d0d;
    color: #fff;
    font-family: JetBrainsMono, monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
  }
  /* Placeholder (at the top) */
  [part="editor"] p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: var(--j-color-ui-400);
    pointer-events: none;
    height: 0;
  }
  .mention {
    padding: var(--j-badge-padding);
    background: var(--j-badge-bg);
    color: var(--j-badge-color);
  }
`;

@customElement("j-editor")
export default class Editor extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: String })
  value = "";

  @property({ type: Boolean })
  autofocus = false;

  @property({ type: Object })
  json = { type: "doc", content: [] };

  @property({
    type: Array,
    reflect: false,
    converter: {
      fromAttribute: (val, type) => {
        return val.startsWith("[") ? JSON.parse(val) : val.split(",");
      },
    },
  })
  suggestions = [];

  @property({ type: String })
  placeholder = "";

  @state()
  _editorInstance = null;

  @state()
  _editorChange = false;

  @state()
  _showSugggestions = false;

  @state()
  _activeIndex = 0;

  @state()
  _query = "";

  @state()
  _mentionProps = null;

  set activeIndex(val) {
    this.requestUpdate();
    this._activeIndex = val;
  }

  get activeIndex() {
    return this._activeIndex;
  }

  set query(val) {
    this.requestUpdate();
    this._query = val;
  }

  get query() {
    return this._query;
  }

  get suggestionItems(): any {
    return [...this.suggestionsEl.children];
  }

  get suggestionsEl(): HTMLElement {
    return this.renderRoot.querySelector("[part='suggestions']") as HTMLElement;
  }

  get mentionEl(): HTMLElement {
    return this.renderRoot.querySelector(".suggestion") as HTMLElement;
  }

  get filteredOptions() {
    return this.suggestions
      .filter((item) => item.toLowerCase().startsWith(this.query.toLowerCase()))
      .slice(0, 5);
  }

  firstUpdated() {
    const editorContainer = this.renderRoot.querySelector(
      "[part='editor-container']"
    );
    this._editorInstance = new TipTap({
      content: this.value || this.json,
      element: editorContainer,
      autofocus: this.autofocus,
      enableInputRules: false,
      enablePasteRules: false,
      extensions: [
        StarterKit,
        CodeBlock,
        Placeholder.configure({ placeholder: this.placeholder }),
        Mention.configure({
          HTMLAttributes: {
            class: "mention",
          },
          suggestion: {
            render: () => {
              let virtualElement;
              let popper;
              let startProps;

              return {
                onStart: (props) => {
                  this.query = "";
                  this.activeIndex = 0;
                  this._mentionProps = props;
                  virtualElement = {
                    getBoundingClientRect: () =>
                      this.mentionEl.getBoundingClientRect(),
                  };

                  popper = createPopper(virtualElement, this.suggestionsEl, {
                    strategy: "fixed",
                    placement: "bottom-start",
                  });

                  popper.update();
                  this._showSugggestions = true;
                  this.requestUpdate();
                },
                onUpdate: (props) => {
                  console.log("update", props);
                  this.query = props.query;
                  this._mentionProps = props;
                  virtualElement.getBoundingClientRect = () =>
                    this.mentionEl.getBoundingClientRect();
                  popper.update();
                  this.requestUpdate();
                },
                onKeyDown: (props) => {
                  console.log("keydown", props);
                  if (props.event.code === "Enter") {
                    this.selectItem(this.activeIndex);
                    return true;
                  }
                  if (props.event.code === "ArrowUp") {
                    this.activeIndex =
                      (this.activeIndex + this.suggestionItems.length - 1) %
                      this.suggestionItems.length;
                    return true;
                  }
                  if (props.event.code === "ArrowDown") {
                    this.activeIndex =
                      (this.activeIndex + 1) % this.suggestionItems.length;
                    return true;
                  }

                  virtualElement.getBoundingClientRect = () =>
                    this.mentionEl.getBoundingClientRect();
                  popper.update();
                  this._showSugggestions = true;
                  this.requestUpdate();
                  return false;
                },
                onExit: () => {
                  console.log("exit");
                  this._showSugggestions = false;
                  this.requestUpdate();
                },
              };
            },
          },
        }),
      ],
      onUpdate: ({ editor }) => {
        this._editorChange = true;
        this.value = editor.getHTML();
        this.json = editor.getJSON() as any;
        this.dispatchEvent(
          new CustomEvent("change", {
            bubbles: true,
          })
        );
      },
    });
    const editorEl = this.renderRoot.querySelector(".ProseMirror");
    editorEl.setAttribute("part", "editor");
  }

  selectItem(index) {
    const item = this.suggestionItems[index];
    if (item) {
      this._mentionProps.command({ id: item.value });
    }
  }

  shouldUpdate(changedProperties) {
    if (
      changedProperties.has("value") &&
      this._editorInstance &&
      !this._editorChange
    ) {
      // TODO: Bug when this gets set and marker is put on bottom of input field
      this._editorInstance.commands.setContent(this.value);
    }
    this._editorChange = false;
    return true;
  }

  _toggleBold() {
    this._editorInstance.chain().toggleBold().focus().run();
  }

  render() {
    return html` <div part="base">
      <div id="container" part="editor-container"></div>
      <j-menu part="suggestions" ?open=${this._showSugggestions} id="test">
        ${this.filteredOptions.map(
          (suggestion, index) =>
            html`<j-menu-item
              @click=${() => this.selectItem(index)}
              ?active=${index === this.activeIndex}
              >${suggestion}
            </j-menu-item>`
        )}
      </j-menu>
      <div part="toolbar">
        <j-button
          size="sm"
          @click=${() =>
            this._editorInstance.chain().toggleBold().focus().run()}
        >
          <j-icon size="sm" name="type-bold"></j-icon>
        </j-button>
        <j-button
          size="sm"
          @click=${() =>
            this._editorInstance.chain().toggleItalic().focus().run()}
        >
          <j-icon size="sm" name="type-italic"></j-icon>
        </j-button>
        <j-button
          size="sm"
          @click=${() =>
            this._editorInstance.chain().toggleStrike().focus().run()}
        >
          <j-icon size="sm" name="type-strikethrough"></j-icon>
        </j-button>
        <j-button
          size="sm"
          @click=${() =>
            this._editorInstance.chain().toggleCodeBlock().focus().run()}
        >
          <j-icon size="sm" name="code"></j-icon>
        </j-button>
      </div>
    </div>`;
  }
}
