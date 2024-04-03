'use client';

export interface EventBusEvent<T> extends Event {
  detail?: T;
}

const eventBus = {
  on<T>(event: string, callback: (detail?: T) => void) {
    if (typeof document !== 'undefined') {
      document.addEventListener(event, (e: EventBusEvent<T>) => callback(e?.detail));
    }
  },
  dispatch<T>(event: string, data: T) {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
  },
  remove(event: string, callback: (detail?: any) => void) {
    if (typeof document !== 'undefined') {
      document.removeEventListener(event, callback);
    }
  },
};

export default eventBus;

export const setSystemError = (systemError: { error: string, message: string }) => {
  eventBus.dispatch('system-error', systemError);
}

export const setNetworkError = (msg: string) => {
  eventBus.dispatch('network-error', msg);
}
