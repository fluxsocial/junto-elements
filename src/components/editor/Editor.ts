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
    padding: var(--j-space-500);
  }

  [part="editor-wrapper"] {
    display: flex;
    align-items: center;
    gap: var(--j-space-300);
  }

  :host([toolbar]) [part="editor-wrapper"] {
    flex-direction: column;
    gap: 0;
  }

  :host([toolbar]) [part="toolbar"] {
    flex: 1;
    width: 100%;
    border-top: 1px solid var(--j-border-color);
    margin-top: var(--j-space-200);
    padding-top: var(--j-space-300);
  }

  [part="editor-container"] {
    flex: 1;
    width: 100%;
    border: 1px solid var(--j-border-color);
    border-radius: 5px;
    padding: 0.5rem 1rem;
  }

  [part="toolbar"] {
    align-self: flex-end;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--j-space-300);
  }

  [part="toolbar"] j-button[active]::part(base) {
    color: var(--j-color-primary-500);
  }

  [part="editor"] {
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

  @property({ type: Boolean, reflect: true })
  toolbar = false;

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

    if (changedProperties.has("toolbar")) {
      this.dispatchEvent(new CustomEvent("toolbartoggle", { bubbles: true }));
    }

    this._editorChange = false;
    return true;
  }

  _toggleBold() {
    this._editorInstance.chain().toggleBold().focus().run();
  }

  toggleToolbar() {
    this.toolbar = !this.toolbar;
  }

  handleSendClick() {
    this.dispatchEvent(new CustomEvent("send", { bubbles: true }));
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
      <div part="editor-wrapper">
        <div id="container" part="editor-container"></div>
        <div part="toolbar">
          ${this.toolbar
            ? html`<div part="toolbar-extended">
                ${this._editorInstance
                  ? html`<j-button
                        variant="subtle"
                        size="sm"
                        ?active=${this._editorInstance.isActive("bold")}
                        @click=${() =>
                          this._editorInstance
                            .chain()
                            .toggleBold()
                            .focus()
                            .run()}
                      >
                        <j-icon size="sm" name="type-bold"></j-icon>
                      </j-button>
                      <j-button
                        variant="subtle"
                        size="sm"
                        ?active=${this._editorInstance.isActive("italic")}
                        @click=${() =>
                          this._editorInstance
                            .chain()
                            .toggleItalic()
                            .focus()
                            .run()}
                      >
                        <j-icon size="sm" name="type-italic"></j-icon>
                      </j-button>
                      <j-button
                        variant="subtle"
                        size="sm"
                        ?active=${this._editorInstance.isActive("strike")}
                        @click=${() =>
                          this._editorInstance
                            .chain()
                            .toggleStrike()
                            .focus()
                            .run()}
                      >
                        <j-icon size="sm" name="type-strikethrough"></j-icon>
                      </j-button>
                      <j-button
                        variant="subtle"
                        size="sm"
                        ?active=${this._editorInstance.isActive("bulletList")}
                        @click=${() =>
                          this._editorInstance
                            .chain()
                            .focus()
                            .toggleBulletList()
                            .run()}
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
              </div>`
            : null}
          <div part="toolbar-standard">
            <j-button
              ?active=${this.toolbar}
              variant="subtle"
              size="sm"
              @click=${() => this.toggleToolbar()}
            >
              <j-icon size="sm" name="type"></j-icon>
            </j-button>
            <j-button
              variant="primary"
              size="sm"
              @click=${() => this.handleSendClick()}
            >
              <j-icon size="sm" name="arrow-right-short"></j-icon>
            </j-button>
          </div>
        </div>
      </div>
    </div>`;
  }
}
