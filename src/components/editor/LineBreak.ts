import { Node, mergeAttributes, getNodeType } from "@tiptap/core";

export interface HardBreakOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    hardBreak: {
      /**
       * Add a hard break
       */
      setHardBreak: () => ReturnType;
    };
  }
}

export default Node.create({
  name: "hardBreak",
  defaultOptions: {
    HTMLAttributes: {},
  },
  inline: true,
  group: "inline",
  selectable: false,
  parseHTML() {
    return [{ tag: "br" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["br", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addCommands() {
    return {
      setHardBreak:
        () =>
        (props) => {
          const { state } = props;
          const listNodeType = getNodeType('listItem', state.schema)

          return props.commands.first([
            () => props.commands.exitCode(),
            () => props.commands.splitListItem(listNodeType),
            () => props.commands.insertContent({ type: this.name }),
          ]);
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak(),
    };
  },
});
