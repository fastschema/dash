import { CommandItem } from '@/components/ui/command';
import { Content, Schema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

export interface SelectOptionProps {
  option: Content;
  selectedOptions: Content[];
  setSelectedOptions: (options: Content[]) => void;
  relationSchema: Schema;
  isMultiple?: boolean;
  data: Content[];
}

export const SelectOption = (props: SelectOptionProps) => {
  const { option, selectedOptions, setSelectedOptions, relationSchema, isMultiple, data } = props;
  return <CommandItem
    key={option.id}
    value={String(option.id)}
    onSelect={(value) => {
      const matchedOption = data.find(option => String(option.id) === value);
      if (matchedOption) {
        isMultiple
          ? setSelectedOptions([...selectedOptions, matchedOption])
          : setSelectedOptions([matchedOption]);
      }
    }}
  >
    {option[relationSchema.label_field]}
    <CheckIcon
      className={cn(
        'ml-auto h-4 w-4',
        selectedOptions.find(selectedOption => selectedOption.id === option.id)
          ? 'opacity-100'
          : 'opacity-0'
      )}
    />
  </CommandItem>;
}
