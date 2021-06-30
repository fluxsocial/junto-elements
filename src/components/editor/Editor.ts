import { html, css, LitElement } from "lit";
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

  @property({ type: Object })
  mentions = (trigger, query) => []

  @property({type: Object})
  mentionRender = () => {
    return {
      onStart: () => {},
      onUpdate: () => {},
      onKeyDown: () => true,
      onExit: () => {}
    }
  }

  @property({ type: String })
  placeholder = "";

  @state()
  _editorInstance = null;

  @state()
  _editorChange = false;

  firstUpdated() {
    const editorContainer = this.renderRoot.querySelector(
      "[part='editor-container']"
    );
    this._editorInstance = new TipTap({
      content: this.value || this.json,
      element: editorContainer,
      autofocus: this.autofocus,
      extensions: [
        StarterKit,
        CodeBlock,
        Placeholder.configure({ placeholder: this.placeholder }),
        Mention.configure({
          HTMLAttributes: {
            class: "mention"
          },
          suggestion: {
            items: this.mentions,
            render: this.mentionRender,
          }
        })
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
      <div part="editor-container"></div>
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
