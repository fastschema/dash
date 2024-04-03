import { MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ChainedCommands, Editor, useCurrentEditor } from '@tiptap/react';
import { Tooltip } from '@/components/common/tooltip';
import { Separator } from '@/components/ui/separator';

type CommandType = keyof Pick<
  ChainedCommands,
  'toggleBold' |
  'toggleItalic' |
  'toggleUnderline' |
  'toggleStrike' |
  'toggleCode' |
  'toggleCodeBlock' |
  'toggleOrderedList' |
  'toggleBulletList' |
  'toggleTaskList' |
  'toggleBlockquote'
>;
type ExecFn = ((e: MouseEvent<HTMLElement>, editor: Editor | null) => void) | CommandType;
export interface ToolbarButtonProps {
  label: ReactNode;
  command?: string;
  exec?: ExecFn;
  buttons?: ToolbarButtonProps[];
  active?: boolean;
  tooltip?: string;
  separator?: boolean;
}

export type ToolbarButtonSubProps = ToolbarButtonProps & {
  editor: Editor | null;
}

const defaultClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([data-icon])]:size-5 bg-transparent hover:bg-muted hover:text-muted-foreground aria-checked:bg-accent aria-checked:text-accent-foreground h-9 my-1';

const createExecFn = (editor: Editor | null, exec?: ExecFn) => {
  return typeof exec === 'string'
    ? (e: MouseEvent<HTMLElement>) => editor?.chain().focus()[exec]().run()
    : (e: MouseEvent<HTMLElement>) => exec?.(e, editor);
}

export const ToolbarButton = (props: ToolbarButtonProps) => {
  const { command, label, exec, buttons, active, tooltip, separator } = props;
  const { editor } = useCurrentEditor();
  const isActive = (command && editor?.isActive(command)) ?? (active ?? false);
  const activeClassName = isActive ? 'bg-accent' : '';
  const execFn = createExecFn(editor, exec);

  return <>
    <div key={command} className={cn(defaultClasses, activeClassName)}>
      {!buttons?.length ? <Tooltip tip={tooltip}>
        <span role='none' tabIndex={-1} onClick={execFn} className='block px-2 my-1'>{label}</span>
      </Tooltip> : <DropdownMenu modal={false}>
        <Tooltip tip={tooltip}>
          <DropdownMenuTrigger asChild>
            <span role='none' tabIndex={-1} className='flex justify-between px-2 my-1 items-center' onClick={execFn}>
              {label}
              <ChevronDown className='ml-0.5 size-4' data-icon />
            </span>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent
          align='start'
          side='bottom'
          className='flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto'
          sideOffset={12}
        >
          <DropdownMenuGroup>
            {(buttons ?? []).map(item => {
              return !item.buttons?.length
                ? <DropdownMenuItem
                  className='cursor-pointer'
                  key={item.command}
                  onClick={createExecFn(editor, item.exec)}
                >{item?.label}</DropdownMenuItem>
                : <ToolbarButtonSubMenus {...item} key={item.command} editor={editor} />
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>}
    </div>
    {separator && <Separator orientation='vertical' className='h-6' />}
  </>
}


export const ToolbarButtonSubMenus = (props: ToolbarButtonSubProps) => {
  const { label, exec, buttons, editor } = props;
  const execFn = createExecFn(editor, exec);

  return !buttons?.length
    ? <DropdownMenuItem
      className='cursor-pointer'
      onClick={execFn}>
      {label}
    </DropdownMenuItem>
    : <DropdownMenuSub>
      <DropdownMenuSubTrigger onClick={execFn}>{label}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className='p-0'>
        {buttons.map(item => {
          return !item.buttons?.length
            ? <DropdownMenuItem
              className='cursor-pointer'
              key={item.command}
              onClick={createExecFn(editor, item.exec)}
            >{item?.label}</DropdownMenuItem>
            : <ToolbarButtonSubMenus {...item} key={item.command} editor={editor} />
        })}
      </DropdownMenuSubContent>
    </DropdownMenuSub>;
}
