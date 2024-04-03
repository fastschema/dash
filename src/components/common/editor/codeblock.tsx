import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CodeBlockLowlight, { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight';
import { Editor, Node, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Attrs } from '@tiptap/pm/model';
import { titleCase } from '@/lib/helper';

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(LanguageSelector);
  }
});

export interface LanguageSelectorProps {
  editor: Editor;
  extension: Node<CodeBlockLowlightOptions>;
  node: Node<CodeBlockLowlightOptions> & Attrs;
  getPos?: () => number;
}

export const LanguageSelector = (props: LanguageSelectorProps) => {
  const { editor, extension, node, getPos } = props;
  const listLanguages: string[] = extension?.options?.lowlight?.listLanguages() ?? [];

  return <NodeViewWrapper className='fs-codeblock relative min-h-[60px]'>
    <div className='absolute top-[10px] right-[10px]' data-not-fs-editor-content>
      <Select value={node.attrs.language ?? 'plaintext'} onValueChange={language => {
        if (typeof getPos === 'function') {
          editor.view.dispatch(editor.view.state.tr.setNodeMarkup(
            getPos(),
            null,
            { language }
          ));
        }
      }}>
        <SelectTrigger className='w px-3 py-1 h-8 gap-2'>
          <SelectValue className='' placeholder='Select a language' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {listLanguages.map(lang => (
              <SelectItem key={lang} value={lang}>
                {titleCase(lang)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <pre>
      <NodeViewContent className='content' />
    </pre>
  </NodeViewWrapper>;
}
