import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  FolderKanban,
  AlertTriangle,
  AlertOctagon,
  FileText,
  Store,
  Building2,
  UserCheck,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { getAllCases } from '@/lib/caseRegistry'
import { mockProjects } from '@/data/projects'
import { mockVendors } from '@/data/vendors'
import { mockAgencies } from '@/data/agencies'
import { mockMps } from '@/data/mps'
import { mockAlerts } from '@/data/alerts'
import { getDefaultEngineResult } from '@/lib/anomalyEngine'
import { cn } from '@/lib/utils'

export interface GlobalSearchResult {
  id: string
  title: string
  subtitle: string
  category: 'case' | 'alert' | 'anomaly' | 'project' | 'vendor' | 'agency' | 'mp' | 'model'
  targetUrl: string
  badgeText?: string
  badgeColor?: string
}

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Aggregate and query mock data
  const results = useMemo<GlobalSearchResult[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const items: GlobalSearchResult[] = []
    const cases = getAllCases()
    const engineFindings = getDefaultEngineResult().findings

    // 1. Search Cases
    cases.forEach((c) => {
      if (
        c.id.toLowerCase().includes(q) ||
        c.workCode.toLowerCase().includes(q) ||
        c.projectTitle.toLowerCase().includes(q) ||
        c.vendor.toLowerCase().includes(q) ||
        c.agency.toLowerCase().includes(q)
      ) {
        items.push({
          id: c.id,
          title: `${c.id} • ${c.projectTitle}`,
          subtitle: `Case Status: ${c.status} • Vendor: ${c.vendor} • ${c.state}`,
          category: 'case',
          targetUrl: `/cases?id=${encodeURIComponent(c.id)}`,
          badgeText: c.status.toUpperCase(),
          badgeColor:
            c.status === 'Resolved'
              ? 'text-[#22C55E] bg-[#0F3020] border-[#22C55E]/40'
              : c.status === 'Escalated'
              ? 'text-[#EF4444] bg-[#401515] border-[#EF4444]/40'
              : 'text-[#3B82F6] bg-[#10233F] border-[#3B82F6]/40',
        })
      }
    })

    // 2. Search Alerts
    mockAlerts.forEach((a) => {
      if (
        a.id.toLowerCase().includes(q) ||
        a.workCode.toLowerCase().includes(q) ||
        a.projectTitle.toLowerCase().includes(q) ||
        a.anomalyType.toLowerCase().includes(q) ||
        a.vendor.toLowerCase().includes(q)
      ) {
        items.push({
          id: a.id,
          title: `${a.id} • ${a.anomalyType}`,
          subtitle: `${a.workCode} • ${a.projectTitle} (${a.financialImpact})`,
          category: 'alert',
          targetUrl: `/alerts?id=${encodeURIComponent(a.id)}`,
          badgeText: a.severity.toUpperCase(),
          badgeColor:
            a.severity === 'critical'
              ? 'text-[#EF4444] bg-[#401515] border-[#EF4444]/40'
              : 'text-[#F59E0B] bg-[#3A2A0C] border-[#F59E0B]/40',
        })
      }
    })

    // 3. Search Anomalies
    engineFindings.forEach((f) => {
      if (
        f.anomalyId.toLowerCase().includes(q) ||
        f.ruleName.toLowerCase().includes(q) ||
        f.workCode.toLowerCase().includes(q) ||
        f.projectTitle.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      ) {
        items.push({
          id: f.anomalyId,
          title: `${f.anomalyId} • ${f.ruleName}`,
          subtitle: `${f.workCode} • ${f.affectedEntity.name} • ${f.financialImpactDisplay}`,
          category: 'anomaly',
          targetUrl: `/anomalies?search=${encodeURIComponent(f.anomalyId)}`,
          badgeText: `${f.confidence}% CONF`,
          badgeColor: 'text-[#22C55E] bg-[#0F3020] border-[#22C55E]/40',
        })
      }
    })

    // 4. Search Projects
    mockProjects.forEach((p) => {
      if (
        p.workCode.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.agency.toLowerCase().includes(q) ||
        p.mpName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
      ) {
        items.push({
          id: p.id,
          title: `${p.workCode} • ${p.title}`,
          subtitle: `${p.district}, ${p.state} • ${p.disbursedDisplay} • MP: ${p.mpName}`,
          category: 'project',
          targetUrl: `/projects?id=${encodeURIComponent(p.id)}`,
          badgeText: `SCORE ${p.riskScore}`,
          badgeColor:
            p.riskLevel === 'critical'
              ? 'text-[#EF4444] bg-[#401515] border-[#EF4444]/40'
              : p.riskLevel === 'high'
              ? 'text-[#F59E0B] bg-[#3A2A0C] border-[#F59E0B]/40'
              : 'text-[#3B82F6] bg-[#10233F] border-[#3B82F6]/40',
        })
      }
    })

    // 5. Search Vendors
    mockVendors.forEach((v) => {
      if (
        v.id.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.gstin.toLowerCase().includes(q) ||
        (v.registeredState && v.registeredState.toLowerCase().includes(q))
      ) {
        items.push({
          id: v.id,
          title: v.name,
          subtitle: `GST: ${v.gstin} • ${v.activeWorks} Works • ${v.totalDisbursed}`,
          category: 'vendor',
          targetUrl: `/vendors/${encodeURIComponent(v.id)}`,
          badgeText: `${v.riskScore}/100 RISK`,
          badgeColor:
            v.riskLevel === 'critical'
              ? 'text-[#EF4444] bg-[#401515] border-[#EF4444]/40'
              : 'text-[#F59E0B] bg-[#3A2A0C] border-[#F59E0B]/40',
        })
      }
    })

    // 6. Search Agencies
    mockAgencies.forEach((ag) => {
      const stateStr = ag.statePresence ? ag.statePresence.join(', ') : ''
      if (
        ag.id.toLowerCase().includes(q) ||
        ag.name.toLowerCase().includes(q) ||
        ag.agencyType.toLowerCase().includes(q) ||
        stateStr.toLowerCase().includes(q)
      ) {
        items.push({
          id: ag.id,
          title: ag.name,
          subtitle: `${ag.agencyType} • ${ag.statePresence?.[0] || 'National'} • ${ag.activeWorks} Works`,
          category: 'agency',
          targetUrl: `/agencies/${encodeURIComponent(ag.id)}`,
          badgeText: `SCORE ${ag.riskScore}`,
          badgeColor: 'text-[#38BDF8] bg-[#10233F] border-[#38BDF8]/40',
        })
      }
    })

    // 7. Search MPs
    mockMps.forEach((m) => {
      if (
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.constituency.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q)
      ) {
        items.push({
          id: m.id,
          title: `${m.name} (${m.house})`,
          subtitle: `${m.constituency}, ${m.state} • ${m.projectsCount} Works • ${m.disbursedDisplay}`,
          category: 'mp',
          targetUrl: `/mps/${encodeURIComponent(m.id)}`,
          badgeText: m.party,
          badgeColor: 'text-[#4ADE80] bg-[#0F3020] border-[#4ADE80]/40',
        })
      }
    })

    // 8. Model Monitoring (static navigation target)
    const modelKeywords = ['model', 'ml', 'monitoring', 'drift', 'governance', 'anomalynet', 'roc', 'precision', 'recall', 'fairness', 'explainability', 'shap', 'feature importance']
    if (modelKeywords.some((kw) => kw.includes(q) || q.includes(kw))) {
      items.push({
        id: 'model-monitoring',
        title: 'MPLADS-AnomalyNet · Model Monitoring',
        subtitle: 'ML Governance Dashboard · IsolationForest + LightGBM · Drift, Performance, Fairness',
        category: 'model',
        targetUrl: '/model-monitoring',
        badgeText: 'ML DEMO',
        badgeColor: 'text-[#adc6ff] bg-[#10233F] border-[#adc6ff]/40',
      })
    }

    // Deduplicate by targetUrl & cap to 25 results
    const seen = new Set<string>()
    return items.filter((item) => {
      if (seen.has(item.targetUrl)) return false
      seen.add(item.targetUrl)
      return true
    }).slice(0, 25)
  }, [query])

  // Handle item selection
  const handleSelectResult = (result: GlobalSearchResult) => {
    setIsOpen(false)
    setQuery('')
    navigate(result.targetUrl)
  }

  // Keyboard navigation within dropdown
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const getCategoryIcon = (category: GlobalSearchResult['category']) => {
    switch (category) {
      case 'case':
        return <FolderKanban className="w-3.5 h-3.5 text-[#A855F7]" />
      case 'alert':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
      case 'anomaly':
        return <AlertOctagon className="w-3.5 h-3.5 text-[#EF4444]" />
      case 'project':
        return <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
      case 'vendor':
        return <Store className="w-3.5 h-3.5 text-[#EAB308]" />
      case 'agency':
        return <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
      case 'mp':
        return <UserCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
      case 'model':
        return <Sparkles className="w-3.5 h-3.5 text-[#adc6ff]" />
    }
  }

  return (
    <div className="relative w-full select-none">
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#9AA5C1] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(0)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          className="w-full bg-[#0A0E1A] border border-[#232D47] rounded pl-8 pr-20 h-7 text-xs font-sans text-[#E7EBF5] placeholder-[#667090] focus:outline-none focus:border-[#3B82F6] transition-colors"
          placeholder="Global Command Search (Cases, Alerts, Vendors, MPs, Projects... Press '/')"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-14 p-0.5 text-[#9AA5C1] hover:text-[#E7EBF5] cursor-pointer"
            title="Clear Search"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <div className="absolute right-2 flex items-center gap-1 pointer-events-none">
          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-[#161F36] text-[#9AA5C1] border border-[#232D47]">
            SOC SEARCH
          </span>
          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-[#161F36] text-[#9AA5C1] border border-[#232D47]">
            /
          </span>
        </div>
      </div>

      {/* Dropdown Results Popover */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1.5 bg-[#10182B] border border-[#232D47] rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col max-h-96 text-xs"
        >
          {/* Header Summary */}
          <div className="p-2 bg-[#0D1424] border-b border-[#232D47] flex items-center justify-between font-mono text-[10px] text-[#9AA5C1]">
            <span className="uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#3B82F6]" />
              {query.trim()
                ? `Results for "${query}" (${results.length} matches)`
                : 'Central Forensic Registry Navigation'}
            </span>
            <span className="text-[#667090]">Use ↑↓ to navigate • Enter to select</span>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#161F36]">
            {!query.trim() ? (
              <div className="p-4 text-center space-y-2">
                <p className="text-xs text-[#9AA5C1]">
                  Search across 24 sovereign cases, anomaly findings, project ledgers, contractors, agencies, and MPs.
                </p>
                <div className="flex items-center justify-center gap-1.5 flex-wrap font-mono text-[10px] pt-1">
                  <span
                    onClick={() => setQuery('CASE-2026')}
                    className="px-2 py-0.5 rounded bg-[#161F36] border border-[#232D47] text-[#A855F7] hover:border-[#A855F7]/40 cursor-pointer"
                  >
                    Cases
                  </span>
                  <span
                    onClick={() => setQuery('Apex')}
                    className="px-2 py-0.5 rounded bg-[#161F36] border border-[#232D47] text-[#F59E0B] hover:border-[#F59E0B]/40 cursor-pointer"
                  >
                    Vendors
                  </span>
                  <span
                    onClick={() => setQuery('Maharashtra')}
                    className="px-2 py-0.5 rounded bg-[#161F36] border border-[#232D47] text-[#38BDF8] hover:border-[#38BDF8]/40 cursor-pointer"
                  >
                    States
                  </span>
                  <span
                    onClick={() => setQuery('ALT-2026')}
                    className="px-2 py-0.5 rounded bg-[#161F36] border border-[#232D47] text-[#EF4444] hover:border-[#EF4444]/40 cursor-pointer"
                  >
                    Alerts
                  </span>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-[#667090]">
                No matching entities found in active national registry for &quot;{query}&quot;.
              </div>
            ) : (
              results.map((result, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <div
                    key={`${result.category}-${result.id}-${idx}`}
                    onClick={() => handleSelectResult(result)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'p-2 flex items-center justify-between gap-2 cursor-pointer transition-colors group',
                      isSelected ? 'bg-[#161F36] text-[#E7EBF5]' : 'hover:bg-[#121A2E]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1 rounded bg-[#0A0E1A] border border-[#232D47] shrink-0">
                        {getCategoryIcon(result.category)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#E7EBF5] group-hover:text-[#3B82F6] truncate block">
                            {result.title}
                          </span>
                          <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-[#0A0E1A] text-[#9AA5C1] border border-[#232D47] shrink-0">
                            {result.category}
                          </span>
                        </div>
                        <span className="text-[11px] font-sans text-[#9AA5C1] block truncate mt-0.5">
                          {result.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono">
                      {result.badgeText && (
                        <span
                          className={cn(
                            'text-[9px] px-1.5 py-0.5 rounded font-bold border',
                            result.badgeColor || 'text-[#9AA5C1] bg-[#0A0E1A] border-[#232D47]'
                          )}
                        >
                          {result.badgeText}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-[#667090] group-hover:text-[#E7EBF5]" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
