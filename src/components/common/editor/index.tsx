'use client';

import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Blockquote from '@tiptap/extension-blockquote';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Heading from '@tiptap/extension-heading';
import { createLowlight, common as commonGrammars } from 'lowlight';
import { EditorProvider } from '@tiptap/react';
import { Toolbar } from './toolbar';
import { CodeBlock } from './codeblock';
import { BgColor } from './bgcolor';

export interface EditorProps {
  onChange?: (value: string) => void;
  value?: string;
}

export const Editor = (props: EditorProps) => {
  const { value, onChange } = props;
  return <div className='rounded-lg border bg-background shadow relative'>
    <EditorProvider
      extensions={[
        StarterKit.configure({
          codeBlock: false,
          listItem: false,
          blockquote: false,
          heading: false,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        CodeBlock.configure({
          lowlight: createLowlight(commonGrammars),
          languageClassPrefix: 'language-',
          defaultLanguage: 'javascript',
        }),
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        Heading.configure({
          levels: [1, 2, 3, 4, 5, 6],
        }),
        Table.configure({
          resizable: true,
          lastColumnResizable: true,
          allowTableNodeSelection: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        TextStyle,
        Underline,
        ListItem,
        Link.configure({ openOnClick: false }),
        TaskItem.configure({ nested: true }),
        TaskList,
        Blockquote,
        BgColor.configure({ types: ['textStyle'] }),
        Color.configure({ types: ['textStyle'] }),
      ]}
      content={value}
      onUpdate={({ editor }) => {
        onChange?.(editor.getHTML());
      }}
      slotBefore={<Toolbar />}
      editorProps={{
        attributes: {
          class: 'p-10 max-w-full fs-editor'
        }
      }}
    >
      <div></div>
    </EditorProvider>
  </div>;
}
