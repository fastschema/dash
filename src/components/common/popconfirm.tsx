import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/common/button';

export interface PopConfirmProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PopConfirm = (props: Readonly<PopConfirmProps>) => {
  const { title, description, children, onConfirm, onCancel } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            {description && <p className="text-sm text-muted-foreground">
              {description}
            </p>}
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 items-center gap-2">
              <Button className='p-0' size='sm' onClick={onConfirm}>
                Confirm
              </Button>
              <Button className='p-0' size='sm' variant='outline' onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
