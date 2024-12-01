import { createContext, useContext } from 'react';
import { AppConfig, Schema, User } from './types';
import { isMultiple } from '@/components/content/renders/relation/utils';

export interface AppContextType {
  appConfig: AppConfig;
  setAppConfig: (appConfig: AppConfig) => void;
  reloadAppConfig(): Promise<void>;
}

export interface AuthContextType {
  user?: User;
  setUser?: (user?: User) => void;
}

// App context
export const defaultAppState: AppContextType = {
  appConfig: {
    version: '',
    resources: [],
    menus: [],
    schemas: [],
  },
  setAppConfig: () => null,
  reloadAppConfig: () => Promise.resolve(),
};

export const AppContext = createContext<AppContextType>(defaultAppState);

export const useAppConfig = (): AppConfig => {
  const context = useContext(AppContext);
  return context.appConfig;
};

export const useAppSchemas = (): Schema[] => {
  const context = useContext(AppContext);
  return context.appConfig.schemas;
};

export const useAppSchema = (schemaName: string | null): Schema | undefined => {
  const context = useContext(AppContext);
  return context.appConfig.schemas.find((s) => s.name === schemaName);
};

// Auth context
export const defaultAuthState: AuthContextType = {
  user: undefined,
  setUser: () => null,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthState);

export const useUser = (): User | undefined => {
  const context = useContext(AuthContext);
  return context.user;
};

export const useRelationFields = (schema?: Schema, allSchemas: Schema[] = []): string[] => {
  if (!schema) {
    return [];
  }

  const relationFields = schema.fields
    .filter(field => {
      return (field.type === 'relation' && field.relation) || field.type === 'file';
    })
    .map(field => {
      if (!field.relation) {
        throw new Error(`Field ${field.name} is relation type but has no relation field`);
      }

      // The multiple value relation fields may have many values.
      // These values will be load seperately in the "relation select" component.
      // So we don't need to load them here.
      // We only need to load the single value relation fields and media fields.
      // It's required to set the relation value to the form field.
      if (isMultiple(field.relation) && field.type !== 'file') {
        return null;
      }

      const targetSchema = allSchemas.find(s => s.name === field.relation?.schema);

      if (!targetSchema) {
        throw new Error(`Schema ${field.relation.schema} not found`);
      }

      const columns = [`${field.name}.id`, `${field.name}.${targetSchema.label_field}`];
      (field.type === 'file') && columns.push(`${field.name}.path`, `${field.name}.type`, `${field.name}.disk`);

      return columns.join(',');
    }).filter(Boolean) as string[];

  return relationFields;
}
