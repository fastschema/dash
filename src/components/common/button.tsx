import { Loader2 } from 'lucide-react';
import { Button as ButtonBase, ButtonProps as BaseButtonProps } from '@/components/ui/button';
import { forwardRef, ReactNode } from 'react';

export type ButtonProps = BaseButtonProps & {
  loading?: boolean;
  icon?: ReactNode;
  children: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, icon, children, ...props }, ref) => {
    const defaultProps = {
      type: 'button',
      size: 'sm',
      ...props,
    } as Omit<ButtonProps, 'children'>;

    if (loading) {
      return <ButtonBase {...defaultProps} ref={ref} disabled={loading}>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        {children}
      </ButtonBase>;
    }

    return (
      <ButtonBase {...defaultProps} ref={ref} disabled={loading}>
        {icon ? (
          <div className='flex items-center gap-1'>
            {icon}
            {children}
          </div>
        ) : children}
      </ButtonBase>
    );
  }
);
Button.displayName = 'Button';
