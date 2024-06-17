import {
  Command,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { ReactNode, useEffect, useState } from 'react';
import { SearchOptions } from './search';
import { isMultiple, searchSchemaContents } from './utils';
import { Content, Field, Pagination, Schema } from '@/lib/types';
import { SelectPagination } from './pagination';
import { CheckIcon } from 'lucide-react';
import { useAppSchema } from '@/lib/context';

export interface RelationContentsBrowserProps {
  field: Field,
  label?: string;
  includes?: Content[];
  excludes?: Content[];
  fetchCondition?: () => boolean;
  onSelect?: (item: Content) => void;
  content?: Content;
}

export const RelationContentsBrowser = (props: RelationContentsBrowserProps) => {
  const {
    field,
    label,
    content,
    includes,
    excludes,
    onSelect,
    fetchCondition,
  } = props;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<Pagination<Content>>();
  const relationSchema = useAppSchema(field.relation?.schema ?? null);
  const multiple = isMultiple(field.relation);

  useEffect(() => {
    if (fetchCondition && !fetchCondition()) return;
    (async () => {
      const result = await searchSchemaContents(field, search, page, relationSchema, content?.id);
      setResult(result);
    })();
  }, [page, search, content?.id]);

  if (!relationSchema) return null;

  const includedIds = includes?.map(item => item.id) ?? [];
  const excludedIds = excludes?.map(item => item.id) ?? [];

  return <>
    <Command className='pb-2'>
      <SearchOptions search={search} setSearch={setSearch} label={label} />
      <CommandList>
        <CommandGroup>
          {!!includes?.length && <>
            {includes.map(option => {
              if (excludedIds.includes(option.id)) return null;
              return <SelectionOption
                key={option.id}
                relationSchema={relationSchema}
                option={option}
                onSelectItem={onSelect}
              />
            })}
            <CommandSeparator className='my-2' />
          </>}
          {result?.items?.map(item => {
            if (includedIds.includes(item.id) || excludedIds.includes(item.id)) return null;
            if (content && !multiple && includes?.length) {
              return null;
            }

            return <SelectionOption
              key={item.id}
              relationSchema={relationSchema}
              option={item}
              onSelectItem={onSelect}
            />;
          })}
        </CommandGroup>
      </CommandList>
    </Command>
    <SelectPagination
      totalPages={result?.last_page ?? 1}
      currentPage={page}
      setPage={setPage}
    />
  </>;
}

export interface SelectionOptionProps {
  relationSchema: Schema;
  option: Content;
  selected?: boolean;
  checkedIcon?: ReactNode;
  onSelectItem?: (item: Content) => void;
}

export const SelectionOption = (props: SelectionOptionProps) => {
  const { relationSchema, option, selected, onSelectItem } = props;
  const checkedIcon = props.checkedIcon ?? <CheckIcon className='h-4 w-4' />;
  return <button
    type='button'
    className='w-full relative cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 flex items-stretch'
    onMouseEnter={(e) => {
      e.currentTarget.setAttribute('aria-selected', 'true');
      e.currentTarget.setAttribute('data-selected', 'true');
    }}
    onMouseLeave={(e) => {
      e.currentTarget.removeAttribute('aria-selected');
      e.currentTarget.removeAttribute('data-selected');
    }}
    onClick={e => {
      onSelectItem?.(option);
    }}
  >
    {option[relationSchema.label_field]}
    <div className='ml-auto'>
      {selected ? checkedIcon : null}
    </div>
  </button>;
}
