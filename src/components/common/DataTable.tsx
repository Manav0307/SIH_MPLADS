import React from 'react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  isMono?: boolean
  render?: (item: T, index: number) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  selectedId?: string
  density?: 'standard' | 'dense'
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  selectedId,
  density = 'standard',
  emptyMessage = 'No records found matching current criteria.',
  className,
}: DataTableProps<T>) {
  const rowHeightClass = density === 'dense' ? 'h-[26px]' : 'h-8'

  return (
    <div className={cn('w-full overflow-x-auto border border-[#232D47] rounded-lg bg-[#10182B]', className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-7 border-b border-[#232D47] bg-[#10182B]">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{ width: col.width }}
                className={cn(
                  'px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] select-none whitespace-nowrap',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center text-xs text-[#667090] font-sans"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => {
              const rowId = keyExtractor(item)
              const isSelected = selectedId === rowId

              return (
                <tr
                  key={rowId}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    'group transition-colors border-b border-[#161F36] hover:bg-[#161F36]',
                    rowHeightClass,
                    isSelected && 'bg-[#161F36]',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={cn(
                        'px-3 text-xs text-[#E7EBF5] whitespace-nowrap align-middle transition-all',
                        colIdx === 0 &&
                          'group-hover:border-l-2 group-hover:border-l-[#3B82F6] pl-[10px]',
                        isSelected && colIdx === 0 && 'border-l-2 border-l-[#3B82F6] pl-[10px]',
                        col.isMono ? 'font-mono font-tabular' : 'font-sans',
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      )}
                    >
                      {col.render
                        ? col.render(item, rowIdx)
                        : (item as Record<string, unknown>)[col.key] !== undefined
                        ? String((item as Record<string, unknown>)[col.key])
                        : null}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
