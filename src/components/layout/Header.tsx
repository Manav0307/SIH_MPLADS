import React from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Bell } from 'lucide-react'
import { GlobalSearch } from '@/components/common/GlobalSearch'

interface HeaderProps {
  currentTitle?: string
}

export const Header: React.FC<HeaderProps> = ({ currentTitle = 'Overview Dashboard' }) => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const caseId = searchParams.get('id') || searchParams.get('caseId')
  const projectId = searchParams.get('project') || searchParams.get('projectId')
  const alertId = searchParams.get('alertId') || (location.pathname === '/alerts' ? searchParams.get('id') : null)

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-[#10182B]/95 backdrop-blur-md border-b border-[#232D47] z-40 flex items-center justify-between px-4 gap-3 select-none">
      {/* Breadcrumb & Live State */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/"
          className="text-[11px] font-semibold uppercase tracking-wider text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors"
        >
          National Audit Command
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#667090]" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-[#E7EBF5]">{currentTitle}</span>

          {location.pathname === '/cases' && caseId && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-[#A855F7] bg-[#1e1a38] px-1.5 py-0.5 rounded border border-[#A855F7]/40 font-bold">
              #{caseId}
            </span>
          )}

          {location.pathname === '/investigation' && projectId && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-[#38BDF8] bg-[#10233F] px-1.5 py-0.5 rounded border border-[#38BDF8]/40 font-bold">
              PRJ: {projectId}
            </span>
          )}

          {location.pathname === '/alerts' && alertId && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-[#EF4444] bg-[#401515] px-1.5 py-0.5 rounded border border-[#EF4444]/40 font-bold">
              ALT: {alertId}
            </span>
          )}

          {location.pathname === '/assistant' && (searchParams.get('id') || searchParams.get('project') || searchParams.get('caseId') || searchParams.get('vendor')) && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-[#38BDF8] bg-[#10233F] px-1.5 py-0.5 rounded border border-[#38BDF8]/40 font-bold">
              CONTEXT: {searchParams.get('id') || searchParams.get('project') || searchParams.get('caseId') || searchParams.get('vendor')}
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0F3020] border border-[#22C55E40] text-[#22C55E] font-mono text-[9px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            LIVE FEED
          </span>
        </div>
      </div>

      {/* Central Global Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <GlobalSearch />
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden xl:flex flex-col items-end">
          <span className="font-mono text-[10px] text-[#22C55E] flex items-center gap-1 leading-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            Updated 8 min ago
          </span>
          <span className="font-mono text-[10px] text-[#9AA5C1] leading-tight">
            25 States • 740+ Constituencies
          </span>
        </div>

        <div className="h-4 w-px bg-[#232D47] hidden xl:block" />

        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#401515] text-[#ffb4ab] border border-[#EF444440] uppercase tracking-wider font-bold">
          RESTRICTED // GOVT AUDIT
        </span>

        <button
          type="button"
          onClick={() => navigate('/alerts')}
          aria-label="View Anomaly Notifications"
          className="relative p-1.5 rounded hover:bg-[#161F36] text-[#9AA5C1] hover:text-[#E7EBF5] transition-colors cursor-pointer"
          title="Jump to Incident Alert Queue"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#401515] text-[#ffdad6] border border-[#EF444460] font-mono text-[9px] flex items-center justify-center font-bold">
            42
          </span>
        </button>

        <div
          onClick={() => navigate('/cases')}
          title="Principal Auditor: Dr. Rajeshwar Rao (Click to open Case Management)"
          className="w-7 h-7 rounded-full bg-[#161F36] border border-[#232D47] hover:border-[#3B82F6] flex items-center justify-center text-[11px] font-mono font-bold text-[#adc6ff] cursor-pointer transition-colors"
        >
          RR
        </div>
      </div>
    </header>
  )
}
