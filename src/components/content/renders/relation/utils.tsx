import { getContentList } from '@/lib/content';
import { Content, Field, FieldRelation, Filter, FilterObject, RelationContentUpdate, Schema } from '@/lib/types';

export const getValue = (value?: Content | Content[]) => {
  return (Array.isArray(value) ? value : [value]).filter(v => v) as Content[];
}

export const isMultiple = (relation?: FieldRelation): boolean => {
  return relation?.type === 'm2m' || (relation?.type === 'o2m' && !!relation?.owner);
}

export const triggerChanges = (
  addedItems: Content[],
  removedItems: Content[],
  onChange: (value?: RelationContentUpdate) => void,
  isMultiple?: boolean,
  optional?: boolean,
  contentId?: number,
) => {
  if (!isMultiple) {
    // For the single relation field, the value is only one item.
    // There are two cases that addedItems will have value:
    //  - User create a new content and select a relation item.
    //  - User update the existing content that already have a relation item.
    if (addedItems.length) {
      onChange(addedItems[0]);
      return;
    }

    // if there is no added item, but have removed item, it mean the relation field is cleared
    if (!addedItems.length && removedItems.length) {
      onChange(optional ? null : undefined);
      return;
    }

    onChange(optional ? null : undefined);
    return;
  }

  const addedIds = addedItems.map(option => ({ id: option.id }));
  let added = addedIds.length ? addedIds : undefined;

  const removedIds = removedItems.map(option => ({ id: option.id }));
  let removed = removedIds.length ? removedIds : undefined;

  // If content is update, the relation field should be add/clear the relation items.
  // Otherwise, the relation field should be create the relation items.

  const createValue = !added?.length && optional ? null : added;
  onChange(contentId ? {
    '$add': added,
    '$clear': removed,
  } : createValue);
}

export const searchSchemaContents = async (
  field: Field,
  search: string,
  page: number,
  relationSchema?: Schema,
  contentId?: number,
) => {
  if (!relationSchema || !field.relation) return;

  const filter: Filter = {};
  if (search) {
    filter[relationSchema.label_field] = {
      $like: `%${search}%`,
    } as FilterObject;
  }

  if (contentId) {
    const relationField = field.relation.field;
    const filterField = `${relationField}.id`;
    filter[filterField] = contentId;
  }

  const result = await getContentList(relationSchema.name, {
    page,
    limit: 20,
    filter: Object.keys(filter).length ? filter : undefined,
    select: `id,${relationSchema.label_field}`,
  });
  return result;
}
