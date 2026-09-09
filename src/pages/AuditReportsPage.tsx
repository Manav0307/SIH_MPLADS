import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { StatusPill } from '@/components/common/StatusPill'
import { FileText } from 'lucide-react'

export const AuditReportsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#232D47] pb-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#E7EBF5]">Formal Audit Reports & Dossiers</h1>
            <StatusPill label="CAG READY" variant="synced" />
          </div>
          <p className="text-xs text-[#9AA5C1] mt-0.5">
            Parliamentary audit dossier generation, statutory exception reports, and CAG/PAC submission exports.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader telemetry="/audit-reports">
          <CardTitle>Audit Dossier Generation Shell</CardTitle>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#161F36] border border-[#232D47] flex items-center justify-center text-[#3B82F6] mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-semibold text-[#E7EBF5]">Report Compiler Foundation Ready</h2>
          <p className="text-xs text-[#9AA5C1] max-w-md mt-1">
            Automated PDF/Excel generation of statutory audit reports and evidentiary annexures will be triggered here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
