import { Link2 } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { ToolbarButton } from '../toolbar/button';

export interface LinkButtonProps {
  editor: Editor;
  onClick?: () => void;
}
export const LinkButton = (props: LinkButtonProps) => {
  const { editor, onClick } = props;
  return <ToolbarButton
    command='link'
    tooltip='Link'
    label={<Link2 />}
    exec={e => {
      e.preventDefault();
      editor?.chain().focus().extendMarkRange('link').setLink({ href: '' }).run();
      onClick?.();
    }}
  />;
}
