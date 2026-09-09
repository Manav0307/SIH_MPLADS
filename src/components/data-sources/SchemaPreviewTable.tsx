import React from 'react'
import { ColumnDefinition } from '@/types/dataSources'
import { Key, Link } from 'lucide-react'

interface SchemaPreviewTableProps {
  columns: ColumnDefinition[]
  isAvailable: boolean
}

export const SchemaPreviewTable: React.FC<SchemaPreviewTableProps> = ({ columns, isAvailable }) => {
  return (
    <div className="w-full overflow-x-auto border border-[#232D47] rounded-lg bg-[#0D1424] select-none">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="h-7 border-b border-[#232D47] bg-[#0A0E1A]">
            <th className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Column Name
            </th>
            <th className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Type
            </th>
            <th className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap text-center">
              Key
            </th>
            <th className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap text-center">
              Nullable
            </th>
            <th className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Null Rate
            </th>
            <th className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Statutory Description
            </th>
            <th className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5C1] whitespace-nowrap">
              Sample Value
            </th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col, idx) => {
            return (
              <tr
                key={col.name || idx}
                className="border-b border-[#161F36] hover:bg-[#161F36]/50 transition-colors"
              >
                {/* Column Name */}
                <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                  <span className="font-mono text-xs font-semibold text-[#E7EBF5]">
                    {col.name}
                  </span>
                </td>

                {/* Type */}
                <td className="px-2 py-1.5 whitespace-nowrap align-middle">
                  <span className="font-mono text-[11px] text-[#adc6ff] bg-[#161F36] px-1.5 py-0.5 rounded border border-[#232D47]">
                    {col.type}
                  </span>
                </td>

                {/* Key */}
                <td className="px-2 py-1.5 whitespace-nowrap align-middle text-center">
                  {col.isPrimaryKey ? (
                    <span
                      title="Primary Key"
                      className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#adc6ff]"
                    >
                      <Key className="w-2.5 h-2.5" /> PK
                    </span>
                  ) : col.isForeignKey ? (
                    <span
                      title={`Foreign Key -> ${col.foreignTarget || 'Reference'}`}
                      className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B]"
                    >
                      <Link className="w-2.5 h-2.5" /> FK
                    </span>
                  ) : (
                    <span className="text-[#667090] text-xs">—</span>
                  )}
                </td>

                {/* Nullable */}
                <td className="px-2 py-1.5 whitespace-nowrap align-middle text-center">
                  {col.nullable ? (
                    <span className="font-mono text-[10px] text-[#9AA5C1]">YES</span>
                  ) : (
                    <span className="font-mono text-[10px] font-bold text-[#EF4444]">NO</span>
                  )}
                </td>

                {/* Null Rate / Null Indicators */}
                <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                  {isAvailable && col.nullPercentage !== undefined && col.nullPercentage !== null ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#161F36] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            col.nullPercentage === 0
                              ? 'bg-[#22C55E]'
                              : col.nullPercentage < 5
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#EF4444]'
                          }`}
                          style={{ width: `${Math.max(col.nullPercentage, 2)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-[#9AA5C1] tabular-nums">
                        {col.nullPercentage.toFixed(1)}%
                        {col.nullCount ? ` (${col.nullCount})` : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] text-[#667090] italic">
                      — [Awaiting Stream]
                    </span>
                  )}
                </td>

                {/* Description */}
                <td className="px-3 py-1.5 align-middle">
                  <span className="text-xs text-[#9AA5C1] font-sans line-clamp-1 max-w-[280px]">
                    {col.description}
                  </span>
                </td>

                {/* Sample Value */}
                <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                  {col.sampleValue ? (
                    <span className="font-mono text-[11px] text-[#22C55E] bg-[#0F3020] px-1.5 py-0.5 rounded border border-[#22C55E30]">
                      {col.sampleValue}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-[#667090] italic">
                      — [Pending Parse]
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
