import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import sharedStyles from "../../shared/styles";

import { Editor as TipTap } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";

const styles = css`
  :host {
    width: 100%;
    --j-editor-border-color: var(--j-color-ui-100);
  }
  :host(:focus-within) {
    --j-editor-border-color: var(--j-color-ui-200);
  }
  [part="base"] {
    width: 100%;
    border: 2px solid var(--j-editor-border-color);
    border-radius: var(--j-border-radius);
  }
  [part="toolbar"] {
    padding: var(--j-space-200);
  }
  .ProseMirror {
    padding: var(--j-space-500);
    border-bottom: 1px solid var(--j-color-ui-100);
    width: 100%;
    min-height: 40px;
  }
  .ProseMirror:focus {
    outline: 0;
  }
  p {
    margin-top: 0;
  }
`;

@customElement("j-editor")
export default class Editor extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: String })
  value = "";

  @state()
  editorInstance = null;

  firstUpdated() {
    const editorEl = this.renderRoot.querySelector("[part='editor']");
    this.editorInstance = new TipTap({
      content: this.value,
      element: editorEl,
      extensions: [StarterKit, CodeBlock],
      onUpdate: ({ editor }) => {
        this.value = editor.getHTML();
        this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
      },
    });
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("value") && this.editorInstance) {
      // TODO: Bug when this gets set and marker is put on bottom of input field
      this.editorInstance.commands.setContent(this.value);
    }
    return true;
  }

  _toggleBold() {
    this.editorInstance.chain().toggleBold().focus().run();
  }

  render() {
    return html` <div part="base">
      <div part="editor"></div>
      <div part="toolbar">
        <j-button
          @click=${() => this.editorInstance.chain().toggleBold().focus().run()}
        >
          <j-icon name="type-bold"></j-icon>
        </j-button>
        <j-button
          @click=${() =>
            this.editorInstance.chain().toggleItalic().focus().run()}
        >
          <j-icon name="type-italic"></j-icon>
        </j-button>
        <j-button
          @click=${() =>
            this.editorInstance.chain().toggleStrike().focus().run()}
        >
          <j-icon name="type-strikethrough"></j-icon>
        </j-button>
        <j-button
          @click=${() =>
            this.editorInstance.chain().toggleCodeBlock().focus().run()}
        >
          <j-icon name="code"></j-icon>
        </j-button>
      </div>
    </div>`;
  }
}
