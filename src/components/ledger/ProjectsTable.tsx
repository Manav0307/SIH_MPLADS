import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, SearchX } from 'lucide-react'
import { ProjectRecord, ProjectSortField } from '@/types'
import { ProjectTableRow } from './ProjectTableRow'
import { ProjectsTableSkeleton } from './ProjectsTableSkeleton'

interface ProjectsTableProps {
  projects: ProjectRecord[]
  selectedProjectId?: string
  sortField: ProjectSortField
  sortDirection: 'asc' | 'desc'
  density: 'standard' | 'dense'
  isLoading?: boolean
  onSelectProject: (project: ProjectRecord) => void
  onInvestigate: (project: ProjectRecord) => void
  onSort: (field: ProjectSortField) => void
  onClearFilters: () => void
  activeFiltersSummary?: string
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  selectedProjectId,
  sortField,
  sortDirection,
  density,
  isLoading = false,
  onSelectProject,
  onInvestigate,
  onSort,
  onClearFilters,
  activeFiltersSummary,
}) => {
  const renderSortIndicator = (field: ProjectSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-2.5 h-2.5 opacity-40 ml-1 inline-block shrink-0" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-2.5 h-2.5 text-[#3B82F6] ml-1 inline-block shrink-0" />
    ) : (
      <ArrowDown className="w-2.5 h-2.5 text-[#3B82F6] ml-1 inline-block shrink-0" />
    )
  }

  return (
    <div className="w-full overflow-x-auto border border-[#232D47] rounded-lg bg-[#10182B] select-none shadow-sm">
      <table className="w-full border-collapse text-left font-sans text-xs">
        {/* Table Header (19 Columns) */}
        <thead>
          <tr className="h-8 border-b border-[#232D47] bg-[#0D1424] text-[#9AA5C1] font-mono text-[10px] font-bold uppercase tracking-wider">
            {/* 1. Risk */}
            <th className="px-2.5 py-2 whitespace-nowrap">Risk</th>

            {/* 2. Risk Score (Sortable) */}
            <th
              onClick={() => onSort('riskScore')}
              className="px-2 py-2 text-center cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap transition-colors"
              title="Sort by Risk Score"
            >
              <div className="flex items-center justify-center">
                <span>Score</span>
                {renderSortIndicator('riskScore')}
              </div>
            </th>

            {/* 3. Work ID */}
            <th className="px-2 py-2 whitespace-nowrap">Work ID</th>

            {/* 4. Project / Work */}
            <th className="px-3 py-2 min-w-[220px]">Project / Work Description</th>

            {/* 5. State */}
            <th className="px-2 py-2 whitespace-nowrap">State</th>

            {/* 6. District */}
            <th className="px-2 py-2 whitespace-nowrap">District</th>

            {/* 7. Constituency */}
            <th className="px-2 py-2 whitespace-nowrap">Constituency</th>

            {/* 8. MP */}
            <th className="px-2 py-2 whitespace-nowrap">Recommending MP</th>

            {/* 9. Category */}
            <th className="px-2 py-2 whitespace-nowrap">Category</th>

            {/* 10. Vendor */}
            <th className="px-2 py-2 whitespace-nowrap">Contracted Vendor</th>

            {/* 11. Implementing Agency */}
            <th className="px-2 py-2 whitespace-nowrap">Implementing Agency</th>

            {/* 12. Recommended (Sortable) */}
            <th
              onClick={() => onSort('recommendedDate')}
              className="px-2 py-2 cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap transition-colors"
              title="Sort by Recommended Date"
            >
              <div className="flex items-center">
                <span>Recommended</span>
                {renderSortIndicator('recommendedDate')}
              </div>
            </th>

            {/* 13. Sanctioned (Sortable) */}
            <th
              onClick={() => onSort('sanctionedAmount')}
              className="px-2.5 py-2 text-right cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap transition-colors"
              title="Sort by Sanctioned Amount"
            >
              <div className="flex items-center justify-end">
                <span>Sanctioned</span>
                {renderSortIndicator('sanctionedAmount')}
              </div>
            </th>

            {/* 14. Disbursed (Sortable) */}
            <th
              onClick={() => onSort('disbursedAmount')}
              className="px-2.5 py-2 text-right cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap transition-colors"
              title="Sort by Disbursed Amount"
            >
              <div className="flex items-center justify-end">
                <span>Disbursed</span>
                {renderSortIndicator('disbursedAmount')}
              </div>
            </th>

            {/* 15. Spent (Sortable) */}
            <th
              onClick={() => onSort('spentAmount')}
              className="px-2.5 py-2 text-right cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap transition-colors"
              title="Sort by Spent Amount"
            >
              <div className="flex items-center justify-end">
                <span>Spent</span>
                {renderSortIndicator('spentAmount')}
              </div>
            </th>

            {/* 16. Status */}
            <th className="px-2 py-2 whitespace-nowrap">Status</th>

            {/* 17. Delay (Sortable) */}
            <th
              onClick={() => onSort('agingDays')}
              className="px-2 py-2 text-center cursor-pointer hover:text-[#E7EBF5] whitespace-nowrap transition-colors"
              title="Sort by Milestone Delay"
            >
              <div className="flex items-center justify-center">
                <span>Delay</span>
                {renderSortIndicator('agingDays')}
              </div>
            </th>

            {/* 18. Primary Anomaly */}
            <th className="px-2.5 py-2 min-w-[180px]">Primary Anomaly Trigger</th>

            {/* 19. Action */}
            <th className="px-2 py-2 text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#161F36]">
          {isLoading ? (
            <tr>
              <td colSpan={19} className="p-0">
                <ProjectsTableSkeleton rowCount={10} density={density} />
              </td>
            </tr>
          ) : projects.length === 0 ? (
            <tr>
              <td colSpan={19} className="py-12 px-4 text-center">
                <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#9AA5C1]">
                    <SearchX className="w-5 h-5 text-[#EF4444]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#E7EBF5]">
                      No projects match the current investigation criteria.
                    </h3>
                    {activeFiltersSummary && (
                      <p className="text-xs text-[#9AA5C1] mt-1 font-mono">
                        Active criteria: {activeFiltersSummary}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="px-3 py-1.5 rounded bg-[#161F36] hover:bg-[#232D47] text-[#3B82F6] border border-[#232D47] text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    Clear Filters &amp; Show All
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <ProjectTableRow
                key={project.id}
                project={project}
                isSelected={selectedProjectId === project.id}
                density={density}
                onSelectProject={onSelectProject}
                onInvestigate={onInvestigate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
