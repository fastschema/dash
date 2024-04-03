import { ControllerRenderProps } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Content, Field } from '@/lib/types';
import { useAppSchema } from '@/lib/context';
import { isMultiple, triggerChanges } from './utils';
import { RelationContentsBrowser } from './browser';
import { Button } from '@/components/common/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type FieldPropsType = ControllerRenderProps<{
  [k: string]: any;
  value?: Content | Content[];
}, 'value'>;
export interface RelationSelectProps {
  fieldProps: FieldPropsType;
  field: Field;
  content?: Content;
}

// The RelationSelect component is used to render the relation field in the content edit form.
// There are two types of relation value:
//  - Single relation: The value is a single item, for example the post belongs to one category.
//  - Multiple relation: The value is an array of items, for example the post can have multiple tags.
// The behavior of the RelationSelect component is different for each type of relation value.
//
// Single relation:
//  - The value will be undefined or an item (in form of {"id": 1}).
//  - When user select an item, the value will be updated to that item.
//  - When user remove the selected item, the value will be undefined.
//  - The undefined value will be used to validate the form.
//  - When updating a content, the single relation value will be load together with the content.
//  - The component will then add the loaded value into the addedItems state.
//
// Multiple relation:
//  - There may be some or hundreds of thousands of items that are connected to the current content.
//  - It is not practical to load all items into the browser, update the values and save it.
//  - So we have to load the connected/available items separately.
//  - The value will be undefined or an object with two properties:
//    - $add: an array of items that user selected.
//    - $clear: an array of items that user removed.
export const RelationSelect = (props: RelationSelectProps) => {
  const { field, fieldProps: fp, content } = props;
  const multiple = isMultiple(field.relation);
  const [initialized, setInitialized] = useState(false);
  // When updating a content, the single relation value will be load together with the content.
  // This value must be added to the addedItems state.
  const [addedItems, setAddedItems] = useState<Content[]>(
    !multiple && content && fp.value ? [fp.value] : []
  );
  const [removedItems, setRemovedItems] = useState<Content[]>([]);
  const [open, setOpen] = useState(false);
  const relationSchema = useAppSchema(field.relation?.schema ?? null);

  useEffect(() => {
    setInitialized(true);

    // We have to reset the addedItems and removedItems state in these cases:
    //  - The relation field is not single.
    //  - This is not a content edit form (it is a new content form).
    if (multiple || !content?.id) {
      setAddedItems([]);
      setRemovedItems([]);
    }
  }, [multiple, content?.id]);

  const onItemRemoved = (item: Content) => {
    if (!removedItems.find(removed => removed.id === item.id)) {
      setRemovedItems(multiple ? [...removedItems, item] : [item]);
    }

    setAddedItems(addedItems.filter(added => added.id !== item.id));
  }

  const onItemAdded = (item: Content) => {
    if (!addedItems.find(added => added.id === item.id)) {
      setAddedItems(multiple ? [...addedItems, item] : [item]);
    }

    setRemovedItems(removedItems.filter(removed => removed.id !== item.id));
  }

  useEffect(() => {
    initialized && triggerChanges(
      addedItems,
      removedItems,
      fp.onChange,
      multiple,
      field.optional,
      content?.id,
    );
  }, [addedItems, removedItems]);

  if (!initialized || !relationSchema) return null;

  let selectedText = undefined;
  if (multiple) {
    selectedText = `Update connected ${relationSchema.namespace}`;
  } else {
    selectedText = addedItems.length ? addedItems[0][relationSchema.label_field] : 'Select';
  }

  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button variant='outline' className='justify-start'>
        {selectedText}
      </Button>
    </PopoverTrigger>
    <PopoverContent className='p-0 w-[602px]' align='start'>
      <div className='text-sm grid grid-cols-2 items-start'>
        <div className='min-w-[300px] mr-0'>
          <RelationContentsBrowser
            label='Selected (click to remove)'
            field={field}
            includes={addedItems}
            excludes={removedItems}
            onSelect={onItemRemoved}
            content={content}
            fetchCondition={() => !!content}
          />
        </div>
        <div className='min-w-[300px] border-l'>
          <RelationContentsBrowser
            label='Available (click to add)'
            field={field}
            excludes={addedItems}
            onSelect={onItemAdded}
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>;
}
