import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FieldRendererFn } from '@/lib/types';
import { UseFormReturn, ControllerRenderProps } from 'react-hook-form';
import { DateTimePicker } from '@/components/common/datetime';
import { ForwardedRef, forwardRef } from 'react';
import { BaseFieldRenderer } from './base';

export class FieldRendererDateTime extends BaseFieldRenderer {
  class = 'datetime';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never> & { id?: string },
    ref?: ForwardedRef<any>,
  ) => {
    return <FieldRendererDateTimeRef fieldProps={fieldProps} />;
  }
}

export interface FieldRendererDateTimeRefProps {
  fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>;
  id?: string;
}

export const FieldRendererDateTimeRef = forwardRef(
  function FieldRendererDateTimeRef(props: FieldRendererDateTimeRefProps, ref) {
    const { fieldProps } = props;

    return <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[100%] pl-3 text-left font-normal flex',
            !fieldProps.value && 'text-muted-foreground'
          )}
        >
          <input
            id={props.id}
            className='flex-1 bg-transparent focus:outline-none'
            placeholder='Pick a date'
            onChange={v => {
              fieldProps.onChange(
                v.target.value === '' ? undefined : v
              );
            }}
            value={fieldProps.value ? dayjs(fieldProps.value).format('YYYY-MM-DD HH:mm:ss') : ''}
          />
          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <DateTimePicker
          calendarProps={{ mode: 'single' }}
          selected={fieldProps.value}
          onChange={(v: string) => {
            fieldProps.onChange(v === '' ? undefined : v);
          }}
        />
      </PopoverContent>
    </Popover>;
  }
);
