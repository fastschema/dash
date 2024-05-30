export interface FieldEnum {
  value: string;
  label: string;
}

export interface FieldRelation {
  schema: string;
  field: string;
  type: 'o2o' | 'o2m' | 'm2m';
  owner?: boolean;
  fk_columns?: {
    [key: string]: string;
  } | null;
  junction_table?: string;
  optional?: boolean;
}

export interface FieldDB {
  attr?: string;
  collation?: string;
  increment?: boolean;
  key?: string;
}

export interface FieldRenderer {
  class?: string;
  settings?: Record<string, any>;
}

export type FieldType = 'bool' | 'time' | 'json' | 'uuid' | 'bytes' | 'enum' | 'string' | 'text' | 'int' | 'int8' | 'int16' | 'int32' | 'int64' | 'uint' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'float32' | 'float64' | 'relation' | 'file';

export interface Field {
  type: FieldType;
  name: string;
  multiple?: boolean;
  is_system_field?: boolean;
  server_name?: string;
  label: string;
  renderer?: FieldRenderer;
  size?: number;
  unique?: boolean;
  optional?: boolean;
  default?: any;
  sortable?: boolean;
  filterable?: boolean;
  db?: FieldDB | null;
  enums?: FieldEnum[];
  relation?: FieldRelation;
}

export interface Schema {
  name: string;
  namespace: string;
  label_field: string;
  disable_timestamp: boolean;
  is_system_schema?: boolean;
  is_junction_schema?: boolean;
  fields: Field[];
}

export interface RenameItem {
  from: string,
  to: string,
}
