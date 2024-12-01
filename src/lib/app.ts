import { Get } from './request';
import { AppConfig, SidebarMenuItem } from './types';

export const getAppConfig = async (): Promise<AppConfig> => {
  const config = await Get<AppConfig>('/config');
  const menus: SidebarMenuItem[] = [];

  return {
    ...config,
    menus,
  };
};
