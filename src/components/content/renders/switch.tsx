import { Field, FieldRendererFn } from '@/lib/types';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormControl, FormLabel } from '@/components/ui/form';
import { BaseFieldRenderer } from './base';

export class FieldRendererSwitch extends BaseFieldRenderer {
  class = 'switch';
  settings: Field[] = [
    {
      type: 'enum',
      name: 'inline_label',
      label: 'Inline Label',
      enums: [
        { label: 'None', value: 'none' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
        { label: 'Boxed', value: 'boxed' },
      ],
    }
  ];
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>,
  ) => {
    if (this.field?.renderer?.settings?.inline_label === 'left') {
      return <div className='flex items-center space-x-2'>
        <Label htmlFor={this.field.name}>{this.field.label}</Label>
        <Switch
          id={this.field.name}
          name={this.field.name}
          checked={fieldProps.value}
          onCheckedChange={fieldProps.onChange}
        />
      </div>;
    }

    if (this.field?.renderer?.settings?.inline_label === 'right') {
      return <div className='flex items-center space-x-2'>
        <Switch
          id={this.field.name}
          name={this.field.name}
          checked={fieldProps.value}
          onCheckedChange={fieldProps.onChange}
        />
        <Label htmlFor={this.field.name}>{this.field.label}</Label>
      </div>;
    }

    if (this.field?.renderer?.settings?.inline_label === 'boxed') {
      return <div className='flex flex-row items-center justify-between rounded-lg border px-3 shadow-sm'>
        {/* <div className='space-y-0.5'> */}
        <FormLabel htmlFor={this.field.name} className='flex-1 cursor-pointer py-4'>{this.field.label}</FormLabel>
        {/* <FormDescription>
          {field.description}
        </FormDescription> */}
        {/* </div> */}
        <FormControl>
          <Switch
            id={this.field.name}
            name={this.field.name}
            checked={fieldProps.value}
            onCheckedChange={fieldProps.onChange}
          />
        </FormControl>
      </div>;
    }

    return <Switch
      {...fieldProps}
      name={this.field.name}
      checked={fieldProps.value}
      onCheckedChange={fieldProps.onChange}
    />
  }
}
