import { useLayoutEffect } from 'react';
import { useFloating, autoUpdate, offset, flip } from '@floating-ui/react-dom';
import { isNodeSelection, posToDOMRect } from '@tiptap/core';
import { Editor, getMarkRange } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import { LinkFloatingToolbar } from './link';

type FloatingMenuProps = {
  editor: Editor;
};

// Extended from:
// https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146
// https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1894184891
export const FloatingMenu = ({ editor }: FloatingMenuProps) => {
  const { view } = editor;
  const { x, y, strategy: position, refs } = useFloating({
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    middleware: [
      offset({ mainAxis: 8 }),
      flip({
        padding: 8,
        boundary: editor.options.element,
        fallbackPlacements: [
          'bottom',
          'top',
          'top-start',
          'bottom-start',
          'top-end',
          'bottom-end',
        ],
      }),
    ],
  });

  useLayoutEffect(() => {
    refs.setReference({
      getBoundingClientRect() {
        const { ranges } = editor.state.selection;
        const from = Math.min(...ranges.map(range => range.$from.pos));
        const to = Math.max(...ranges.map(range => range.$to.pos));

        // If the selection is a node selection, return the node's bounding rect
        if (isNodeSelection(editor.state.selection)) {
          const node = editor.view.nodeDOM(from) as HTMLElement;

          if (node) {
            return node.getBoundingClientRect();
          }
        }

        // If the cliked position is a mark, create a selection from the mark range
        // When the selection is not empy, the bubble menu will be shown
        const range = getMarkRange(view.state.doc.resolve(from), view.state.schema.marks.link);
        if (range) {
          const $start = view.state.doc.resolve(range.from);
          const $end = view.state.doc.resolve(range.to);
          const transaction = view.state.tr.setSelection(new TextSelection($start, $end));
          view.dispatch(transaction);
          return posToDOMRect(editor.view, range.from, range.to);
        }

        // Otherwise,
        return posToDOMRect(editor.view, from, to);
      },
    });
  }, [refs.reference, editor.state.selection, view]);

  const canOpenBubbleMenu = editor.isActive('link') ||
    editor.isActive('image') ||
    !editor.view.state.selection.empty;

  if (!canOpenBubbleMenu) {
    return null;
  }
  const style = { position, top: y ?? 0, left: x ?? 0, zIndex: 50 };

  return <div ref={refs.setFloating} style={style}>
    <div className='flex flex-wrap gap-1 border select-none items-center supports-backdrop-blur:bg-background/60 w-full rounded-lg backdrop-blur bg-background px-1'>
      <LinkFloatingToolbar editor={editor} />
    </div>
  </div>;
};
