import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FieldRendererFn } from '@/lib/types';
import { forwardRef, useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { UseFormReturn, ControllerRenderProps } from 'react-hook-form';
import { BaseFieldRenderer } from './base';

const decimalToHex = (alpha: number) => {
  let aHex = Math.round(255 * alpha).toString(16);
  if (alpha === 0) {
    return '00';
  }

  return aHex.length < 2 ? `0${aHex}` : aHex;
}

export class FieldRendererColorPicker extends BaseFieldRenderer {
  class = 'color_picker';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>,
  ) => {
    return <FieldRendererColorPickerRef fieldProps={fieldProps} />;
  }
}

export interface FieldRendererColorPickerRefProps {
  fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>;
  id?: string;
}

const defaultColor = '#FFFFFF';
export const FieldRendererColorPickerRef = forwardRef(
  function FieldRendererColorPickerRef(props: FieldRendererColorPickerRefProps, ref) {
    const { fieldProps } = props;
    fieldProps.value = fieldProps.value ?? defaultColor;
    const [selectedColor, setSelectedColor] = useState<string>(fieldProps.value);

    useEffect(() => {
      fieldProps.onChange(selectedColor);
    }, [selectedColor]);

    return <div className='flex gap-2'>
      <Input
        id={props.id}
        value={selectedColor}
        onChange={(e) => {
          setSelectedColor(e.target.value);
        }}
      />

      <Popover>
        <PopoverTrigger asChild>
          <div className={'w-[40px] h-[40px] rounded cursor-pointer color-picker-trigger'} style={{ backgroundColor: selectedColor }} />
        </PopoverTrigger>
        <PopoverContent className='p-0 w-[230px]'>
          <ChromePicker
            className='color-picker-chrome'
            color={selectedColor}
            onChange={color => {
              const hexCode = `${color.hex}${decimalToHex(color.rgb.a ?? 1)}`
              setSelectedColor(hexCode);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>;
  }
);
