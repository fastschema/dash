import {
  Tooltip as BaseTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { ReactNode } from 'react';

export interface TooltipProps {
  children: ReactNode;
  tip: ReactNode;
  icon?: ReactNode;
}

export const Tooltip = (props: TooltipProps) => {
  const { children, tip, icon } = props;
  if (!tip) return <>{children}</>;

  return <BaseTooltip>
    <TooltipTrigger type='button'>
      <div className='flex items-center gap-1'>
        {children}
        {icon && <HelpCircle size={14} />}
      </div>
    </TooltipTrigger>
    <TooltipContent sideOffset={10}>
      {tip}
    </TooltipContent>
  </BaseTooltip>
}
