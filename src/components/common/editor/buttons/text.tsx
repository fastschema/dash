import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Editor } from '@tiptap/react';
import { ToolbarButton } from '../toolbar/button';
import { ChevronDown, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Text } from 'lucide-react';
import { ReactNode } from 'react';

interface NodeType {
  label: ReactNode;
  onClick?: (editor: Editor) => void;
}

const nodeTypeMap: Record<string, NodeType> = {
  paragraph: {
    label: <div className='flex items-center gap-2'>
      <Text /> Paragraph
    </div>,
    onClick: (editor) => editor.chain().focus().setParagraph().run(),
  },
  h1: {
    label: <div className='flex items-center gap-2'>
      <Heading1 /> Heading 1
    </div>,
    onClick: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  h2: {
    label: <div className='flex items-center gap-2'>
      <Heading2 /> Heading 2
    </div>,
    onClick: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  h3: {
    label: <div className='flex items-center gap-2'>
      <Heading3 /> Heading 3
    </div>,
    onClick: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
  },
  h4: {
    label: <div className='flex items-center gap-2'>
      <Heading4 /> Heading 4
    </div>,
    onClick: (editor) => editor.chain().focus().setHeading({ level: 4 }).run(),
  },
  h5: {
    label: <div className='flex items-center gap-2'>
      <Heading5 /> Heading 5
    </div>,
    onClick: (editor) => editor.chain().focus().setHeading({ level: 5 }).run(),
  },
  h6: {
    label: <div className='flex items-center gap-2'>
      <Heading6 /> Heading 6
    </div>,
    onClick: (editor) => editor.chain().focus().setHeading({ level: 6 }).run(),
  },
};

export const TextTransformButton = ({ editor }: { editor: Editor }) => {
  const { pos } = editor.view.state.selection.$from;
  const node = editor.view.state.doc.resolve(pos).parent;
  const nodeName = node.type.name;
  let nodeType = nodeName;

  if (nodeName === 'heading') {
    nodeType = `h${node.attrs.level}`;
  }

  const currentNode = nodeTypeMap[nodeType] ?? nodeTypeMap.paragraph;

  return <ToolbarButton
    separator
    command='text'
    tooltip='Transform text'
    exec={e => e.preventDefault()}
    label={<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role='none'
          tabIndex={-1}
          className='inline-flex px-1 lg:min-w-[130px] justify-between items-center cursor-pointer outline-none'
        >
          <span>{currentNode.label}</span>
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' sideOffset={12} className='-ml-2 w-[160px]'>
        <DropdownMenuLabel>Transform text</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.entries(nodeTypeMap).map(([key, { label, onClick }]) => (
            <DropdownMenuCheckboxItem
              className='cursor-pointer'
              key={key}
              onClick={() => onClick?.(editor)}
              checked={key === nodeType}
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>}
  />;
}
