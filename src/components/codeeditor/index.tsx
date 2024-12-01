import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  height?: string;
}

export const CodeEditor = (props: CodeEditorProps) => {
  const { value, onChange, className, placeholder, height } = props;

  const onValueChange = useCallback(
    (val: string, viewUpdate: ViewUpdate) => {
      onChange?.(val);
    },
    [onChange]
  );

  return (
    <CodeMirror
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      value={value}
      height={height ?? '350px'}
      width='100%'
      placeholder={placeholder}
      extensions={[javascript()]}
      onChange={onValueChange}
    />
  );
};
