import { Button } from '@/components/common/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SelectPaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const SelectPagination = (props: SelectPaginationProps) => {
  const { totalPages, currentPage, setPage } = props;
  return totalPages > 1 && <div className='flex justify-center items-center space-x-1 py-2 bg-slate-50'>
    <div className='text-sm font-medium px-2'>
      Page {currentPage}/{totalPages ?? 1}
    </div>
    <Button
      variant='outline'
      size='sm'
      className='py-0 h-8 gap-1 pl-2.5 font-normal select-none'
      disabled={currentPage === 1}
      onClick={() => setPage(currentPage - 1)}
    >
      <ChevronLeft className='h-4 w-4' />
      <span>Previous</span>
    </Button>
    <Button
      variant='outline'
      size='sm'
      className='py-0 h-8 gap-1 pr-2.5 font-normal select-none'
      disabled={currentPage === totalPages}
      onClick={() => setPage(currentPage + 1)}
    >
      <span>Next</span>
      <ChevronRight className='h-4 w-4' />
    </Button>
  </div>
}
