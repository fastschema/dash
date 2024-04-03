import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MediaList } from './list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Media } from '@/lib/types';
import { useState } from 'react';

export interface MediaModalProps {
  multiple?: boolean;
  onSelect?: (medias: Media[]) => void;
}

export const MediaModal = (props: MediaModalProps) => {
  const { onSelect, multiple } = props;
  const [open, setOpen] = useState(false);

  return <div className='flex flex-col space-y-2'>
    <div>
      <Button
        type='button'
        variant='secondary'
        size='sm' onClick={() => setOpen(true)}
      >Select Media</Button>
    </div>

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className='w-[80%] h-[80%] max-w-[80%] max-h-[80%] flex flex-col'>
        <DialogHeader className='block'>
          <DialogTitle>
            Media Library
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col h-full overflow-hidden flex-1'>
          <ScrollArea className='h-full'>
            <MediaList showUploader multiple={multiple} onInsert={medias => {
              onSelect?.(medias);
              setOpen(false);
            }} />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  </div>;
}
