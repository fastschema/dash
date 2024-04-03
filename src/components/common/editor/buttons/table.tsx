import {
  Columns,
  Dice1,
  LocateFixed,
  Plus,
  Rows,
  Table,
  Trash,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { ToolbarButton } from '../toolbar/button';

export const TableButton = ({ editor }: { editor: Editor }) => {
  return <ToolbarButton
    command='insertTable'
    tooltip='Table'
    label={<Table />}
    buttons={[
      {
        label: <div className='flex items-center gap-2'>
          <Table className='w-5' /><span>Table</span>
        </div>,
        command: 'table',
        buttons: [
          {
            label: <div className='flex items-center gap-2'>
              <Plus className='w-5' /><span>Insert Table</span>
            </div>,
            command: 'insertTable',
            exec: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          },
          {
            label: <div className='flex items-center gap-2'>
              <Trash className='w-5' /><span>Delete Table</span>
            </div>,
            command: 'deleteTable',
            exec: () => editor.chain().focus().deleteTable().run()
          },
          {
            label: <div className='flex items-center gap-2'>
              <LocateFixed className='w-5' /><span>Fix Table</span>
            </div>,
            command: 'fixTable',
            exec: () => editor.chain().focus().fixTables().run()
          }
        ]
      },
      {
        label: <div className='flex items-center gap-2'>
          <Rows className='w-5' /><span>Row</span>
        </div>,
        command: 'row',
        buttons: [
          {
            label: <div className='px-2 py-1'>Toggle Header Row</div>,
            command: 'toggleHeaderRow',
            exec: () => editor.chain().focus().toggleHeaderRow().run()
          },
          {
            label: <div className='px-2'>Add Row Before</div>,
            command: 'addRowBefore',
            exec: () => editor.chain().focus().addRowBefore().run()
          },
          {
            label: <div className='px-2'>Add Row After</div>,
            command: 'addRowAfter',
            exec: () => editor.chain().focus().addRowAfter().run()
          },
          {
            label: <div className='px-2'>Delete Row</div>,
            command: 'deleteRow',
            exec: () => editor.chain().focus().deleteRow().run()
          },
        ]
      },
      {
        label: <div className='flex items-center gap-2'>
          <Columns className='w-5' /><span>Column</span>
        </div>,
        command: 'column',
        buttons: [
          {
            label: <div className='px-2'>Toggle Header Column</div>,
            command: 'toggleHeaderColumn',
            exec: () => editor.chain().focus().toggleHeaderColumn().run()
          },
          {
            label: <div className='px-2'>Add Column Before</div>,
            command: 'addColumnBefore',
            exec: () => editor.chain().focus().addColumnBefore().run()
          },
          {
            label: <div className='px-2'>Add Column After</div>,
            command: 'addColumnAfter',
            exec: () => editor.chain().focus().addColumnAfter().run()
          },
          {
            label: <div className='px-2'>Delete Column</div>,
            command: 'deleteColumn',
            exec: () => editor.chain().focus().deleteColumn().run()
          },
        ]
      },
      {
        label: <div className='flex items-center gap-2'>
          <Dice1 className='w-5' /><span>Cell</span>
        </div>,
        command: 'cell',
        buttons: [
          {
            label: <div className='px-2'>Toggle Header Cell</div>,
            command: 'toggleHeaderCell',
            exec: () => editor.chain().focus().toggleHeaderCell().run()
          },
          {
            label: <div className='px-2'>Merge Cells</div>,
            command: 'mergeCells',
            exec: () => editor.chain().focus().mergeCells().run()
          },
          {
            label: <div className='px-2'>Split Cell</div>,
            command: 'splitCell',
            exec: () => editor.chain().focus().splitCell().run()
          },
          {
            label: <div className='px-2'>Merge or Split</div>,
            command: 'mergeOrSplit',
            exec: () => editor.chain().focus().mergeOrSplit().run()
          }
        ],
      }
    ]}
  />
}
