import { listSchemas } from './schema';
import { AppConfig, SidebarMenuItem } from './types';

export const getAppConfig = async (): Promise<AppConfig> => {
  const schemas = await listSchemas();
  const menus: SidebarMenuItem[] = [];
  const appConfig: AppConfig = {
    menus,
    schemas,
  };

  return appConfig;
}
