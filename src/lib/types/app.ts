import { ReactNode } from 'react';
import { Schema } from './schema';

export interface SidebarMenuItem {
  name: string;
  icon: string;
  path: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface AppConfig {
  menus: SidebarMenuItem[];
  schemas: Schema[];
}

export interface SystemError {
  error: string;
  message: string;
}

export interface PageInfoData {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode[];
}

export interface Stats {
  totalSchemas: number;
  totalUsers: number;
  totalRoles: number;
  totalMedias: number;
}
