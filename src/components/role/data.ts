import { relationSingleZodObject } from '@/lib/types';
import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().trim().min(1, { message: 'Role name is required' }),
  description: z.string().optional(),
  root: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
  $add: z.record(z.string(), z.array(relationSingleZodObject)).optional(),
  $clear: z.record(z.string(), z.array(relationSingleZodObject)).optional(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

export const defaultRoleFormValues: RoleFormValues = {
  name: '',
  description: '',
  root: false,
  permissions: [],
  $add: {},
  $clear: {},
};
