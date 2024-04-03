import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { FastSchemaWindowObject } from '.';

declare global {
  interface Window {
    fastschema: FastSchemaWindowObject;
  }
}

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
}
