import { FieldRenderersByTypes, FieldType, Field, Content } from '@/lib/types';
import { FieldRendererInput } from './input';
import { FieldRendererTextarea } from './textarea';
import { FieldRendererSwitch } from './switch';
import { FieldRendererNumber } from './number';
import { FieldRendererColorPicker } from './color';
import { FieldRendererDateTime } from './datetimepicker';
import { FieldRendererEnum } from './enum';
// import { FieldRendererWysiwyg } from './wysiwyg';
import { BaseFieldRenderer } from './base';
import { FieldRendererRelation } from './relation';
import { FieldRendererEditor } from './editor';
import { FieldRendererMedia } from './media';

export const getFieldRenderer = (fieldType: FieldType, field: Field, content?: Content): BaseFieldRenderer => {
  if (window === undefined) {
    return new FieldRendererInput(fieldType, field, content);
  }

  const fieldTypeRenderers = (window.fastschema.ui.fieldRenders[fieldType] ?? []).map(FieldRendererClass => {
    return new FieldRendererClass(fieldType, field, content);
  });
  const matchedRenderer = fieldTypeRenderers?.find(d => d.class === field?.renderer?.class);
  const defaultRenderer = fieldTypeRenderers?.length
    ? fieldTypeRenderers[0]
    : new FieldRendererInput(fieldType, field, content);

  return matchedRenderer ?? defaultRenderer;
}

export const getFieldRenders = (fieldType: FieldType, field: Field): Array<BaseFieldRenderer> => {
  if (window === undefined) {
    return [];
  }

  const fieldTypeRenderers = (window.fastschema.ui.fieldRenders[fieldType] ?? []).map(FieldRendererClass => {
    return new FieldRendererClass(fieldType, field);
  });

  return fieldTypeRenderers ?? [];
}

export const getDefaultFieldRenders = (): FieldRenderersByTypes => {
  const renders: FieldRenderersByTypes = {
    string: [
      FieldRendererInput,
      FieldRendererTextarea,
      FieldRendererColorPicker,
    ],
    bool: [FieldRendererSwitch],
    time: [FieldRendererDateTime],
    json: [FieldRendererTextarea],
    uuid: [FieldRendererInput],
    bytes: [FieldRendererTextarea],
    enum: [FieldRendererEnum],
    text: [
      FieldRendererTextarea,
      FieldRendererEditor,
      // FieldRendererWysiwyg,
    ],
    int: [FieldRendererNumber],
    int8: [FieldRendererNumber],
    int16: [FieldRendererNumber],
    int32: [FieldRendererNumber],
    int64: [FieldRendererNumber],
    uint: [FieldRendererNumber],
    uint8: [FieldRendererNumber],
    uint16: [FieldRendererNumber],
    uint32: [FieldRendererNumber],
    uint64: [FieldRendererNumber],
    float32: [FieldRendererNumber],
    float64: [FieldRendererNumber],
    relation: [FieldRendererRelation],
    media: [FieldRendererMedia],
  };

  return renders;
}
