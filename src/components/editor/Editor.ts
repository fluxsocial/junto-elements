import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

import { Editor as TipTap } from "@tiptap/core";
import LineBreak from "./LineBreak";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import CodeBlock from "@tiptap/extension-code-block";
import History from "@tiptap/extension-history";
import Link from "@tiptap/extension-link";
import OrderedList from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import { Mention } from "./Mention";
import { createPopper } from "@popperjs/core/lib/createPopper";

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

  [part="toolbar"] j-button::part(base) {
    color: var(--j-color-ui-400);
  }

  [part="toolbar"] j-button[active]::part(base) {
    color: var(--j-color-primary-500);
  }

  [part="editor"] ul,
  [part="editor"] ol {
    padding-left: var(--j-space-500);
  }

  [part="mention"] {
    border-radius: var(--j-border-radius);
    padding: 2px var(--j-space-100);
    background: var(--j-color-primary-100);
    color: var(--j-color-primary-600);
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

  @property({ type: Object })
  mentions = (trigger, query) => [];

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
          showSuggestions: this._showSuggestions,
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
      this._mentionProps.command({
        id: item.id,
        label: `${item.trigger}${item.name}`,
      });
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
      extensions: [
        Document,
        Text,
        Paragraph,

        Link,
        Bold,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        History,
        CodeBlock,
        LineBreak,
        Placeholder.configure({ placeholder: this.placeholder }),
        Mention.configure({
          HTMLAttributes: {
            class: "mention",
            part: "mention",
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

              return {
                onStart: (props) => {
                  this.activeIndex = 0;
                  this._mentionProps = props;

                  virtualElement = {
                    getBoundingClientRect: () =>
                      this.mentionEl.getBoundingClientRect(),
                    contextElement: this.mentionEl,
                  };

                  popper = createPopper(virtualElement, this.suggestionsEl, {
                    strategy: "fixed",
                    placement: "bottom-start",
                  });

                  popper.update();

                  this.showSuggestions = true;

                  this.requestUpdate();
                },
                onUpdate: (props) => {
                  this._mentionProps = props;
                  virtualElement.getBoundingClientRect = () =>
                    this.mentionEl.getBoundingClientRect();
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
                    });
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
              };
            },
          },
        }),
      ],
      onUpdate: (props) => {
        this._editorChange = true;
        this.value = props.editor.getHTML();
        this.json = props.editor.getJSON() as any;
        this.dispatchEvent(
          new CustomEvent("change", {
            bubbles: true,
            detail: {
              value: this.value,
            },
          })
        );
      },
    });
    const editorEl = this.renderRoot.querySelector(".ProseMirror");
    editorEl.setAttribute("part", "editor");

    this.dispatchEvent(
      new CustomEvent("editorinit", {
        detail: {
          editorInstance: this._editorInstance,
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
        ${this._editorInstance
          ? html`<j-button
                variant="subtle"
                size="sm"
                ?active=${this._editorInstance.isActive("bold")}
                @click=${() =>
                  this._editorInstance.chain().toggleBold().focus().run()}
              >
                <j-icon size="sm" name="type-bold"></j-icon>
              </j-button>
              <j-button
                variant="subtle"
                size="sm"
                ?active=${this._editorInstance.isActive("italic")}
                @click=${() =>
                  this._editorInstance.chain().toggleItalic().focus().run()}
              >
                <j-icon size="sm" name="type-italic"></j-icon>
              </j-button>
              <j-button
                variant="subtle"
                size="sm"
                ?active=${this._editorInstance.isActive("strike")}
                @click=${() =>
                  this._editorInstance.chain().toggleStrike().focus().run()}
              >
                <j-icon size="sm" name="type-strikethrough"></j-icon>
              </j-button>
              <j-button
                variant="subtle"
                size="sm"
                ?active=${this._editorInstance.isActive("bulletList")}
                @click=${() =>
                  this._editorInstance.chain().focus().toggleBulletList().run()}
              >
                <j-icon size="sm" name="list-ul"></j-icon>
              </j-button>
              <j-button
                variant="subtle"
                size="sm"
                ?active=${this._editorInstance.isActive("orderedList")}
                @click=${() =>
                  this._editorInstance
                    .chain()
                    .focus()
                    .toggleOrderedList()
                    .run()}
              >
                <j-icon size="sm" name="list-ol"></j-icon>
              </j-button>`
          : null}
      </div>
    </div>`;
  }
}
