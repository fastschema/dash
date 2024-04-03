import {
  Bold,
  Code,
  Code2,
  Italic,
  List,
  ListOrdered,
  Quote,
  SquareCheck,
  Strikethrough,
  Underline
} from 'lucide-react';
import { ToolbarButton } from './button';
import { useCurrentEditor } from '@tiptap/react';
import { AlignButton } from '../buttons/align';
import { FloatingMenu } from '../floating';
import { MediaButton } from '../buttons/media';
import { LinkButton } from '../buttons/link';
import { BgColorButton, ColorButton } from '../buttons/color';
import { TableButton } from '../buttons/table';
import { TextTransformButton } from '../buttons/text';

export const Toolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return <>
    <div className='sticky left-0 top-0 z-50'>
      <div className='flex flex-wrap gap-1 border-b border-b-border select-none items-center supports-backdrop-blur:bg-background/60 w-full rounded-t-lg bg-background/95 backdrop-blur px-1'>
        <TextTransformButton editor={editor} />
        <ToolbarButton command='bold' exec='toggleBold' label={<Bold />} tooltip='Bold' />
        <ToolbarButton command='italic' exec='toggleItalic' label={<Italic />} tooltip='Italic' />
        <ToolbarButton command='underline' exec='toggleUnderline' label={<Underline />} tooltip='Underline' />
        <ToolbarButton command='strike' exec='toggleStrike' label={<Strikethrough />} tooltip='Strikethrough' />
        <ToolbarButton command='code' exec='toggleCode' label={<Code />} tooltip='Inline code' />
        <ToolbarButton command='codeBlock' exec='toggleCodeBlock' label={<Code2 />} tooltip='Code block' />
        <ColorButton editor={editor} />
        <BgColorButton editor={editor} />
        <AlignButton editor={editor} />
        <ToolbarButton command='orderedList' exec='toggleOrderedList' label={<ListOrdered />} tooltip='Ordered list' />
        <ToolbarButton command='bulletList' exec='toggleBulletList' label={<List />} tooltip='Unordered list' />
        <ToolbarButton command='taskList' exec='toggleTaskList' label={<SquareCheck />} tooltip='Task list' />
        <ToolbarButton command='blockquote' exec='toggleBlockquote' label={<Quote />} tooltip='Blockquote' />
        <LinkButton editor={editor} />
        <MediaButton editor={editor} />
        <TableButton editor={editor} />
      </div>
    </div>

    <FloatingMenu editor={editor} />
  </>;
};
