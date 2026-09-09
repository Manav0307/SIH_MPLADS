import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Activity,
  Search,
  FolderKanban,
  Users,
  Store,
  Building2,
  MapPin,
  AlertTriangle,
  Database,
  Cpu,
  FileText,
  Settings,
  Shield,
  ShieldAlert,
  Briefcase,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavEntry {
  path: string
  label: string
  icon: React.ReactNode
  badge?: {
    text: string
    variant: 'live' | 'alert' | 'count'
  }
}

const coreNav: NavEntry[] = [
  { path: '/', label: 'Overview', icon: <Activity className="w-4 h-4" />, badge: { text: 'LIVE', variant: 'live' } },
  { path: '/assistant', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4" />, badge: { text: 'AI', variant: 'live' } },
  { path: '/cases', label: 'Case Management', icon: <Briefcase className="w-4 h-4" />, badge: { text: '24', variant: 'alert' } },
  { path: '/investigation', label: 'Investigation', icon: <Search className="w-4 h-4" /> },
  { path: '/anomalies', label: 'Anomaly Engine', icon: <ShieldAlert className="w-4 h-4" />, badge: { text: 'ENGINE', variant: 'live' } },
  { path: '/projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
  { path: '/mps', label: 'MPs & Constituencies', icon: <Users className="w-4 h-4" /> },
  { path: '/vendors', label: 'Vendors', icon: <Store className="w-4 h-4" /> },
  { path: '/agencies', label: 'Implementing Agencies', icon: <Building2 className="w-4 h-4" /> },
  { path: '/geospatial', label: 'Geospatial Intelligence', icon: <MapPin className="w-4 h-4" /> },
  { path: '/alerts', label: 'Anomaly Alerts', icon: <AlertTriangle className="w-4 h-4" />, badge: { text: '42', variant: 'alert' } },
]

const opsNav: NavEntry[] = [
  { path: '/data-sources', label: 'Data Sources', icon: <Database className="w-4 h-4" />, badge: { text: '●', variant: 'live' } },
  { path: '/model-monitoring', label: 'Model Monitoring', icon: <Cpu className="w-4 h-4" />, badge: { text: 'ML', variant: 'live' } },
  { path: '/audit-reports', label: 'Audit Reports', icon: <FileText className="w-4 h-4" /> },
  { path: '/settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
]

export const Sidebar: React.FC = () => {
  const renderNavGroup = (items: NavEntry[]) => (
    <nav className="space-y-0.5">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            cn(
              'group flex items-center justify-between px-3 h-7 rounded text-xs transition-colors select-none',
              isActive
                ? 'bg-[#161F36] text-[#adc6ff] border-l-2 border-[#3B82F6] font-semibold pl-2.5'
                : 'text-[#9AA5C1] hover:bg-[#161F36] hover:text-[#E7EBF5]'
            )
          }
        >
          <div className="flex items-center gap-2 truncate">
            <span className="shrink-0 text-[#9AA5C1] group-hover:text-[#E7EBF5] transition-colors">
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </div>

          {item.badge && (
            <span
              className={cn(
                'font-mono text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 leading-none',
                item.badge.variant === 'live' && 'text-[#22C55E] bg-[#0F3020] border border-[#22C55E40]',
                item.badge.variant === 'alert' && 'text-[#EF4444] bg-[#401515] border border-[#EF444460]',
                item.badge.variant === 'count' && 'text-[#9AA5C1] bg-[#161F36] border border-[#232D47]'
              )}
            >
              {item.badge.text}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#10182B] border-r border-[#232D47] z-50 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Brand Banner */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-14 px-3.5 flex items-center justify-between border-b border-[#232D47] bg-[#0A0E1A]/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-[#E7EBF5] tracking-tight leading-tight">
                MPLADS INTEL
              </span>
              <span className="font-mono text-[9px] text-[#9AA5C1] tracking-wider uppercase">
                Sovereign Audit
              </span>
            </div>
          </div>
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#161F36] text-[#adc6ff] border border-[#232D47] shrink-0">
            SOC v2.4
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="overflow-y-auto flex-1 px-2.5 py-3 space-y-4">
          <div>
            <div className="px-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#667090]">
                Core Oversight
              </span>
            </div>
            {renderNavGroup(coreNav)}
          </div>

          <div className="h-px bg-[#232D47] my-2" />

          <div>
            <div className="px-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#667090]">
                Statutory Operations
              </span>
            </div>
            {renderNavGroup(opsNav)}
          </div>
        </div>
      </div>

      {/* Profile Footer */}
      <div className="p-3 bg-[#0D1424] border-t border-[#232D47] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-xs font-mono font-bold text-[#adc6ff]">
              RR
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22C55E] ring-2 ring-[#10182B]" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-[#E7EBF5] truncate leading-tight">
              Dr. Rajeshwar Rao, IA&AS
            </span>
            <span className="font-mono text-[9px] text-[#9AA5C1] truncate leading-none mt-0.5">
              Principal Auditor General
            </span>
            <span className="font-mono text-[9px] text-[#3B82F6] truncate leading-none mt-0.5">
              MoSPI / CAG Oversight
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
