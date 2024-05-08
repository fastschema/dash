import { useState } from 'react';
import { Media } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileIcon, Trash2, X } from 'lucide-react';
import { Button } from '@/components/common/button';
import { useQuery } from '@tanstack/react-query';
import { getContentList } from '@/lib/content';
import { Loading } from '@/components/common/loading';
import { SystemError } from '@/components/common/error';
import { deleteFiles } from '@/lib/media';
import { notify } from '@/lib/notify';
import { MediaUploader } from './uploader';

const fileIcon = <FileIcon className='w-[50%] text-slate-300' width='50%' height='50%' />;
export interface MediaListProps {
  showUploader?: boolean;
  onInsert?: (medias: Media[]) => void;
  multiple?: boolean;
}


export const MediaList = (props: MediaListProps) => {
  const { showUploader, onInsert, multiple } = props;
  const [page, setPage] = useState(1);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);
  const [uploadedMedias, setUploadedMedias] = useState<Media[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['media', page],
    queryFn: () => getContentList<Media>('media', {
      limit: 20,
      page: page ?? undefined,
    }),
    retry: 0,
  });


  const setSelectMedia = (media: Media) => {
    if (multiple) {
      return setSelectedMedias(prev => {
        const value = prev.includes(media)
          ? prev.filter(i => i !== media)
          : [...prev, media];
        return value;
      })
    }

    setSelectedMedias(selectedMedias.includes(media) ? [] : [media]);
  }

  const deleteMedias = () => {
    selectedMedias.length && (async () => {
      if (confirm('Are you sure to delete selected medias?')) {
        try {
          await deleteFiles(selectedMedias.map(m => m.id));
          await refetch();
          setSelectedMedias([]);
          notify.success('Medias deleted successfully');
        } catch (e: any) { }
      }
    })();
  }

  if (error) return <SystemError error={error} />;

  return <div className='space-y-5 relative h-full'>
    <div className='flex items-center p-1 bg-muted flex-1 rounded-lg sticky top-0 justify-between z-10'>
      <div className='flex items-center gap-2'>
        {showUploader && <MediaUploader
          minimal
          onMediaUploaded={media => setUploadedMedias(prev => [media, ...prev])}
          onUploadComplete={() => {
            setUploadedMedias([]);
            refetch();
          }}
        />}
        {onInsert && <Button
          size='sm'
          onClick={() => onInsert(selectedMedias)}
          disabled={!selectedMedias.length}
        >
          Insert
        </Button>}
      </div>
      <div className='flex items-center gap-2 pr-2'>
        <Button
          size='sm'
          variant='link'
          disabled={!selectedMedias.length}
          onClick={deleteMedias}
          className='text-red-500 hover:text-red-600'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          {selectedMedias.length ? `Delete selected (${selectedMedias.length})` : 'Delete selected'}
        </Button>

        <Button variant='outline' size='sm' disabled={page === 1} onClick={() => {
          page > 1 && setPage(page - 1);
        }}>
          <ChevronLeft className='mr-2 h-4 w-4' />
          Previous
        </Button>
        <Button variant='outline' size='sm' disabled={page === data?.pagination?.last_page} onClick={() => {
          page < (data?.pagination?.last_page ?? 1) && setPage(page + 1);
        }}>
          Next
          <ChevronRight className='ml-2 h-4 w-4' />
        </Button>
        <div>
          <span className='text-sm text-muted-foreground'>{page} of {data?.pagination?.last_page}</span>
        </div>
      </div>
    </div>
    {isLoading ? <Loading /> : <div className='flex flex-wrap gap-5'>
      {uploadedMedias.map(media => {
        return <MediaItem
          key={media.id}
          media={media}
          selectedMedias={selectedMedias}
          onClick={setSelectMedia}
        />;
      })}
      {(data?.items ?? []).map(media => {
        return <MediaItem
          key={media.id}
          media={media}
          selectedMedias={selectedMedias}
          onClick={setSelectMedia}
        />;
      })}
    </div>}
  </div>;
}

export const MediaItem = ({
  media,
  onClick,
  selectedMedias,
  wrapperClassName,
  hideInfo,
  onUnAttach,
}: {
  media: Media,
  wrapperClassName?: string;
  selectedMedias?: Media[],
  hideInfo?: boolean;
  onClick?: (media: Media) => void;
  onUnAttach?: (media: Media) => void;
}) => {
  const selected = !!(selectedMedias ?? []).filter(m => m.id === media.id).length;
  const className = cn(
    'cursor-pointer rounded-md overflow-hidden bg-slate-100 border hover:shadow-lg',
    selected && 'border-2 border-amber-300 shadow-sm hover:shadow-amber-100',
  );

  return <div
    className={cn('flex flex-wrap w-full sm:w-full md:w-[200px] xl:w-[230px] relative', wrapperClassName)}
    role='none'
    onClick={() => onClick?.(media)}
  >
    {onUnAttach && <div className='absolute top-1 right-1 z-10'>
      <button
        type='button'
        onClick={() => onUnAttach(media)}
        className='p-1 rounded-full bg-slate-200 hover:bg-slate-300'
      >
        <X className='h-3 w-3' />
      </button>
    </div>}

    <div className={className}>
      <div className='flex w-full aspect-square items-center justify-center p-1 bg-slate-50'>
        {!media.type.startsWith('image/') ? fileIcon : <img
          className='max-h-full object-contain object-center rounded-sm'
          alt={media.name}
          src={media.url} />}
      </div>
      {!hideInfo && <div className='flex-1 p-3 border-t'>
        <div className='space-y-1 text-sm break-words'>
          <p className='text-xs text-muted-foreground'>{(media.type.split(';')[0])}</p>
          <h3 className='font-medium leading line-clamp-1'>{media.name}</h3>
        </div>
      </div>}
    </div>
  </div>;
}
