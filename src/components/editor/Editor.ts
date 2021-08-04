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
import emoji from "node-emoji";
import emojiList from "node-emoji/lib/emoji";
import { Emoji } from "./Emoji";
import "emoji-picker-element";

const styles = css`
  :host {
    width: 100%;
    --j-editor-border-color: var(--j-border-color);
  }
  :host(:focus-within) {
    --j-editor-border-color: var(--j-color-focus);
  }
  [part="base"] {
    font-size: var(--j-font-size-500);
    width: 100%;
  }
  [part="toolbar-standard"] {
    display: flex;
    gap: var(--j-space-100);
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
    margin-top: var(--j-space-200);
    padding-top: var(--j-space-300);
  }

  [part="editor-container"] {
    flex: 1;
    width: 100%;
    border: 1px solid var(--j-border-color);
    border-radius: var(--j-border-radius);
    padding: 0.5rem 1rem;
  }

  [part="editor-container"]:focus-within {
    border-color: var(--j-border-color-strong);
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
  [part="mentionSuggestions"],
  [part="emojiSuggestions"] {
    display: none;
    visibility: hidden;
  }
  [part="mentionSuggestions"][open],
  [part="emojiSuggestions"][open] {
    z-index: 100;
    display: block;
    visibility: visible;
  }

  [part="editor"] ul,
  [part="editor"] ol {
    padding-left: var(--j-space-500);
  }

  [part="editor"] a {
    color: var(--j-color-primary-500);
  }

  [part="mention"] {
    border-radius: var(--j-border-radius);
    padding: 2px var(--j-space-100);
    background: var(--j-color-primary-100);
    color: var(--j-color-primary-600);
  }
  emoji-picker {
    --background: var(--j-color-white);
    --input-font-color: var(--j-color-ui-400);
  }
`;

