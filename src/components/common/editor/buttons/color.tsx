import { Baseline, PaintBucket } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { ToolbarButton } from '../toolbar/button';
import { ColorPicker } from '../colorpicker';

export const ColorButton = ({ editor }: { editor: Editor }) => {
  return <ToolbarButton command='color'
    exec={e => e.preventDefault()}
    tooltip='Text color'
    label={<ColorPicker
      icon={<Baseline />}
      onColorChange={(color: string | null) => {
        color !== null
          ? editor?.chain().focus().setColor(color).run()
          : editor?.chain().focus().unsetColor().run();
      }}
    />}
  />;
}

export const BgColorButton = ({ editor }: { editor: Editor }) => {
  return <ToolbarButton command='bgcolor'
    exec={e => e.preventDefault()}
    tooltip='Background color'
    label={<ColorPicker
      icon={<PaintBucket />}
      onColorChange={(color: string | null) => {
        color !== null
          ? editor?.chain().focus().setBgColor(color).run()
          : editor?.chain().focus().unsetBgColor().run();
      }}
    />}
  />;
}
