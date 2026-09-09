import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  Shield,
  FileSpreadsheet,
  Download,
  CheckSquare,
} from 'lucide-react'
import { AgencyProfile } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

interface AgencyInvestigationActionsProps {
  agency: AgencyProfile
  onExportDossier: () => void
  onReviewFlaggedProjects?: () => void
}

export const AgencyInvestigationActions: React.FC<AgencyInvestigationActionsProps> = ({
  agency,
  onExportDossier,
  onReviewFlaggedProjects,
}) => {
  const navigate = useNavigate()
  const [isUnderReview, setIsUnderReview] = useState(false)

  const handleToggleReview = () => {
    setIsUnderReview((prev) => !prev)
  }

  const handleReviewProjects = () => {
    if (onReviewFlaggedProjects) {
      onReviewFlaggedProjects()
    } else {
      navigate(`/projects?agency=${encodeURIComponent(agency.name)}`)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader
        telemetry="STATUTORY AUDIT ACTION CELL // EXECUTIVE DISPATCH"
        action={
          <span className="font-mono text-[10px] text-[#EF4444] bg-[#401515] border border-[#EF4444]/40 px-2 py-0.5 rounded font-bold uppercase">
            AUDITOR PROTOCOL
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
          <CardTitle>Agency Investigation Actions</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#0A0E1A] border border-[#232D47] rounded-lg">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#E7EBF5] flex items-center gap-2 flex-wrap">
              <span>Statutory Protocol Status:</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${
                  isUnderReview
                    ? 'bg-[#3A2A0C] border-[#F59E0B]/50 text-[#F59E0B]'
                    : 'bg-[#10182B] border-[#232D47] text-[#9AA5C1]'
                }`}
              >
                {isUnderReview
                  ? 'STATUS: FORMAL AUDIT REVIEW ACTIVE'
                  : 'STATUS: ROUTINE MONITORING'}
              </span>
            </span>
            <p className="text-[11px] text-[#9AA5C1]">
              Execute statutory review on fund flow velocity, QC inspection records, and tranche
              clearance documentation for {agency.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* 1. Open Investigation */}
            <button
              onClick={() =>
                navigate(`/investigation?agency=${encodeURIComponent(agency.name)}`)
              }
              className="px-3 py-1.5 bg-[#401515] hover:bg-[#521C1C] border border-[#EF4444]/60 rounded text-xs text-[#EF4444] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Open Investigation</span>
            </button>

            {/* 2. Review Flagged Projects */}
            <button
              onClick={handleReviewProjects}
              className="px-3 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#3B82F6] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Review Flagged Projects</span>
            </button>

            {/* 3. Related Cases */}
            <button
              onClick={() => navigate(`/cases?q=${encodeURIComponent(agency.name)}`)}
              className="px-3 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#a5b4fc] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Related Cases</span>
            </button>

            {/* 3. Export Agency Dossier */}
            <button
              onClick={onExportDossier}
              className="px-3 py-1.5 bg-[#161F36] hover:bg-[#232D47] border border-[#232D47] rounded text-xs text-[#E7EBF5] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Export Agency Dossier</span>
            </button>

            {/* 4. Mark Under Review */}
            <button
              onClick={handleToggleReview}
              className={`px-3 py-1.5 border rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors ${
                isUnderReview
                  ? 'bg-[#F59E0B] text-[#0A0E1A] font-bold border-[#F59E0B]'
                  : 'bg-[#161F36] hover:bg-[#232D47] text-[#9AA5C1] hover:text-[#E7EBF5] border-[#232D47]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{isUnderReview ? 'Marked Under Review' : 'Mark Under Review'}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
