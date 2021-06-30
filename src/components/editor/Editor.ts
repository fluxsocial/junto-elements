import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

import { Editor as TipTap, Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";
import { Mention } from "./Mention";
import { createPopper } from "@popperjs/core/lib/createPopper";
import { Plugin } from "prosemirror-state";
 
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
  [part="suggestions"] {
    display: none;
    visibility: hidden;
  }
  [part="suggestions"][open] {
    z-index: 100;
    display: block;
    visibility: visible;
  }
`;

@customElement("j-editor")
export default class Editor extends LitElement {
  static styles = [sharedStyles, styles];

  _value = "";

  // Needed this to force update
  @property({ type: String })
  set value(val) {
    let oldVal = this._value;
    this._value = val;
    this.requestUpdate('value', oldVal)
  }

  get value() { return this._value }

  @property({ type: Boolean })
  autofocus = false;

  @property({ type: Object })
  json = { type: "doc", content: [] };

  @property({ type: Object })
  mentions = (trigger, query) => []

  @property({ type: String })
  placeholder = "";

  @state()
  _editorInstance = null;

  @state()
  _editorChange = false;

  @state()
  _showSuggestions = false;

  @state()
  _activeIndex = 0;

  @state()
  filteredList = [];

  @state()
  _mentionProps = null;

  set showSuggestions(val) {
    this._showSuggestions = val;

    this.dispatchEvent(
      new CustomEvent("onsuggestionlist", {
        detail: {
          showSuggestions: this._showSuggestions
        },
        bubbles: true,
      })
    );

    this.requestUpdate();
  }

  get showSuggestions() {
    return this._showSuggestions;
  }

  set activeIndex(val) {
    this._activeIndex = val;
    this.requestUpdate();
  }

  get activeIndex() {
    return this._activeIndex;
  }

  get suggestionsEl(): HTMLElement {
    return this.renderRoot.querySelector("[part='suggestions']") as HTMLElement;
  }

  get mentionEl(): HTMLElement {
    return this.renderRoot.querySelector(".suggestion") as HTMLElement;
  }

  selectItem(index) {
    const item = this.filteredList[index];
    if (item) {
      this._mentionProps.command({ id: item.id, label: `${item.trigger}${item.name}` });
    }
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
            class: "mention"
          },
          suggestion: {
            items: (trigger, query) => {
              this.filteredList = this.mentions(trigger, query);

              this.showSuggestions = this.filteredList.length !== 0;

              return this.filteredList;
            },
            render: () => {
              let virtualElement;
              let popper;
              let startProps;

              return {
                onStart: (props) => {
                  this.activeIndex = 0;
                  this._mentionProps = props;

                  virtualElement = {
                    getBoundingClientRect: () => this.mentionEl.getBoundingClientRect(),
                    contextElement: this.mentionEl
                  };
                  
                  popper = createPopper(virtualElement, this.suggestionsEl, {
                    strategy: 'fixed',
                    placement: 'bottom-start'
                  });

                  popper.update();

                  this.showSuggestions = true;

                  this.requestUpdate();
                },
                onUpdate: (props) => {                                                    
                  virtualElement.getBoundingClientRect = () => this.mentionEl.getBoundingClientRect();
                  popper.update();
                  this.requestUpdate();
                },
                onKeyDown: (props) => {
                  if (props.event.code === "Enter") {
                    this.selectItem(this.activeIndex);
                    this.showSuggestions = true;
                    this.requestUpdate();
                    setTimeout(() => {
                      this.showSuggestions = false;
                      this.requestUpdate();
                    })
                    return true;
                  }
                  if (props.event.code === "ArrowUp") {
                    this.activeIndex =
                      (this.activeIndex + this.filteredList.length - 1) %
                      this.filteredList.length;
                    return true;
                  }
                  if (props.event.code === "ArrowDown") {
                    this.activeIndex =
                      (this.activeIndex + 1) % this.filteredList.length;
                    return true;
                  }

                  virtualElement.getBoundingClientRect = () =>
                    this.mentionEl.getBoundingClientRect();
                  popper.update();
                  this.showSuggestions = true;
                  this.requestUpdate();
                  return false;
                },
                onExit: () => {
                  this.showSuggestions = false;
                  this.requestUpdate();
                },
              }
            },
          }
        }),
        Extension.create({
          addProseMirrorPlugins: () => {
            return [new Plugin({
              props: {
                handleKeyDown: (_, event) => {
                  if (event.key === 'Enter' && !event.shiftKey && !this.showSuggestions) {
                    this._editorInstance.commands.clearContent();
                    return true;
                  }
      
                  return false;
                },
              }
            })];
          }
        })
      ],
      onUpdate: (props) => {
        this._editorChange = true;
        this.value = props.editor.getHTML();
        this.json = props.editor.getJSON() as any;
        this.dispatchEvent(
          new CustomEvent("change", {
            bubbles: true,
            detail: {
              value: this.value
            }
          })
        );
      },
    });
    const editorEl = this.renderRoot.querySelector(".ProseMirror");
    editorEl.setAttribute("part", "editor");

    this.dispatchEvent(
      new CustomEvent("editorinit", {
        detail: {
          editorInstance: this._editorInstance
        },
        bubbles: true,
      })
    );
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
      <j-menu part="suggestions" ?open=${this.showSuggestions} id="test">
        ${this.filteredList.map(
          (suggestion, index) =>
            html`<j-menu-item
              @click=${() => this.selectItem(index)}
              ?active=${index === this.activeIndex}
              >${suggestion.name}
            </j-menu-item>`
        )}
      </j-menu>
      <div id="container" part="editor-container"></div>
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
