import { Editor } from '@tiptap/react';

export interface LinkInfo {
  text: string;
  href: string;
  rel: string;
  target: string;
}

export const getSelectedText = (editor: Editor | null) => {
  if (!editor) return '';
  const { view } = editor;
  const { ranges } = editor.state.selection;
  const from = Math.min(...ranges.map(range => range.$from.pos));
  const to = Math.max(...ranges.map(range => range.$to.pos));
  return view.state.doc.textBetween(from, to, ' ');
}

export const updateSelectedText = (editor: Editor, text: string): void => {
  const { view } = editor;
  const { ranges } = editor.state.selection;
  const from = Math.min(...ranges.map(range => range.$from.pos));
  const to = Math.max(...ranges.map(range => range.$to.pos));
  const transaction = view.state.tr.insertText(text, from, to);
  view.dispatch(transaction);
}

export const getSelectedLink = (editor: Editor | null): (LinkInfo | undefined) => {
  const link = editor?.getAttributes('link');

  if (link?.href === undefined) {
    return undefined;
  }

  return {
    text: getSelectedText(editor),
    href: link?.href,
    rel: link?.rel,
    target: link?.target,
  }
}
