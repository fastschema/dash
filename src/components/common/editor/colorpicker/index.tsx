'use client'

import { ReactNode, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paintbrush } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultGradients, getDefaultColorPalette } from './colors';
import { Button } from '@/components/common/button';


export interface GradientPickerProps {
  icon?: ReactNode;
  solidColors?: string[];
  gradientColors?: string[];
  onColorChange?: (color: string | null) => void;
  getCurrentColorFn?: () => string;
}

export const ColorPicker = (props: GradientPickerProps) => {
  const { icon, onColorChange } = props;

  const currentColor = props.getCurrentColorFn?.() ?? '';
  const solidColors = props?.solidColors ?? getDefaultColorPalette();
  const gradientColors = props.gradientColors ?? defaultGradients;

  const defaultTab = useMemo(() => {
    if (currentColor.includes('url')) return 'image'
    if (currentColor.includes('gradient')) return 'gradient'
    return 'solid'
  }, [currentColor])

  return (
    <Popover>
      <PopoverTrigger asChild>
        {icon ?? <Paintbrush className='h-4 w-4' />}
      </PopoverTrigger>
      <PopoverContent className='w-60' align='end' sideOffset={12}>
        <Tabs defaultValue={defaultTab} className='w-full'>
          <TabsList className='w-full mb-4'>
            <TabsTrigger className='flex-1' value='solid'>
              Solid
            </TabsTrigger>
            <TabsTrigger className='flex-1' value='gradient'>
              Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value='solid'>
            <ScrollArea className='h-48 w-full pr-[10px]'>
              <div className='flex flex-wrap gap-1 mt-0'>
                {solidColors.map((s) => (
                  <div
                    key={s}
                    role='none'
                    tabIndex={-1}
                    style={{ background: s }}
                    className='rounded-md h-6 w-6 cursor-pointer active:scale-105'
                    onClick={() => onColorChange?.(s)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value='gradient' className='mt-0'>
            <div className='flex flex-wrap gap-1 mb-2'>
              {gradientColors.map((s) => (
                <div
                  key={s}
                  role='none'
                  tabIndex={-1}
                  style={{ background: s }}
                  className='rounded-md h-6 w-6 cursor-pointer active:scale-105'
                  onClick={() => onColorChange?.(s)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Input
          id='custom'
          value={currentColor}
          className='col-span-2 h-8 mt-4'
          placeholder='Custom color'
          onChange={(e) => onColorChange?.(e.currentTarget.value)}
        />
        <Button
          type='button'
          size='sm'
          variant='secondary'
          className='mt-2 w-full'
          onClick={() => onColorChange?.(null)}>
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  )
}
