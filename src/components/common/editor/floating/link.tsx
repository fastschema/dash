import { Editor } from '@tiptap/react';
import { ToolbarButton } from '../toolbar/button';
import { Cable, ChevronDown, ExternalLink, Link2, Link2Off, Pencil, Target, Text } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSelectedLink, LinkInfo, updateSelectedText } from '../common';
import { getFloatingButtons } from './utils';

const defaultLinkInfo = {
  text: '',
  href: '',
  rel: '',
  target: '',
};

export const LinkFloatingToolbar = ({ editor }: { editor: Editor }) => {
  const selectedLink = getSelectedLink(editor);
  const [editing, setEditing] = useState(selectedLink?.href === '' && !!selectedLink?.text);
  const [linkInfo, setLinkInfo] = useState<LinkInfo>(selectedLink ?? defaultLinkInfo);
  const [expanded, setExpanded] = useState(false);

  const imageLink = editor.isActive('image') && editor.isActive('link');
  const range = useMemo(() => {
    const { ranges } = editor.state.selection;
    const from = Math.min(...ranges.map(range => range.$from.pos));
    const to = Math.max(...ranges.map(range => range.$to.pos));

    return [from, to];
  }, [editor.view.state.selection]);

  useEffect(() => {
    const selectedLink = getSelectedLink(editor);
    setLinkInfo(selectedLink ?? defaultLinkInfo);
    setEditing(selectedLink?.href === '' && !!selectedLink?.text);
  }, [range]);

  if (!editing) {
    const floatingButtons = getFloatingButtons(editor, () => setEditing(true));
    return !!floatingButtons.length && floatingButtons.map(({ key, Button }) => (
      <Fragment key={key}>
        {Button}
      </Fragment>
    ));
  }

  return <div className='p-3 flex flex-col gap-3 text-sm'>
    <div className='flex flex-row gap-3 items-center'>
      <Link2 className='text-muted-foreground' />
      <Input
        name='href'
        className='h-9'
        placeholder='URL'
        value={linkInfo.href}
        onChange={e => setLinkInfo({ ...linkInfo, href: e.target.value })}
      />
    </div>

    {!imageLink && <div className='flex flex-row gap-3 items-center'>
      <Text className='text-muted-foreground' />
      <Input
        name='text'
        className='h-9'
        placeholder='Text'
        value={linkInfo.text}
        onChange={e => setLinkInfo({ ...linkInfo, text: e.target.value })}
      />
    </div>}

    <Collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className='w-[350px] space-y-2'
    >
      <div className='flex items-center justify-between space-x-4'>
        <CollapsibleTrigger asChild>
          <button type='button' className='flex items-center gap-1 text-muted-foreground'>
            <span className='font-bold'>More options</span>
            {!expanded ? <ChevronDown className='w-4' /> : <ChevronDown className='w-4 transform rotate-180' />}
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='space-y-2'>
        <div className='flex flex-row gap-3 items-center'>
          <Cable className='text-muted-foreground' />
          <Input
            name='rel'
            className='h-9'
            placeholder='Rel'
            value={linkInfo.rel}
            onChange={e => setLinkInfo({ ...linkInfo, rel: e.target.value })}
          />
        </div>
        <div className='flex flex-row gap-3 items-center'>
          <Target className='text-muted-foreground' />
          <Select
            name='target'
            defaultValue={linkInfo.target}
            onValueChange={value => setLinkInfo({ ...linkInfo, target: value })}>
            <SelectTrigger>
              <SelectValue placeholder='Select a target' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='_blank'>Blank</SelectItem>
              <SelectItem value='_self'>Self</SelectItem>
              <SelectItem value='_parent'>Parent</SelectItem>
              <SelectItem value='_top'>Top</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <Button
      variant='secondary'
      size='sm'
      type='button'
      onClick={() => {
        editor.chain().focus().extendMarkRange('link').setLink(linkInfo).run();
        linkInfo.text && updateSelectedText(editor, linkInfo.text);
        setEditing(false);
      }}
    >Save</Button>
  </div>;
}

export const createFloatingLinkEditButton = (onClick?: () => void) => {
  return <ToolbarButton
    command='linkEdit'
    tooltip='Edit link'
    label={<Pencil />}
    exec={(e, editor) => {
      e.preventDefault();
      onClick?.();
    }}
  />;
};

export const createFloatingLinkOpenButton = (onClick?: () => void) => <ToolbarButton
  command='linkOpen'
  tooltip='Open link in new tab'
  label={<ExternalLink />}
  exec={(e, editor) => {
    e.preventDefault();
    // onClick?.();
    const link = editor?.getAttributes('link').href;
    window.open(link, '_blank');
  }}
/>;

export const createFloatingLinkRemoveButton = (onClick?: () => void) => <ToolbarButton
  command='linkRemove'
  tooltip='Remove link'
  label={<Link2Off />}
  exec={(e, editor) => {
    e.preventDefault();
    // onClick?.();
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
  }}
/>
