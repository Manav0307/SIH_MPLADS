import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { OverviewPage } from '@/pages/OverviewPage'
import { InvestigationPage } from '@/pages/InvestigationPage'
import { AnomaliesPage } from '@/pages/AnomaliesPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { MPsPage } from '@/pages/MPsPage'
import { MPProfilePage } from '@/pages/MPProfilePage'
import { VendorsPage } from '@/pages/VendorsPage'
import { VendorProfilePage } from '@/pages/VendorProfilePage'
import { AgenciesPage } from '@/pages/AgenciesPage'
import { AgencyProfilePage } from '@/pages/AgencyProfilePage'
import { GeospatialPage } from '@/pages/GeospatialPage'
import { AlertsPage } from '@/pages/AlertsPage'
import { CasesPage } from '@/pages/CasesPage'
import { DataSourcesPage } from '@/pages/DataSourcesPage'
import { ModelMonitoringPage } from '@/pages/ModelMonitoringPage'
import { AuditReportsPage } from '@/pages/AuditReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AssistantPage } from '@/pages/AssistantPage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="investigation" element={<InvestigationPage />} />
        <Route path="anomalies" element={<AnomaliesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="mps" element={<MPsPage />} />
        <Route path="mps/:id" element={<MPProfilePage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="vendors/:id" element={<VendorProfilePage />} />
        <Route path="agencies" element={<AgenciesPage />} />
        <Route path="agencies/:id" element={<AgencyProfilePage />} />
        <Route path="geospatial" element={<GeospatialPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="data-sources" element={<DataSourcesPage />} />
        <Route path="model-monitoring" element={<ModelMonitoringPage />} />
        <Route path="audit-reports" element={<AuditReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Wildcard fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
