import { DashboardKpis } from '@/types'

export const mockDashboardKpis: DashboardKpis = {
  totalAllocated: {
    amount: '₹ 1,245.00 Cr',
    yoy: '+4.2% YoY',
    constituencies: 'Across 740 Constituencies',
    cap: 'FY 25-26 CAP',
    percent: 100,
  },
  totalSanctioned: {
    amount: '₹ 1,084.60 Cr',
    percent: 87.1,
    works: '84,219 approved works',
    target: 'Target: 92%',
  },
  totalDisbursed: {
    amount: '₹ 792.40 Cr',
    percent: 73.1,
    unspent: '₹292.20 Cr unspent balance',
    pfms: 'PFMS Linked',
  },
  flaggedProjects: {
    count: 2481,
    worksPercent: '12.8% Works',
    capital: '₹148.60 Cr flagged capital',
    newToday: 42,
    criticalPercent: 42,
  },
}
