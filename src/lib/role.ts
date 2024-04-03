import { RoleFormValues } from '@/components/role/data';
import { Delete, Get, Post, Put } from './request';
import { Permission, Resource, Role } from './types';

export const listRoles = async () => {
  return Get<Role[]>('/role');
}

export const getRole = async (id: string | null) => {
  if (!id) {
    return null;
  }

  const role = await Get<Role>(`/role/${id}`);

  role.permissions = ((role.permissions ?? []) as unknown as Permission[]).map((permission: Permission) => {
    return permission.resource;
  });

  return role;
}

export const saveRole = async (role: RoleFormValues, id?: number) => {
  if (!id) {
    delete role.$add;
    delete role.$clear;
  }

  let savedRole = null;
  if (!id) {
    savedRole = await Post<Role>('/role', role);
  } else {
    savedRole = await Put<Role>(`/role/${id}`, role);
  }

  return savedRole;
}

export const deleteRole = (id: number) => {
  return Delete(`/role/${id}`);
}

export const getResources = async () => {
  const resources = await Get<Resource[]>(`/role/resources`);
  return filterOutEmptyResourceGroups(filterOutWhitelistResources(resources));
}

export const filterOutWhitelistResources = (resources: Resource[]) => {
  return resources.filter(resource => {
    if (resource.whitelist) {
      return false;
    }

    if (resource?.resources?.length) {
      resource.resources = filterOutWhitelistResources(resource.resources);
    }

    return true;
  });
}

export const filterOutEmptyResourceGroups = (resources: Resource[]) => {
  return resources.filter(resource => {
    if (resource.group && !resource?.resources?.length) {
      return false;
    }

    if (resource?.resources?.length) {
      resource.resources = filterOutEmptyResourceGroups(resource.resources);
    }

    return true;
  });
}
