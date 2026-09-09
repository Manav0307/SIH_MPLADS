import React from 'react'
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Clock,
  Send,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import { AlertSummaryKpis } from '@/types'
import { cn } from '@/lib/utils'

interface AlertKpiStripProps {
  kpis: AlertSummaryKpis
  activeSeverityFilter: string
  onSelectSeverityFilter: (severity: string) => void
  activeStatusFilter: string
  onSelectStatusFilter: (status: string) => void
}

export const AlertKpiStrip: React.FC<AlertKpiStripProps> = ({
  kpis,
  activeSeverityFilter,
  onSelectSeverityFilter,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  return (
    <div className="space-y-3 select-none">
      {/* 1. Main Stat KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Active Queue */}
        <div
          onClick={() => {
            onSelectStatusFilter('All')
            onSelectSeverityFilter('All')
          }}
          className={cn(
            'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#3B82F6]',
            activeSeverityFilter === 'All' && activeStatusFilter === 'All'
              ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
              : 'border-[#232D47]'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5C1] group-hover:text-[#adc6ff]">
              Active Queue
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]" />
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-[#E7EBF5] font-tabular">
              {kpis.activeCount}
            </span>
            <span className="text-[10px] font-mono text-[#9AA5C1]">
              / {kpis.totalAlerts} total
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9AA5C1]">
            <AlertTriangle className="w-3 h-3 text-[#3B82F6]" />
            <span>Tripartite Engine</span>
          </div>
        </div>

        {/* Critical Alarms */}
        <div
          onClick={() => onSelectSeverityFilter(activeSeverityFilter === 'critical' ? 'All' : 'critical')}
          className={cn(
            'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#EF4444]',
            activeSeverityFilter === 'critical'
              ? 'border-[#EF4444] ring-1 ring-[#EF4444]/50 bg-[#401515]/30'
              : 'border-[#232D47]'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#EF4444]">
              Critical
            </span>
            <AlertOctagon className="w-3.5 h-3.5 text-[#EF4444]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-[#EF4444] font-tabular">
              {kpis.criticalCount}
            </span>
            <span className="text-[10px] font-mono text-[#EF4444]/80">
              Immediate
            </span>
          </div>
          <div className="mt-1 text-[10px] text-[#9AA5C1]">
            Risk Score ≥ 90
          </div>
        </div>

        {/* High Severity */}
        <div
          onClick={() => onSelectSeverityFilter(activeSeverityFilter === 'high' ? 'All' : 'high')}
          className={cn(
            'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#F59E0B]',
            activeSeverityFilter === 'high'
              ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]/50 bg-[#3A2A0C]/30'
              : 'border-[#232D47]'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#F59E0B]">
              High Severity
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-[#F59E0B] font-tabular">
              {kpis.highCount}
            </span>
            <span className="text-[10px] font-mono text-[#F59E0B]/80">
              Priority
            </span>
          </div>
          <div className="mt-1 text-[10px] text-[#9AA5C1]">
            Risk Score 75–89
          </div>
        </div>

        {/* Under Review */}
        <div
          onClick={() => onSelectStatusFilter(activeStatusFilter === 'Under Review' ? 'All' : 'Under Review')}
          className={cn(
            'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#3B82F6]',
            activeStatusFilter === 'Under Review'
              ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/50 bg-[#10233F]/30'
              : 'border-[#232D47]'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#3B82F6]">
              Under Review
            </span>
            <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-[#adc6ff] font-tabular">
              {kpis.underReviewCount}
            </span>
            <span className="text-[10px] font-mono text-[#9AA5C1]">
              Assigned
            </span>
          </div>
          <div className="mt-1 text-[10px] text-[#9AA5C1]">
            Audit cell active
          </div>
        </div>

        {/* Escalated to MoSPI/CAG */}
        <div
          onClick={() => onSelectStatusFilter(activeStatusFilter === 'Escalated' ? 'All' : 'Escalated')}
          className={cn(
            'p-3 rounded-lg bg-[#10182B] border transition-all cursor-pointer group hover:border-[#A855F7]',
            activeStatusFilter === 'Escalated'
              ? 'border-[#A855F7] ring-1 ring-[#A855F7]/50 bg-[#3B174F]/30'
              : 'border-[#232D47]'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C084FC]">
              Escalated
            </span>
            <Send className="w-3.5 h-3.5 text-[#C084FC]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-[#E9D5FF] font-tabular">
              {kpis.escalatedCount}
            </span>
            <span className="text-[10px] font-mono text-[#C084FC]">
              MoSPI Cell
            </span>
          </div>
          <div className="mt-1 text-[10px] text-[#9AA5C1]">
            Statutory summons
          </div>
        </div>

        {/* Exposure At Risk */}
        <div className="p-3 rounded-lg bg-[#10182B] border border-[#232D47] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5C1]">
              Capital At Risk
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#EF4444]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-[#E7EBF5] font-tabular">
              {kpis.totalExposureDisplay}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-[#22C55E] flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>{kpis.resolvedCount} Resolved</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Filter Triage Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[#232D47]/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-[#9AA5C1] uppercase tracking-wider mr-1">
            Severity Triage:
          </span>
          {[
            { id: 'All', label: 'All Severities', count: kpis.totalAlerts },
            { id: 'critical', label: 'Critical', count: kpis.criticalCount, color: 'text-[#EF4444]' },
            { id: 'high', label: 'High', count: kpis.highCount, color: 'text-[#F59E0B]' },
            { id: 'medium', label: 'Medium', count: kpis.mediumCount, color: 'text-[#EAB308]' },
            { id: 'low', label: 'Low', count: kpis.lowCount, color: 'text-[#22C55E]' },
          ].map((item) => {
            const isActive = activeSeverityFilter.toLowerCase() === item.id.toLowerCase()
            return (
              <button
                key={item.id}
                onClick={() => onSelectSeverityFilter(item.id)}
                className={cn(
                  'h-6 px-2.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border cursor-pointer select-none',
                  isActive
                    ? 'bg-[#161F36] border-[#3B82F6] text-[#adc6ff] font-bold shadow-xs'
                    : 'bg-[#10182B] border-[#232D47] text-[#9AA5C1] hover:bg-[#161F36] hover:text-[#E7EBF5]'
                )}
              >
                <span className={item.color || ''}>{item.label}</span>
                <span className="text-[10px] opacity-70 bg-[#0A0E1A] px-1.5 py-0.2 rounded-full font-tabular">
                  {item.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Status Quick Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-[#9AA5C1] uppercase tracking-wider mr-1">
            Workflow:
          </span>
          {[
            { id: 'All', label: 'All', count: kpis.totalAlerts },
            { id: 'New', label: 'New', count: kpis.newCount, color: 'text-[#38BDF8]' },
            { id: 'Under Review', label: 'Under Review', count: kpis.underReviewCount, color: 'text-[#FACC15]' },
            { id: 'Escalated', label: 'Escalated', count: kpis.escalatedCount, color: 'text-[#C084FC]' },
            { id: 'Resolved', label: 'Resolved', count: kpis.resolvedCount, color: 'text-[#4ADE80]' },
          ].map((statusItem) => {
            const isActive = activeStatusFilter === statusItem.id
            return (
              <button
                key={statusItem.id}
                onClick={() => onSelectStatusFilter(statusItem.id)}
                className={cn(
                  'h-6 px-2.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border cursor-pointer select-none',
                  isActive
                    ? 'bg-[#161F36] border-[#3B82F6] text-[#adc6ff] font-bold shadow-xs'
                    : 'bg-[#10182B] border-[#232D47] text-[#9AA5C1] hover:bg-[#161F36] hover:text-[#E7EBF5]'
                )}
              >
                <span className={statusItem.color}>{statusItem.label}</span>
                <span className="text-[10px] opacity-70 bg-[#0A0E1A] px-1.5 py-0.2 rounded-full font-tabular">
                  {statusItem.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
