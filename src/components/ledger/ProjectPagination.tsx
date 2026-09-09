import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface ProjectPaginationProps {
  currentPage: number
  pageSize: number
  totalRecords: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
}

export const ProjectPagination: React.FC<ProjectPaginationProps> = ({
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(totalRecords, currentPage * pageSize)

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-3 py-2 bg-[#0D1424] border-t border-[#232D47] text-xs font-mono text-[#9AA5C1] select-none">
      {/* Range readout */}
      <div className="flex items-center gap-2">
        <span>
          Showing <strong className="text-[#E7EBF5] font-tabular">{startItem}–{endItem}</strong> of{' '}
          <strong className="text-[#E7EBF5] font-tabular">{totalRecords.toLocaleString()}</strong> projects
        </span>

        {/* Page size dropdown */}
        <div className="flex items-center gap-1 ml-3 border-l border-[#232D47] pl-3">
          <span className="text-[#667090] text-[11px]">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value))
              onPageChange(1)
            }}
            aria-label="Rows per page"
            className="bg-[#0A0E1A] border border-[#232D47] rounded px-1.5 py-0.5 text-xs text-[#E7EBF5] font-mono focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          title="First Page"
          aria-label="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous page */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs font-mono inline-flex items-center gap-1 transition-colors"
          title="Previous Page"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3 h-3" />
          <span>Prev</span>
        </button>

        {/* Page number buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pg, idx) => {
            if (pg === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-[#667090] font-mono">
                  &hellip;
                </span>
              )
            }
            const isCurrent = currentPage === pg
            return (
              <button
                key={pg}
                type="button"
                onClick={() => onPageChange(Number(pg))}
                className={`min-w-[26px] h-[26px] px-1.5 rounded border text-xs font-mono font-bold cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/60'
                    : 'bg-[#10182B] border-[#232D47] text-[#9AA5C1] hover:bg-[#161F36] hover:text-[#E7EBF5]'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pg}
              </button>
            )
          })}
        </div>

        {/* Next page */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs font-mono inline-flex items-center gap-1 transition-colors"
          title="Next Page"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Last page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1 rounded bg-[#10182B] border border-[#232D47] hover:bg-[#161F36] text-[#E7EBF5] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          title="Last Page"
          aria-label="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
