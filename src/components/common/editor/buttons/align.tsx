import { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ToolbarButton } from '../toolbar/button';

export const alignMapIcons = {
  left: <AlignLeft />,
  center: <AlignCenter />,
  right: <AlignRight />,
  justify: <AlignJustify />,
};

export const AlignButton = ({ editor }: { editor: Editor }) => {
  const { pos } = editor.view.state.selection.$from;
  const node = editor.view.state.doc.resolve(pos).parent;
  const align: keyof (typeof alignMapIcons) = node.attrs.textAlign ?? 'left';

  return <ToolbarButton
    command='align'
    tooltip='Align'
    label={alignMapIcons[align] ?? alignMapIcons['left']}
    buttons={[
      {
        command: 'alignLeft',
        label: alignMapIcons['left'],
        exec: () => editor.chain().focus().setTextAlign('left').run(),
      },
      {
        command: 'alignCenter',
        label: alignMapIcons['center'],
        exec: () => editor.chain().focus().setTextAlign('center').run(),
      },
      {
        command: 'alignRight',
        label: alignMapIcons['right'],
        exec: () => editor.chain().focus().setTextAlign('right').run(),
      },
      {
        command: 'alignJustify',
        label: alignMapIcons['justify'],
        exec: () => editor.chain().focus().setTextAlign('justify').run(),
      },
    ]}
  />;
}