@customElement("j-editor")
export default class Editor extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: String })
  value = null;

  @property({ type: Boolean })
  autofocus = false;

  @property({ type: Boolean, reflect: true })
  toolbar = false;

  @property({ type: Object })
  json = { type: "doc", content: [] };

  @property({ type: Object })
  mentions = (trigger, query) => [];

  @property({ type: String })
  placeholder = null;

  @state()
  _editorInstance = null;

  @state()
  _editorChange = false;

  @state()
  _showMentionSuggestions = false;

  @state()
  _showEmojiSuggestions = false;

  @state()
  _activeIndex = 0;

  @state()
  filteredList = [];

  @state()
  filteredEmojiList = [];

  @state()
  _mentionProps = null;

  @state()
  _emojiProps = null;

  set showSuggestions(val) {
    this._showMentionSuggestions = val;

    this.dispatchEvent(
      new CustomEvent("onsuggestionlist", {
        detail: {
          showSuggestions: this._showMentionSuggestions,
        },
        bubbles: true,
      })
    );

    this.requestUpdate();
  }

  get showSuggestions() {
    return this._showMentionSuggestions;
  }

  set activeIndex(val) {
    this._activeIndex = val;
    this.requestUpdate();
  }

  get activeIndex() {
    return this._activeIndex;
  }

  get mentionSuggestions(): HTMLElement {
    return this.renderRoot.querySelector(
      "[part='mentionSuggestions']"
    ) as HTMLElement;
  }

  get emojiSuggestions(): HTMLElement {
    return this.renderRoot.querySelector(
      "[part='emojiSuggestions']"
    ) as HTMLElement;
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

  selectEmojiItem(index) {
    const item = this.filteredEmojiList[index];
    if (item) {
      this._emojiProps.command({
        id: item.id,
        label: `${item.label}`,
      });
    }
  }

  firstUpdated() {
    const formattedEmojiList = Object.entries(emojiList.emoji).map(
      ([id, label]) => ({ id, label: label as string })
    );
    const editorContainer = this.renderRoot.querySelector(
      "[part='editor-container']"
    );
    this._editorInstance = new TipTap({
      content: this.value || this.json,
      element: editorContainer,
      autofocus: this.autofocus,
      enableInputRules: false,
      extensions: [
        Document.extend({
          addKeyboardShortcuts: () => {
            return {
              Enter: () => {
                this.handleSendClick();
                // Prevents us from getting a new paragraph if user pressed Enter
                return true;
              },
            };
          },
        }),
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
            char: "@|#",
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

                  popper = createPopper(
                    virtualElement,
                    this.mentionSuggestions,
                    {
                      strategy: "fixed",
                      placement: "bottom-start",
                    }
                  );

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
                    props.event.stopPropagation();
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
        Emoji.configure({
          HTMLAttributes: {
            class: "emoji",
            part: "emoji",
          },
          suggestion: {
            char: ":",
            items: (trigger, query) => {
              this.filteredEmojiList = formattedEmojiList
                .filter((e) => e.id.includes(query))
                .slice(0, 10);

              this._showEmojiSuggestions = this.filteredEmojiList.length > 0;

              return this.filteredEmojiList;
            },
            render: () => {
              let virtualElement;
              let popper;

              return {
                onStart: (props) => {
                  this._emojiProps = props;
                  this._showEmojiSuggestions = true;

                  virtualElement = {
                    getBoundingClientRect: () =>
                      this.mentionEl.getBoundingClientRect(),
                    contextElement: this.mentionEl,
                  };

                  popper = createPopper(virtualElement, this.emojiSuggestions, {
                    strategy: "fixed",
                    placement: "bottom-start",
                  });

                  popper.update();

                  this.requestUpdate();
                },
                onUpdate: (props) => {
                  this._emojiProps = props;
                  virtualElement.getBoundingClientRect = () =>
                    this.mentionEl.getBoundingClientRect();
                  popper.update();
                  this.requestUpdate();
                },
                onKeyDown: (props) => {
                  if (props.event.code === "Enter") {
                    props.event.stopPropagation();
                    this.selectEmojiItem(this.activeIndex);
                    this._showEmojiSuggestions = true;
                    this.requestUpdate();
                    setTimeout(() => {
                      this._showEmojiSuggestions = false;
                      this.requestUpdate();
                    });
                    return true;
                  }
                  if (props.event.code === "ArrowUp") {
                    this.activeIndex =
                      (this.activeIndex + this.filteredEmojiList.length - 1) %
                      this.filteredEmojiList.length;
                    return true;
                  }
                  if (props.event.code === "ArrowDown") {
                    this.activeIndex =
                      (this.activeIndex + 1) % this.filteredEmojiList.length;
                    return true;
                  }

                  virtualElement.getBoundingClientRect = () =>
                    this.mentionEl.getBoundingClientRect();
                  popper.update();
                  this._showEmojiSuggestions = true;
                  this.requestUpdate();
                  return false;
                },
                onExit: (props) => {
                  this._showEmojiSuggestions = false;
                  this.requestUpdate();
                },
              };
            },
          },
        }),
      ],
      onUpdate: (props) => {
        this._editorChange = true;
        const anchorPosition = props.editor.state.selection;

        this.value = emoji.emojify(
          props.editor.getHTML(),
          null,
          (code, name) => {
            return `<span data-emoji class="emoji" part="emoji" data-label="${code}" data-id="${name}">${code}</span>`;
          }
        );

        const mentionRegex = new RegExp(
          `(${this.filteredList.map(
            (f) => `${f.trigger}${f.name}|`
          )})(?![^<span]*>|[^<span>]*<\/)`,
          "g"
        );

        if (this.filteredList.length > 0) {
          this.value = this.value.replace(mentionRegex, (val, args) => {
            if (val.trim().length !== 0) {
              const item = this.filteredList.find(
                (f) => `${f.trigger}${f.name}` === val
              );
              return `<span data-mention class="mention" part="mention" data-label="${item.trigger}${item.name}" data-id="${item.id}">${item.trigger}${item.name}</span>`;
            }
            return val;
          });
        }

        this.json = props.editor.getJSON() as any;

        props.editor.commands.setContent(this.value);

        props.editor.commands.setTextSelection(anchorPosition.anchor);

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

    this.renderRoot
      .querySelector("emoji-picker")
      .addEventListener("emoji-click", (event) => {
        const anchorPosition = this._editorInstance.view.state.selection;

        this._editorInstance
          .chain()
          .focus()
          .insertContentAt(
            anchorPosition,
            {
              type: "emoji",
              attrs: {
                label: event.detail.unicode,
                id: event.detail.emoji.shortcodes[0],
                trigger: ":",
              },
            },
            {
              type: "text",
              text: " ",
            }
          )
          .run();

        this.requestUpdate();
      });
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
      <j-menu part="mentionSuggestions" ?open=${this.showSuggestions} id="test">
        ${this.filteredList.map(
          (suggestion, index) =>
            html`<j-menu-item
              @click=${() => this.selectItem(index)}
              ?active=${index === this.activeIndex}
              >${suggestion.name}
            </j-menu-item>`
        )}
      </j-menu>
      <j-menu
        part="emojiSuggestions"
        ?open=${this._showEmojiSuggestions}
        id="test"
      >
        ${this.filteredEmojiList.map(
          (suggestion, index) =>
            html`<j-menu-item
              @click=${() => this.selectEmojiItem(index)}
              ?active=${index === this.activeIndex}
              >${suggestion.label}&nbsp;&nbsp;:${suggestion.id}:
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
            <j-popover placement="top-start">
              <j-button
                size="sm"
                slot="trigger"
                id="emojipopoverbtn"
                variant="subtle"
              >
                <j-icon size="sm" name="emoji-smile"></j-icon>
              </j-button>
              <div slot="content">
                <emoji-picker></emoji-picker>
              </div>
            </j-popover>
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
