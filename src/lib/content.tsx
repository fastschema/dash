import { isMultiple } from '@/components/content/renders/relation/utils';
import { Delete, Get, Post, Put } from './request';
import { Content, FilterParams, PaginationResponse, Schema } from './types';

export const saveContent = async (schema: Schema, content: Content, id?: number) => {
  const saveData: Content = {
    '$add': {},
    '$set': {},
    '$clear': {},
  };

  for (const field of schema.fields) {
    if (!(field.name in content || field.is_system_field)) {
      continue;
    }

    if (field.type === 'relation' || field.type === 'media') {
      // Updating content relation
      if (id) {
        // Clearing all content from relation
        if (content[field.name] === null) {
          saveData['$clear'][field.name] = true;
          continue;
        }

        if (content[field.name]['$nochange']) {
          continue;
        }

        if (!isMultiple(field.relation)) {
          saveData['$set'][field.name] = content[field.name];
          continue;
        }

        // Add some content to relation
        if (content[field.name]['$add']) {
          saveData['$add'][field.name] = content[field.name]['$add'];
        }

        // Clear some content from relation
        if (content[field.name]['$clear']) {
          saveData['$clear'][field.name] = content[field.name]['$clear'];
        }

        continue;
      }

      // Creating new content with relation, no need to use add, just assign the value
      if (content?.[field.name]?.['$add']) {
        saveData[field.name] = content[field.name]['$add'];
        continue;
      }

      // The content is new, so we don't need to clear anything, remove the clear key
      if (content?.[field.name]?.['$clear']) {
        delete saveData[field.name];
        continue;
      }
    }

    saveData[field.name] = content[field.name];
  }

  if (Object.keys(saveData['$add']).length === 0) {
    delete saveData['$add'];
  }

  if (Object.keys(saveData['$set']).length === 0) {
    delete saveData['$set'];
  }

  if (Object.keys(saveData['$clear']).length === 0) {
    delete saveData['$clear'];
  }

  let savedContent = null;

  if (!id) {
    savedContent = await Post<Content>(`/content/${schema.name}`, saveData);
  } else {
    savedContent = await Put<Content>(`/content/${schema.name}/${id}`, saveData);
  }

  return savedContent;
};

export const getContentFilterQuery = (params?: FilterParams) => {
  const query: { [k: string]: any } = {};
  params?.limit && (query['limit'] = params.limit);
  params?.page && (query['page'] = params.page);
  params?.sort && (query['sort'] = params.sort);
  params?.select && (query['select'] = params.select);
  params?.filter && (query['filter'] = JSON.stringify(params.filter));
  return new URLSearchParams(query).toString();
};

export const getContentList = async <T extends Content = Content>(
  schemaName?: string | null,
  params?: FilterParams,
): Promise<PaginationResponse<T>> => {
  if (!schemaName) {
    throw new Error('Schema name is required');
  }

  const query: { [k: string]: any } = {};
  params?.limit && (query['limit'] = params.limit);
  params?.page && (query['page'] = params.page);
  params?.sort && (query['sort'] = params.sort);
  params?.select && (query['select'] = params.select);
  params?.filter && (query['filter'] = JSON.stringify(params.filter));

  const queryString = Object.keys(query).length > 0
    ? '?' + getContentFilterQuery(params)
    : '';

  return Get<PaginationResponse<T>>(`/content/${schemaName}${queryString}`);
};

export const getContentDetail = async (
  schema: Schema,
  id: string,
  relationFields?: string[],
): Promise<Content> => {
  const select = relationFields?.length
    ? `?select=${relationFields.join(',')}`
    : '';

  return Get<Content>(`/content/${schema.name}/${id}${select}`);
}

export const deleteContent = async (schemaName: string, id: number): Promise<Content> => {
  return Delete<Content>(`/content/${schemaName}/${id}`);
}
