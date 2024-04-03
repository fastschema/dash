import toast from 'react-hot-toast';

export const info = (title: string, message?: string) => {
  toast(title, {
    position: 'top-center',
  });
}

export const success = (title: string, message?: string) => {
  toast.success(title, {
    position: 'top-center',
  });
}

export const error = (title: string, message?: string) => {
  toast.error(title, {
    position: 'top-center',
  });
}

export const warning = (title: string, message?: string) => {
  info(title, message);
}


export const notify = {
  info,
  success,
  error,
  warning,
}