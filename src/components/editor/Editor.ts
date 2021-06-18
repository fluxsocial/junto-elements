import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

import { Editor as TipTap, generateHTML, generateJSON } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Placeholder from "@tiptap/extension-placeholder";

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
    padding: var(--j-space-200);
  }
  .ProseMirror {
    padding: var(--j-space-500);
    border-bottom: 1px solid var(--j-border-color);
    width: 100%;
  }
  .ProseMirror:focus {
    outline: 0;
  }
  .ProseMirror *:first-of-type {
    margin-top: 0;
  }
  .ProseMirror *:last-of-type {
    margin-bottom: 0;
  }
  .ProseMirror pre {
    background: #0d0d0d;
    color: #fff;
    font-family: JetBrainsMono, monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
  }
  /* Placeholder (at the top) */
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #ced4da;
    pointer-events: none;
    height: 0;
  }
`;

@customElement("j-editor")
export default class Editor extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: String })
  value = "";

  @property({ type: Object })
  json = { type: "doc", content: [] };

  @property({ type: String })
  placeholder = "";

  @state()
  _editorInstance = null;

  @state()
  _editorChange = false;

  firstUpdated() {
    const editorEl = this.renderRoot.querySelector("[part='editor']");
    this._editorInstance = new TipTap({
      content: this.value || this.json,
      element: editorEl,
      extensions: [
        StarterKit,
        CodeBlock,
        Placeholder.configure({ placeholder: this.placeholder }),
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
      <div part="editor"></div>
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
