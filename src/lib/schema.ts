import { Delete, Get, Post, Put } from './request';
import { RenameItem, Schema } from './types';

export const listSchemas = async () => {
  const schemas = await Get<Schema[]>('/schema');
  return schemas.filter(s => !s.is_junction_schema);
}

export const saveSchema = async (schema: Schema, editingSchema?: string, renameFields?: RenameItem[]) => {
  let savedSchema = null;
  if (!editingSchema) {
    savedSchema = await Post<Schema>('/schema', schema);
  } else {
    savedSchema = await Put<Schema>(`/schema/${editingSchema}`, {
      schema,
      rename_fields: renameFields ?? [],
    });
  }

  if (savedSchema?.fields?.length) {
    savedSchema.fields = (savedSchema?.fields ?? []).map(field => {
      field.server_name = field.name;
      return field;
    });
  }

  return savedSchema;
}

export const getSchema = async (schemaName: string) => {
  if (!schemaName) {
    return null;
  }

  const schema = await Get<Schema>(`/schema/${schemaName}`);

  if (schema?.fields?.length) {
    schema.fields = (schema?.fields ?? []).map(field => {
      field.server_name = field.name;
      return field;
    });
  }

  return schema;
}

export const exportSchemas = async (body: {schemas : string[]}) => {
  const schema = await Post<Response>(`/schema/export`, body);
  return schema;
}

export const importSchemas = async (file: File[]) => {
  const formData = new FormData();
  file.forEach(file => formData.append('file', file));

  return await Post<any>('/schema/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const deleteSchema = (schemaName: string) => {
  return Delete(`/schema/${schemaName}`);
}
