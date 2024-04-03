import { useState } from 'react';
import { Media } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Image } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MediaList } from '@/components/media/list';
import { ToolbarButton } from '../toolbar/button';
import { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';

export interface MediaBrowserButtonProps {
  editor: Editor;
}
export const MediaButton = (props: MediaBrowserButtonProps) => {
  const { editor } = props;
  const [open, setOpen] = useState(false);

  const onSelectMedias = (medias: Media[]) => {
    setOpen(false);

    for (const media of medias) {
      if (media.type.startsWith('image/')) {
        editor.chain().focus().setImage({ src: media.url, alt: media.name }).run();
      } else {
        // Because the setLink method will add link to the selected text.
        // If we don't have any selected text, an empty link will be added to the cursor position.
        // So we need to insert the media name to the editor first.
        // then we make a selection from the start of the media name to the end of the media name
        // and set the link to the selected text
        editor.chain().focus().insertContent(media.name).run();
        
        // Add an extra space after the media name, so that we will able to move
        // the cursor to the end of the link after setting the link.
        // This is a workaround to deselect the inserted link to avoid
        // the link being replaced by the next inserted one.
        editor.chain().focus().insertContent(' ').run();
        const { tr } = editor.state;
        const { view } = editor;
        const cursorPos = tr.selection.from - 1; // (-1 to exclude the space character from the selection)
        const startSelection = cursorPos - media.name.length;
        const $start = view.state.doc.resolve(startSelection);
        const $end = view.state.doc.resolve(cursorPos);
        const transaction = view.state.tr.setSelection(new TextSelection($start, $end));
        view.dispatch(transaction);
        editor.chain().focus().setLink({ href: media.url }).run();

        // deselect the inserted link and move the cursor to the end of the link
        const newEndPos = cursorPos + 1;
        const $newEndPos = view.state.doc.resolve(newEndPos);
        const newerTransaction = view.state.tr.setSelection(new TextSelection($newEndPos));
        view.dispatch(newerTransaction);
      }
    }
  }

  return <>
    <ToolbarButton command='image' label={<Image />} tooltip='Media' exec={e => {
      e.preventDefault();
      setOpen(true);
    }} />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-[80%] h-[80%] max-w-[80%] max-h-[80%] flex flex-col'>
        <DialogHeader className='block'>
          <DialogTitle>
            Media Library
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col h-full overflow-hidden flex-1'>
          <ScrollArea className='h-full'>
            <MediaList showUploader multiple={true} onInsert={onSelectMedias} />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
