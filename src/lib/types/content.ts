import { z } from 'zod';

export interface Permission {
  id: number;
  resource: string;
  value: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;

}
export interface Role extends Content {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  root: boolean;
  permissions?: string[];
  users?: User[] | RelationContentUpdate;
}

export interface Resource {
  group?: boolean;
  id: string;
  name: string;
  whitelist?: boolean;
  resources?: Resource[];
}

export interface User extends Content {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  username: string;
  email?: string;
  api_key: string;
  provider: string;
  provider_id: string;
  password?: string;
  active: boolean;
  credits: number;
  role_id?: number;
  roles?: Role[];
}

export interface Media extends Content {
  id: number;
  url: string;
  name: string;
  size: number;
  type: string;
  disk: string;
  path: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface SetupData {
  token: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires: string;
}

export interface Content {
  [key: string]: any;
  id?: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export type RelationContentArrayUpdate = {
  $add?: Array<{ id: number }>;
  $clear?: Array<{ id: number }>;
}

export type RelationContentArrayCreate = Array<{ id: number }>;

export type RelationContentUpdate = RelationContentArrayUpdate | RelationContentArrayCreate | Content | null;

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface PaginationResponse<T> extends Pagination{
  items: T[];
}

export type FilterOperator = '$eq' | '$neq' | '$gt' | '$gte' | '$lt' | '$lte' | '$like' | '$in' | '$nin' | '$null';
export type FilterValue = string | number | boolean | null | string[] | number[] | boolean[] | null[];

export type FilterObject = {
  [k in FilterOperator]: FilterValue;
}

export interface Filter {
  [key: string]: FilterObject | FilterValue | Filter[] | undefined;
  '$or'?: Filter[];
  '$and'?: Filter[];
}

export interface FilterParams {
  filter?: Filter;
  page?: number;
  limit?: number;
  sort?: string;
  select?: string;
}

export const relationSingleZodObject = z.object({
  id: z.number(),
});

export const relationArrayCreateZodObject = z.array(relationSingleZodObject);

export const relationArrayUpdateZodObject = z.object({
  '$nochange': z.boolean().optional(),
  '$add': z.array(relationSingleZodObject).optional(),
  '$clear': z.array(relationSingleZodObject).optional(),
});

export const relationArrayZodObject = z.union([relationArrayCreateZodObject, relationArrayUpdateZodObject]);



export type RelationArrayDataType = Zod.infer<typeof relationArrayUpdateZodObject>;
export type RelationDataType = Zod.infer<typeof relationSingleZodObject>;
