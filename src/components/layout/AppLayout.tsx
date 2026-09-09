import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Footer } from './Footer'

const routeTitles: Record<string, string> = {
  '/': 'Overview Dashboard',
  '/assistant': 'AI Investigation Assistant — Demonstration',
  '/cases': 'Anomaly Case Management & Audit Workflow',
  '/investigation': 'Forensic Investigation Explorer',
  '/projects': 'Project Portfolio Ledger',
  '/mps': 'MPs & Constituencies Intelligence',
  '/vendors': 'Vendor & Contractor Network',
  '/agencies': 'Implementing Agencies Audit',
  '/geospatial': 'Geospatial Intelligence Map',
  '/alerts': 'Anomaly Alerts & Incident Queue',
  '/data-sources': 'Statutory Data Sources & Ingestion',
  '/model-monitoring': 'ML Model Performance & Drift',
  '/audit-reports': 'Formal Audit Reports & Dossiers',
  '/settings': 'System Settings & Security Controls',
}

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const currentTitle =
    routeTitles[location.pathname] ||
    (location.pathname.startsWith('/mps/')
      ? 'MP & Constituency Forensic Profile'
      : location.pathname.startsWith('/vendors/')
      ? 'Vendor Forensic Profile'
      : location.pathname.startsWith('/agencies/')
      ? 'Implementing Agency Forensic Profile'
      : 'National Audit Command')

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#E7EBF5] flex flex-col">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <Header currentTitle={currentTitle} />

        {/* Dynamic Route Content */}
        <main className="flex-1 pt-14 pb-10 flex flex-col min-h-0 bg-[#0A0E1A] w-full">
          <Outlet />
        </main>

        {/* Bottom Telemetry Status Bar */}
        <Footer />
      </div>
    </div>
  )
}
