import uniqBy from 'lodash.uniqby';
import { Field, FieldRendererFn, Media, RelationArrayDataType, RelationDataType } from '@/lib/types';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { BaseFieldRenderer } from './base';
import { MediaModal } from '@/components/media/modal';
import { useEffect, useState } from 'react';
import { MediaItem } from '@/components/media/list';
import { triggerChanges } from './relation/utils';

export interface MediaFieldMultipleProps {
  multiple: true;
  onSelect: (data: RelationArrayDataType) => void;
}

export interface MediaFieldSingleProps {
  multiple?: false;
  onSelect: (data: RelationDataType) => void;
}
export type MediaFieldProps = MediaFieldMultipleProps | MediaFieldSingleProps;

export class FieldRendererMedia extends BaseFieldRenderer {
  class = 'media';
  settings: Field[] = [
    {
      type: 'enum',
      name: 'type',
      label: 'Media Type',
      enums: [
        { value: 'all', label: 'All file types' },
        { value: 'image', label: 'Image' },
        { value: 'video', label: 'Video' },
        { value: 'audio', label: 'Audio' },
        { value: 'document', label: 'Document' },
      ],
    }
  ];
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>,
  ) => {
    const value = (Array.isArray(fieldProps.value) ? fieldProps.value : [fieldProps.value]) as Media[];
    const [selected, setSelected] = useState<Media[]>(value.filter(Boolean));
    const [cleared, setCleared] = useState<Media[]>([]);
    useEffect(() => {
      triggerChanges(
        selected,
        cleared,
        fieldProps.onChange,
        this.field.multiple,
        this.field.optional,
        this.content?.id,
      );
    }, [selected, cleared]);

    const onMediasSelect = (medias: Media[]) => {
      if (!medias.length) return;

      const newSelectedMedias = this.field.multiple
        ? selected.concat(medias)
        : medias;
      setSelected(uniqBy(newSelectedMedias, m => m.id));
      setCleared(uniqBy(cleared.filter(m => !newSelectedMedias.find(mm => mm.id === m.id)), m => m.id));
    }

    const onMediaUnAttach = (media: Media) => {
      const newClearMedias = cleared.concat(media);
      setCleared(uniqBy(newClearMedias, m => m.id));
      setSelected(uniqBy(selected.filter(m => !newClearMedias.find(mm => mm.id === m.id)), m => m.id));
    }

    return <div className='flex flex-col gap-2'>
      <MediaModal
        multiple={this.field.multiple}
        onSelect={onMediasSelect}
      />
      <div className='flex flex-wrap gap-2'>
        {selected.map(media => {
          return <MediaItem
            hideInfo
            key={media.id}
            media={media}
            wrapperClassName='w-[100px] sm:w-[100px] md:w-[100px] xl:w-[100px]'
            onUnAttach={onMediaUnAttach}
          />;
        })}
      </div>
    </div>
  }
}
