import { Editor } from '@tiptap/react';
import { ReactNode } from 'react';
import { createFloatingLinkEditButton, createFloatingLinkOpenButton, createFloatingLinkRemoveButton } from './link';
import { AlignButton } from '../buttons/align';
import { LinkButton } from '../buttons/link';

export const getFloatingButtons = (editor: Editor, onClick: () => void) => {
  const buttons: Record<string, ReactNode> = {};

  if (editor.isActive('link')) {
    buttons.linkEdit = createFloatingLinkEditButton(onClick);
    buttons.linkOpen = createFloatingLinkOpenButton(onClick);
    buttons.linkRemove = createFloatingLinkRemoveButton(onClick);
  }

  if (editor.isActive('image')) {
    buttons.align = <AlignButton editor={editor} />;
    buttons.link = <LinkButton editor={editor} />;
  }

  if (editor.isActive('image') && editor.isActive('link')) {
    delete buttons.link;
  }

  return Object.entries(buttons).map(([key, value]) => {
    return {
      key,
      Button: value,
    }
  });
}
