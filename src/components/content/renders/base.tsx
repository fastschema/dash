import { Content, Field, FieldRendererFn } from '@/lib/types';
import { ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { createFieldsInstances } from '../utils';
import { FormField } from '../form';

export class BaseFieldRenderer {
  fieldType: string;
  field: Field;
  class: string = '';
  content?: Content;
  builtInSettings: Field[] = [{
    type: 'bool',
    name: 'hide_form_label',
    label: 'Hide Label',
    renderer: {
      class: 'switch',
      settings: {
        hide_form_label: true,
        inline_label: 'boxed'
      },
    },
  }];
  settings: Field[] = [];

  constructor(fieldType: string, field: Field, content?: Content) {
    this.fieldType = fieldType;
    this.field = field;
    this.content = content;
  }

  renderSettings<T extends FieldValues = FieldValues>(form: UseFormReturn<T>) {
    const { fieldInstances: settingFieldInstances } = createFieldsInstances<T>([
      ...this.builtInSettings,
      ...this.settings,
    ].map(f => ({
      ...f,
      name: `renderer.settings.${f.name}`,
      optional: true,
    })));

    return <>
      {settingFieldInstances.map(settingFieldInstance => {
        const f = settingFieldInstance.F();
        return <FormField<T>
          key={f.name}
          form={form}
          field={f}
          render={settingFieldInstance.render}
          required={!f.optional}
        />
      })}
    </>
  }

  render: FieldRendererFn = <T extends FieldValues = FieldValues>(
    form: UseFormReturn<T>,
    fieldProps: ControllerRenderProps<T, never>,
  ) => {
    return <div>Field settings not implemented for {this.field.type}</div>;
  }
}
