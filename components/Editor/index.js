import React, { useEffect, useState } from "react";

import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Mention from "@tiptap/extension-mention";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";

import EditorTooltip from "./EditorTooltip.js";
import EditorToolbar from "./EditorToolbar.js";
import EditorColorPicker from "./EditorColorPicker.js";
import EditorImage from "./EditorImage.js";
import { blockTypes, alignTypes } from "./editorUtils.js";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
        parseHTML: (element) => {
          return element.style.backgroundColor.replace(/['"]+/g, "");
        },
      },
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
        parseHTML: (element) => {
          return element.style.backgroundColor.replace(/['"]+/g, "");
        },
      },
    };
  },
});

const Editor = ({
  editorSize,
  initState,
  updateState,
  resetState,
  syncState,
  placeholder,
  externalState,
  editable = true,
}) => {
  const isEditable = editable !== false;
  const toolbarDisabled = !isEditable;
  let extensions = [
    Blockquote,
    Bold,
    BulletList,
    Code,
    CodeBlock,
    Color,
    Document,
    Dropcursor,
    EditorImage.configure({
      inline: true,
    }),
    Gapcursor,
    HardBreak,
    Heading,
    Highlight.configure({
      multicolor: true,
    }),
    History,
    HorizontalRule,
    Italic,
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    ListItem,
    Mention,
    OrderedList,
    Paragraph,
    Placeholder.configure({
      placeholder: placeholder || "Write something...",
    }),
    Strike,
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "bordered dense",
      },
    }),
    CustomTableCell,
    CustomTableHeader,
    TableRow,
    TaskList.configure({
      HTMLAttributes: {
        class: "task-list",
      },
    }),
    TaskItem.configure({
      HTMLAttributes: {
        class: "task-item",
      },
    }),
    Text,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Underline,
    Youtube,
  ];

  if (editorSize == "mini") {
    const DisableEnter = Extension.create({
      addKeyboardShortcuts() {
        return {
          Enter: () => {
            if (syncState)
              syncState({
                html: this.editor.getHTML(),
                text: this.editor.getText(),
              });
            true;
          },
        };
      },
    });
    extensions.push(DisableEnter);
  }

  const editor = useEditor({
    extensions,
    content: initState.html,
    editable: isEditable,
  });

  const [linkActive, setLinkActive] = useState(false);
  const [currentLink, setCurrentLink] = useState("");
  const [activeBlock, setActiveBlock] = useState(blockTypes[0]);
  const [activeAlign, setActiveAlign] = useState(alignTypes[0]);
  const [colorPickerActive, setColorPickerActive] = useState(false);

  useEffect(() => {
    if (resetState && editor) editor.commands.setContent(" ");
  }, [resetState, editor]);

  useEffect(() => {
    if (!editor || !externalState) {
      return;
    }

    const content =
      typeof externalState.html === "string" ? externalState.html : "";

    if (editor.getHTML() === content) {
      if (updateState) {
        updateState({
          html: editor.getHTML(),
          text: editor.getText(),
        });
      }
      return;
    }

    editor.commands.setContent(content || " ");
    if (updateState) {
      updateState({
        html: editor.getHTML(),
        text: editor.getText(),
      });
    }
  }, [editor, externalState?.version, externalState?.html, updateState]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
      editor.on("update", ({ editor }) => {
        updateState({
          html: editor.getHTML(),
          text: editor.getText(),
        });
      });

      editor.on("transaction", ({ editor }, transaction) => {
        if (editor.isActive("paragraph")) setActiveBlock(blockTypes[0]);
        if (editor.isActive("heading", { level: 1 }))
          setActiveBlock(blockTypes[1]);
        if (editor.isActive("heading", { level: 2 }))
          setActiveBlock(blockTypes[2]);
        if (editor.isActive("heading", { level: 3 }))
          setActiveBlock(blockTypes[3]);
        if (editor.isActive("orderedList")) setActiveBlock(blockTypes[4]);
        if (editor.isActive("bulletList")) setActiveBlock(blockTypes[5]);
        if (editor.isActive("blockquote")) setActiveBlock(blockTypes[6]);
        if (editor.isActive("codeBlock")) setActiveBlock(blockTypes[7]);

        if (editor.isActive({ textAlign: "left" }))
          setActiveAlign(alignTypes[0]);
        if (editor.isActive({ textAlign: "right" }))
          setActiveAlign(alignTypes[1]);
        if (editor.isActive({ textAlign: "center" }))
          setActiveAlign(alignTypes[2]);
        if (editor.isActive({ textAlign: "justify" }))
          setActiveAlign(alignTypes[3]);
      });

      editor.on("blur", ({ editor }) => {
        if (syncState && editorSize !== "mini")
          syncState({
            html: editor.getHTML(),
            text: editor.getText(),
          });
      });
    }
  }, [editor, isEditable]);

  useEffect(() => {
    if (editor) {
      let timer = setTimeout(() => {
        if (currentLink && currentLink.length > 2) {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: currentLink })
            .run();
        }
      }, 650);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentLink, editor]);

  return (
    <div className="editor-wrapper">
      {editorSize && editorSize != "mini" && (
        <EditorToolbar
          {...{
            editor,
            editorSize,
            activeBlock,
            activeAlign,
            setColorPickerActive,
            toolbarDisabled,
          }}
        />
      )}

      {isEditable && editor && (!editorSize || editorSize == "large") && (
        <EditorTooltip
          {...{
            editor,
            linkActive,
            setLinkActive,
            currentLink,
            setCurrentLink,
            setColorPickerActive,
          }}
        />
      )}
      <EditorContent {...{ editor }} className="editor-content" />
      {isEditable && (
        <EditorColorPicker
          {...{ editor, colorPickerActive, setColorPickerActive }}
        />
      )}
    </div>
  );
};

export default Editor;
