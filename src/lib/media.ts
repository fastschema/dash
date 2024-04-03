import { Post, Delete } from './request';
import { Media } from './types';

export const uploadFiles = async (files: File[]): Promise<Media[]> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('file', file);
  }

  return await Post<Media[]>('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await Post<{
    success: Media[],
    error: Media[],
  }>('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const deleteFiles = async (ids: number[]) => {
  return await Delete('/media', ids);
}
