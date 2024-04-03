import { File as FileIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface MediaPreviewerProps {
  file?: File;
}

export const MediaPreviewer = (props: MediaPreviewerProps) => {
  const { file } = props;
  const [previewUrl, setPreviewUrl] = useState<string>();

  const fileIcon = <FileIcon className='w-[40px] text-slate-500' width={40} height={40} />;

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  if (!file || !file.type.startsWith('image/')) {
    return fileIcon;
  }

  return previewUrl
    ? <img className='h-auto rounded-lg' src={previewUrl} alt='' />
    : fileIcon;
}
