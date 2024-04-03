import { Search } from 'lucide-react';

export interface SearchOptionsProps {
  search: string;
  setSearch: (search: string) => void;
  label?: string;
}

export const SearchOptions = (props: SearchOptionsProps) => {
  const { search, setSearch, label } = props;

  return <>
    {/* <CommandInput
      placeholder='Filter...'
      value={search}
      onValueChange={setSearch}
    /> */}
    <div className='flex items-center border-b px-3'>
      <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
      <input
        className='flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
    {label && <div className='text-xs text-muted-foreground font-medium px-3 py-2 bg-slate-50'>{label}</div>}
  </>;
}
