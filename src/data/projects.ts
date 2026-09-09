import { ProjectRecord } from '@/types'

export const mockProjects: ProjectRecord[] = [
  {
    id: 'proj-001',
    workCode: 'WS/MH14/25-26/004812',
    title: 'Community RO Water Purification Center & Tanker Shed',
    state: 'Maharashtra',
    district: 'Ahmednagar',
    constituency: 'Ahmednagar (MH-14)',
    mpName: 'Rahul Sharma',
    mpHouse: 'LS',
    category: 'Water & Sanitation',
    sanctionedAmount: 4850000,
    sanctionedDisplay: '₹ 48.50 L',
    disbursedAmount: 4620000,
    disbursedDisplay: '₹ 46.20 L',
    disbursedPercent: 95.2,
    spentAmount: 1840000,
    progressPercent: 35,
    agingDays: 180,
    agingDisplay: '+180d',
    riskScore: 96,
    riskLevel: 'critical',
    primaryAnomaly: 'Cost anomaly (2.8x median) & Disb exceeds stage',
    agency: 'Zila Parishad Ahmednagar',
    vendor: 'Apex Infra Projects Ltd.',
    vendorGst: '27AAACA9921D1Z4',
    status: 'Under Investigation',
    financialExecutionWarning:
      'Premature Tranche Release: ₹28.50 L disbursed in tranche 3 without requisite GIS stage certificate from designated Executive Engineer.',
    violations: [
      {
        id: 'viol-1',
        title: 'Cost Inflation Outlier',
        description: 'Sanctioned at 2.8x standard rate card of Maharashtra Rural Water Supply Board (Norm: ₹17.2 L).',
        severity: 'critical',
      },
      {
        id: 'viol-2',
        title: 'GIS Photo Timestamp Inconsistency',
        description: 'Uploaded inspection photos metadata indicates taken 420 days prior to tender release.',
        severity: 'critical',
      },
      {
        id: 'viol-3',
        title: 'Vendor Concentration',
        description: 'Vendor Apex Infra was awarded 8 consecutive contracts in the same taluka within 14 calendar days.',
        severity: 'high',
      },
    ],
    recommendedActions: [
      { id: 'act-1', label: 'Freeze PFMS Tranche #4 disbursement until physical verification report', checked: true },
      { id: 'act-2', label: 'Issue statutory audit summons to Executive Engineer (Sanitation Div)', checked: true },
      { id: 'act-3', label: 'Cross-reference contractor GST invoices with GSTR-2B filing records', checked: false },
      { id: 'act-4', label: 'Dispatch drone aerial LiDAR survey team for volumetric valuation', checked: false },
    ],
    evidenceImages: [
      {
        caption: 'Satellite imagery showing barren rural plot with zero water structure despite 95% funding',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
        watermark: 'CAG EVIDENCE // SAT-GEO-2025-09',
      },
      {
        caption: 'Ground-level audit photograph of incomplete concrete foundation with rusted rebars',
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        watermark: 'INSPECTION SLIP // FIELD-AUDIT-MH14',
      },
    ],
    timeline: {
      recommended: '14 May 2024',
      sanctioned: '02 Jul 2024',
      disbursed: '18 Aug 2024',
      completionTarget: '31 Dec 2024 (Overdue)',
    },
  },
  {
    id: 'proj-002',
    workCode: 'WS/UP32/24-25/002913',
    title: 'Concrete Paving & Drainage Channel Package 4',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    constituency: 'Lucknow East (UP-32)',
    mpName: 'Smt. Aparna Sen',
    mpHouse: 'LS',
    category: 'Roads & Transport',
    sanctionedAmount: 8200000,
    sanctionedDisplay: '₹ 82.00 L',
    disbursedAmount: 7950000,
    disbursedDisplay: '₹ 79.50 L',
    disbursedPercent: 97.0,
    spentAmount: 3280000,
    progressPercent: 40,
    agingDays: 240,
    agingDisplay: '+240d',
    riskScore: 94,
    riskLevel: 'critical',
    primaryAnomaly: 'Duplicate GPS footprint detected (180m from #00192)',
    agency: 'PWD Division 1 Lucknow',
    vendor: 'Sai Krupa Construction Co.',
    vendorGst: '09BBCPR4412K1Z9',
    status: 'Under Investigation',
    financialExecutionWarning:
      'Duplicate Spatial Allocation: Geo-coordinates overlap with PWD State Scheme #UP-PWD-2023-441 funded under State Budget.',
    violations: [
      {
        id: 'viol-4',
        title: 'Duplicate GPS Footprint',
        description: 'Centroid coordinates identical to road segment funded under UP State Highway Fund 6 months prior.',
        severity: 'critical',
      },
      {
        id: 'viol-5',
        title: 'Cost Anomaly',
        description: 'Sanctioned ₹82.0L vs benchmark median ₹38.0L for concrete rural pavement (+115% deviation).',
        severity: 'critical',
      },
      {
        id: 'viol-6',
        title: 'Rapid Tranche Release',
        description: '97% funds released within 60 days of sanction without mandatory 2nd phase quality certificate.',
        severity: 'high',
      },
    ],
    recommendedActions: [
      { id: 'act-5', label: 'Verify geometric overlap using State PWD GIS layer', checked: true },
      { id: 'act-6', label: 'Summon vendor Sai Krupa for dual invoicing forensic interview', checked: true },
      { id: 'act-7', label: 'Order recovery of duplicate disbursement under Public Moneys Act', checked: false },
    ],
    evidenceImages: [
      {
        caption: 'GIS overlay demonstrating 98% spatial overlap with prior state works',
        url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=600&q=80',
        watermark: 'CAG GIS LAB // OVERLAP-ALERT',
      },
      {
        caption: 'Surface distress audit showing pre-existing bitumen underlying claimed concrete works',
        url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
        watermark: 'FIELD OBSERVATION // UP-32-AUDIT',
      },
    ],
    timeline: {
      recommended: '10 Jan 2024',
      sanctioned: '22 Mar 2024',
      disbursed: '15 May 2024',
      completionTarget: '15 Nov 2024 (Overdue)',
    },
  },
  {
    id: 'proj-003',
    workCode: 'WS/KA08/25-26/007421',
    title: 'Smart Anganwadi Center Digitization & Solar Microgrid',
    state: 'Karnataka',
    district: 'Bangalore Urban',
    constituency: 'Bangalore South (KA-08)',
    mpName: 'Tejaswi M.',
    mpHouse: 'LS',
    category: 'Education & Tech',
    sanctionedAmount: 3500000,
    sanctionedDisplay: '₹ 35.00 L',
    disbursedAmount: 3400000,
    disbursedDisplay: '₹ 34.00 L',
    disbursedPercent: 97.1,
    spentAmount: 1925000,
    progressPercent: 55,
    agingDays: 95,
    agingDisplay: '+95d',
    riskScore: 88,
    riskLevel: 'high',
    primaryAnomaly: 'Single bidder cartel pattern (3 common directors)',
    agency: 'Zila Parishad Bangalore',
    vendor: 'Bharat Civil & Electric Works',
    vendorGst: '29CCDEB1123M1Z2',
    status: 'In Progress',
    financialExecutionWarning:
      'Procurement Collusion Detected: All 3 bidders submitted tenders from the same gateway IP address within 8 minutes.',
    violations: [
      {
        id: 'viol-7',
        title: 'Bidder Cartel Collusion',
        description: '3 participating bids share common board directors and registered corporate office in Peenya.',
        severity: 'high',
      },
      {
        id: 'viol-8',
        title: 'Hardware Procurement Mark-Up',
        description: 'Solar inverters billed at ₹1.45L each against GeM portal benchmark of ₹62,000.',
        severity: 'high',
      },
    ],
    recommendedActions: [
      { id: 'act-8', label: 'Submit cartel evidence to Competition Commission of India', checked: true },
      { id: 'act-9', label: 'Blacklist bidding syndicate across State nodal agencies', checked: false },
    ],
    evidenceImages: [
      {
        caption: 'Anganwadi rooftop installation audit showing sub-spec commercial solar panels',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        watermark: 'TECHNICAL VALUATION // KA08',
      },
      {
        caption: 'Uncommissioned battery bank stored in non-ventilated classroom enclosure',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        watermark: 'HAZARD REPORT // BLR-SOUTH',
      },
    ],
    timeline: {
      recommended: '05 Aug 2024',
      sanctioned: '18 Sep 2024',
      disbursed: '01 Nov 2024',
      completionTarget: '28 Feb 2025 (Overdue)',
    },
  },
  {
    id: 'proj-004',
    workCode: 'WS/BR12/24-25/009104',
    title: 'Rural Healthcare Sub-center Construction Block B',
    state: 'Bihar',
    district: 'Muzaffarpur',
    constituency: 'Muzaffarpur (BR-12)',
    mpName: 'Ajay Kumar Rai',
    mpHouse: 'LS',
    category: 'Healthcare',
    sanctionedAmount: 6500000,
    sanctionedDisplay: '₹ 65.00 L',
    disbursedAmount: 4200000,
    disbursedDisplay: '₹ 42.00 L',
    disbursedPercent: 64.6,
    spentAmount: 1300000,
    progressPercent: 20,
    agingDays: 310,
    agingDisplay: '+310d',
    riskScore: 85,
    riskLevel: 'high',
    primaryAnomaly: 'Milestone payment released without Geo-tagged photo',
    agency: 'Rural Dev Dept Bihar',
    vendor: 'Omkar Rural Enterprises',
    vendorGst: '10DDGHK7781N1Z0',
    status: 'Under Investigation',
    financialExecutionWarning:
      'Ghost Progress Report: Stage-2 completion certificate signed by local engineer while site remains at plinth level.',
    violations: [
      {
        id: 'viol-9',
        title: 'Unverified Milestone Disbursement',
        description: '₹42.00 L released without mandatory NIC geo-tagged photo verification uploaded to MPLADS portal.',
        severity: 'high',
      },
      {
        id: 'viol-10',
        title: 'Prolonged Work Abandonment',
        description: 'Zero labor activity recorded on site for 195 consecutive days.',
        severity: 'high',
      },
    ],
    recommendedActions: [
      { id: 'act-10', label: 'Impose penalty for default under Clause 14 of contract', checked: true },
      { id: 'act-11', label: 'Initiate departmental inquiry on Junior Engineer Muzaffarpur', checked: false },
    ],
    evidenceImages: [
      {
        caption: 'Plinth level construction with standing water and wild vegetation overgrowth',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
        watermark: 'PHYSICAL AUDIT // BR-MUZ',
      },
    ],
    timeline: {
      recommended: '12 Nov 2023',
      sanctioned: '15 Feb 2024',
      disbursed: '20 Apr 2024',
      completionTarget: '30 Oct 2024 (Severe Delay)',
    },
  },
  {
    id: 'proj-005',
    workCode: 'WS/RJ03/25-26/003319',
    title: 'High-Mast LED Lighting & Public Park Development',
    state: 'Rajasthan',
    district: 'Jodhpur',
    constituency: 'Jodhpur (RJ-03)',
    mpName: 'Vikramaditya S.',
    mpHouse: 'LS',
    category: 'Urban Amenities',
    sanctionedAmount: 2850000,
    sanctionedDisplay: '₹ 28.50 L',
    disbursedAmount: 2850000,
    disbursedDisplay: '₹ 28.50 L',
    disbursedPercent: 100.0,
    spentAmount: 2280000,
    progressPercent: 80,
    agingDays: 60,
    agingDisplay: '+60d',
    riskScore: 82,
    riskLevel: 'high',
    primaryAnomaly: 'Cost per unit 2.3x state benchmark rate',
    agency: 'Municipal Corporation Jodhpur',
    vendor: 'Apex Infra Projects Ltd.',
    vendorGst: '27AAACA9921D1Z4',
    status: 'In Progress',
    financialExecutionWarning:
      'Unit Cost Inflation: Billed ₹4.75L per 16m high mast mast unit versus DGS&D rate contract of ₹2.05L.',
    violations: [
      {
        id: 'viol-11',
        title: 'Benchmark Rate Inflation',
        description: 'Unit item costs exceed Rajasthan Urban Development Board schedule of rates by 130%.',
        severity: 'high',
      },
      {
        id: 'viol-12',
        title: 'Full Advance Payout',
        description: '100% funds disbursed prior to third-party electrical safety inspection clearance.',
        severity: 'medium',
      },
    ],
    recommendedActions: [
      { id: 'act-12', label: 'Withhold final retention money pending technical audit', checked: true },
      { id: 'act-13', label: 'Verify lux output standards via state electrical inspectorate', checked: false },
    ],
    evidenceImages: [
      {
        caption: 'Installed 16m lighting mast operating with only 4 of 8 luminaires functioning',
        url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80',
        watermark: 'TECHNICAL INSPECTION // RJ-03',
      },
    ],
    timeline: {
      recommended: '14 Sep 2024',
      sanctioned: '08 Nov 2024',
      disbursed: '20 Dec 2024',
      completionTarget: '15 Mar 2025',
    },
  },
  {
    id: 'proj-006',
    workCode: 'WS/WB19/24-25/001855',
    title: 'Flood Protection Embankment & Retaining Wall',
    state: 'West Bengal',
    district: 'Malda',
    constituency: 'Malda South (WB-19)',
    mpName: 'Dr. S. Mukherjee',
    mpHouse: 'LS',
    category: 'Flood Relief',
    sanctionedAmount: 11000000,
    sanctionedDisplay: '₹ 110.00 L',
    disbursedAmount: 9800000,
    disbursedDisplay: '₹ 98.00 L',
    disbursedPercent: 89.1,
    spentAmount: 6600000,
    progressPercent: 60,
    agingDays: 150,
    agingDisplay: '+150d',
    riskScore: 79,
    riskLevel: 'high',
    primaryAnomaly: 'Rapid consecutive disbursement within 48 hrs',
    agency: 'Irrigation & Waterways Directorate',
    vendor: 'Sai Krupa Construction Co.',
    vendorGst: '09BBCPR4412K1Z9',
    status: 'In Progress',
    financialExecutionWarning:
      'Unscheduled Accelerated Payout: Tranche 2 (₹45L) and Tranche 3 (₹35L) approved within 48 hours without intermediate inspection.',
    violations: [
      {
        id: 'viol-13',
        title: 'Accelerated Payout Sequence',
        description: 'Successive tranches released without mandatory 30-day curing interval.',
        severity: 'high',
      },
      {
        id: 'viol-14',
        title: 'Geotechnical Soil Compact Deviation',
        description: 'Quality audit reveals core filling with uncompacted silt violating Central Water Commission norms.',
        severity: 'high',
      },
    ],
    recommendedActions: [
      { id: 'act-14', label: 'Order core soil compaction density test by IIT Kharagpur', checked: true },
      { id: 'act-15', label: 'Freeze bank escrow accounts associated with contract', checked: false },
    ],
    evidenceImages: [
      {
        caption: 'Embankment cross section showing severe erosion fissuring after initial monsoon runoff',
        url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
        watermark: 'HYDRAULIC AUDIT // WB19',
      },
    ],
    timeline: {
      recommended: '18 Mar 2024',
      sanctioned: '10 May 2024',
      disbursed: '12 Jul 2024',
      completionTarget: '30 Dec 2024 (Overdue)',
    },
  },
  {
    id: 'proj-007',
    workCode: 'WS/MH20/25-26/006120',
    title: 'Solar Powered Cold Storage for Agricultural Market Yard',
    state: 'Maharashtra',
    district: 'Nashik',
    constituency: 'Nashik (MH-20)',
    mpName: 'Hemant Godse',
    mpHouse: 'LS',
    category: 'Water & Sanitation',
    sanctionedAmount: 5200000,
    sanctionedDisplay: '₹ 52.00 L',
    disbursedAmount: 4800000,
    disbursedDisplay: '₹ 48.00 L',
    disbursedPercent: 92.3,
    spentAmount: 2340000,
    progressPercent: 45,
    agingDays: 120,
    agingDisplay: '+120d',
    riskScore: 76,
    riskLevel: 'high',
    primaryAnomaly: 'Disbursement pace 2.4x physical work verification',
    agency: 'APMC Nashik Division',
    vendor: 'Apex Infra Projects Ltd.',
    vendorGst: '27AAACA9921D1Z4',
    status: 'In Progress',
    financialExecutionWarning:
      'Excessive Financial Burn: 92% funds disbursed against 45% physical completion.',
    violations: [
      {
        id: 'viol-15',
        title: 'Stage Payment Asymmetry',
        description: 'Sanctioned equipment supply advance released without delivery challans on record.',
        severity: 'high',
      },
    ],
    recommendedActions: [
      { id: 'act-16', label: 'Audit physical warehouse inventory for refrigeration machinery', checked: true },
    ],
    evidenceImages: [],
    timeline: {
      recommended: '20 Jun 2024',
      sanctioned: '14 Aug 2024',
      disbursed: '10 Oct 2024',
      completionTarget: '28 Feb 2025',
    },
  },
  {
    id: 'proj-008',
    workCode: 'WS/TN12/24-25/004921',
    title: 'Model Primary School Digital Learning Laboratory',
    state: 'Tamil Nadu',
    district: 'Madurai',
    constituency: 'Madurai (TN-12)',
    mpName: 'Su. Venkatesan',
    mpHouse: 'LS',
    category: 'Education & Tech',
    sanctionedAmount: 2210000,
    sanctionedDisplay: '₹ 22.10 L',
    disbursedAmount: 2210000,
    disbursedDisplay: '₹ 22.10 L',
    disbursedPercent: 100.0,
    spentAmount: 500000,
    progressPercent: 25,
    agingDays: 450,
    agingDisplay: '+450d',
    riskScore: 68,
    riskLevel: 'medium',
    primaryAnomaly: 'Unspent balance idle >18 months without progress',
    agency: 'School Education Department TN',
    vendor: 'Omkar Rural Enterprises',
    vendorGst: '10DDGHK7781N1Z0',
    status: 'Under Investigation',
    financialExecutionWarning:
      'Dormant Public Fund: ₹17.10 L lying unutilized in commercial bank account outside PFMS single treasury account.',
    violations: [
      {
        id: 'viol-16',
        title: 'Treasury Non-Compliance',
        description: 'Interest accrued on idle funds not remitted to Consolidated Fund of India as per Rule 16 MPLADS.',
        severity: 'medium',
      },
    ],
    recommendedActions: [
      { id: 'act-17', label: 'Issue immediate fund recall order to District Collector', checked: true },
    ],
    evidenceImages: [],
    timeline: {
      recommended: '15 Sep 2023',
      sanctioned: '10 Dec 2023',
      disbursed: '05 Feb 2024',
      completionTarget: '30 Jun 2024 (Severe Delay)',
    },
  },
  {
      "id": "proj-009",
      "workCode": "WS/KL04/25-26/001124",
      "title": "Solar Powered Marine Rescue & Desalination Kiosk",
      "state": "Kerala",
      "district": "Ernakulam",
      "constituency": "Ernakulam (KL-04)",
      "mpName": "Shashi Tharoor",
      "mpHouse": "LS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 4200000,
      "sanctionedDisplay": "₹ 42.00 L",
      "disbursedAmount": 3950000,
      "disbursedDisplay": "₹ 39.50 L",
      "disbursedPercent": 94,
      "spentAmount": 2100000,
      "progressPercent": 50,
      "agingDays": 140,
      "agingDisplay": "+140d",
      "riskScore": 74,
      "riskLevel": "high",
      "primaryAnomaly": "Coastal regulation clearance omitted during tender sanction",
      "agency": "Kerala PWD Coastal Division",
      "vendor": "Vardhman Tech Infrastructures",
      "vendorGst": "32AABCV1029L1Z5",
      "status": "In Progress",
      "financialExecutionWarning": "Disbursement released without statutory CRZ environmental clearance from State Coastal Zone Management Authority.",
      "violations": [
          {
              "id": "viol-17",
              "title": "Environmental Compliance Lapse",
              "description": "CRZ Category II clearance documentation missing from project portal.",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-18",
              "label": "Hold tranche 4 until clearance certificate submitted",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "12 Jan 2024",
          "sanctioned": "04 Apr 2024",
          "disbursed": "18 Jun 2024",
          "completionTarget": "30 Dec 2024 (Delayed)"
      }
  },
  {
      "id": "proj-010",
      "workCode": "WS/GJ01/24-25/008821",
      "title": "Automated Solid Waste Compactor Station & Fleet Depot",
      "state": "Gujarat",
      "district": "Ahmedabad",
      "constituency": "Ahmedabad East (GJ-01)",
      "mpName": "Hiren Patel",
      "mpHouse": "LS",
      "category": "Urban Amenities",
      "sanctionedAmount": 14500000,
      "sanctionedDisplay": "₹ 1.45 Cr",
      "disbursedAmount": 14500000,
      "disbursedDisplay": "₹ 1.45 Cr",
      "disbursedPercent": 100,
      "spentAmount": 13800000,
      "progressPercent": 95,
      "agingDays": 20,
      "agingDisplay": "+20d",
      "riskScore": 28,
      "riskLevel": "low",
      "primaryAnomaly": "Nominal operational verification within acceptable tolerance",
      "agency": "Ahmedabad Urban Dev Authority",
      "vendor": "National Highway Concessionaires",
      "vendorGst": "24AAACN4401F1ZX",
      "status": "Completed",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-19",
              "label": "Complete final asset tagging on GIS register",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Oct 2023",
          "sanctioned": "15 Jan 2024",
          "disbursed": "20 Mar 2024",
          "completionTarget": "15 Jan 2025 (Completed)"
      }
  },
  {
      "id": "proj-011",
      "workCode": "WS/AS07/25-26/003412",
      "title": "Riverbank Geo-synthetic Tube Erosion Barrier Package B",
      "state": "Assam",
      "district": "Kamrup",
      "constituency": "Gauhati (AS-07)",
      "mpName": "Gaurav Gogoi",
      "mpHouse": "LS",
      "category": "Flood Relief",
      "sanctionedAmount": 22000000,
      "sanctionedDisplay": "₹ 2.20 Cr",
      "disbursedAmount": 19800000,
      "disbursedDisplay": "₹ 1.98 Cr",
      "disbursedPercent": 90,
      "spentAmount": 8800000,
      "progressPercent": 40,
      "agingDays": 210,
      "agingDisplay": "+210d",
      "riskScore": 91,
      "riskLevel": "critical",
      "primaryAnomaly": "Synthetic geobags thickness 40% below Brahmaputra Board norm",
      "agency": "Assam Rural Infrastructure Board",
      "vendor": "Sai Krupa Construction Co.",
      "vendorGst": "09BBCPR4412K1Z9",
      "status": "Under Investigation",
      "financialExecutionWarning": "Substandard Material Substitution: Core geotextile fabric fails tensile strength requirements by 38 kN/m.",
      "violations": [
          {
              "id": "viol-20",
              "title": "Substandard Material Fraud",
              "description": "Lab test indicates fabric thickness 2.1mm vs mandated 4.0mm spec.",
              "severity": "critical"
          },
          {
              "id": "viol-21",
              "title": "Advance Disbursement Overrun",
              "description": "90% disbursed with physical flood barrier only 40% placed.",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-20",
              "label": "Lodge vigilance FIR against contractor and inspecting engineer",
              "checked": true
          },
          {
              "id": "act-21",
              "label": "Freeze final payment and seize security deposit",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "02 Feb 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "28 Jul 2024",
          "completionTarget": "30 Nov 2024 (Overdue)"
      }
  },
  {
      "id": "proj-012",
      "workCode": "WS/OD03/24-25/007621",
      "title": "Cyclone Resilient Multi-Purpose Shelter & Medical Depot",
      "state": "Odisha",
      "district": "Cuttack",
      "constituency": "Cuttack (OD-03)",
      "mpName": "Pinaki Misra",
      "mpHouse": "LS",
      "category": "Community Infrastructure",
      "sanctionedAmount": 8500000,
      "sanctionedDisplay": "₹ 85.00 L",
      "disbursedAmount": 8500000,
      "disbursedDisplay": "₹ 85.00 L",
      "disbursedPercent": 100,
      "spentAmount": 8100000,
      "progressPercent": 92,
      "agingDays": 15,
      "agingDisplay": "+15d",
      "riskScore": 22,
      "riskLevel": "low",
      "primaryAnomaly": "Minor reporting delay on utilization certificate",
      "agency": "Odisha Bridge & Construction Corp",
      "vendor": "Deccan Builders & Engineers",
      "vendorGst": "21AABCD7781R1Z2",
      "status": "In Progress",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-22",
              "label": "Upload final completion photos",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "14 Dec 2023",
          "sanctioned": "20 Mar 2024",
          "disbursed": "15 May 2024",
          "completionTarget": "28 Feb 2025"
      }
  },
  {
      "id": "proj-013",
      "workCode": "WS/PB02/25-26/004312",
      "title": "Grain Silo & Solar Powered Dryer Shed at Sub-Mandi",
      "state": "Punjab",
      "district": "Amritsar",
      "constituency": "Amritsar (PB-02)",
      "mpName": "Harpal Singh Cheema",
      "mpHouse": "RS",
      "category": "Renewable Energy",
      "sanctionedAmount": 5400000,
      "sanctionedDisplay": "₹ 54.00 L",
      "disbursedAmount": 3200000,
      "disbursedDisplay": "₹ 32.00 L",
      "disbursedPercent": 59.3,
      "spentAmount": 1800000,
      "progressPercent": 35,
      "agingDays": 165,
      "agingDisplay": "+165d",
      "riskScore": 64,
      "riskLevel": "medium",
      "primaryAnomaly": "Equipment delivery stalled due to vendor payment dispute",
      "agency": "Punjab Mandi Board",
      "vendor": "Pragati Green Energy Solutions",
      "vendorGst": "03AABCP8891G1Z6",
      "status": "Stalled",
      "financialExecutionWarning": "Work halted for >120 days following contractual dispute over imported solar dryer component costs.",
      "violations": [
          {
              "id": "viol-22",
              "title": "Protracted Project Stoppage",
              "description": "No milestone activity registered since October 2024.",
              "severity": "medium"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-23",
              "label": "Arbitrate dispute through District Collector nodal cell",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "18 Jan 2024",
          "sanctioned": "22 Apr 2024",
          "disbursed": "14 Jul 2024",
          "completionTarget": "15 Dec 2024 (Stalled)"
      }
  },
  {
      "id": "proj-014",
      "workCode": "WS/MP19/25-26/001923",
      "title": "Drinking Water Pipeline Extension & Overhead RCC Tank",
      "state": "Madhya Pradesh",
      "district": "Bhopal",
      "constituency": "Bhopal (MP-19)",
      "mpName": "Pragya Singh",
      "mpHouse": "LS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 9500000,
      "sanctionedDisplay": "₹ 95.00 L",
      "disbursedAmount": 9000000,
      "disbursedDisplay": "₹ 90.00 L",
      "disbursedPercent": 94.7,
      "spentAmount": 3800000,
      "progressPercent": 42,
      "agingDays": 175,
      "agingDisplay": "+175d",
      "riskScore": 86,
      "riskLevel": "high",
      "primaryAnomaly": "95% disbursement with pipeline only laid on trunk segment",
      "agency": "MP Jal Nigam",
      "vendor": "Omkar Rural Enterprises",
      "vendorGst": "10DDGHK7781N1Z0",
      "status": "Under Investigation",
      "financialExecutionWarning": "Tranche release ahead of household distribution network pipe laying.",
      "violations": [
          {
              "id": "viol-23",
              "title": "Severe Progress Variance",
              "description": "Disbursed 94.7% while distribution lines remain unexcavated.",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-24",
              "label": "Order immediate physical audit of pipeline inventory",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "11 Feb 2024",
          "sanctioned": "19 May 2024",
          "disbursed": "25 Aug 2024",
          "completionTarget": "31 Jan 2025 (Overdue)"
      }
  },
  {
      "id": "proj-015",
      "workCode": "WS/DL01/25-26/005510",
      "title": "Rainwater Harvesting & Ground Recharge Wells at Senior Schools",
      "state": "Delhi",
      "district": "New Delhi",
      "constituency": "New Delhi (DL-01)",
      "mpName": "Manoj Tiwari",
      "mpHouse": "LS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 3800000,
      "sanctionedDisplay": "₹ 38.00 L",
      "disbursedAmount": 3800000,
      "disbursedDisplay": "₹ 38.00 L",
      "disbursedPercent": 100,
      "spentAmount": 3650000,
      "progressPercent": 98,
      "agingDays": 10,
      "agingDisplay": "+10d",
      "riskScore": 19,
      "riskLevel": "low",
      "primaryAnomaly": "Fully verified filtration rate; awaiting signoff",
      "agency": "Delhi Jal Board",
      "vendor": "Trident Watertech Solutions",
      "vendorGst": "07AAACT3321P1Z8",
      "status": "Completed",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-25",
              "label": "Upload final Central Ground Water Board clearance",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "05 Mar 2024",
          "sanctioned": "12 Jun 2024",
          "disbursed": "20 Aug 2024",
          "completionTarget": "28 Feb 2025"
      }
  },
  {
      "id": "proj-016",
      "workCode": "WS/AP05/24-25/002419",
      "title": "Community Skill Training Centre & Digital Library Facility",
      "state": "Andhra Pradesh",
      "district": "Guntur",
      "constituency": "Guntur (AP-05)",
      "mpName": "Kesineni Srinivas",
      "mpHouse": "LS",
      "category": "Education & Tech",
      "sanctionedAmount": 7200000,
      "sanctionedDisplay": "₹ 72.00 L",
      "disbursedAmount": 7000000,
      "disbursedDisplay": "₹ 70.00 L",
      "disbursedPercent": 97.2,
      "spentAmount": 2500000,
      "progressPercent": 35,
      "agingDays": 220,
      "agingDisplay": "+220d",
      "riskScore": 92,
      "riskLevel": "critical",
      "primaryAnomaly": "Vendor billed computers at 3.2x GeM benchmark; asset missing",
      "agency": "AP State Housing Corp",
      "vendor": "Bharat Civil & Electric Works",
      "vendorGst": "29CCDEB1123M1Z2",
      "status": "Under Investigation",
      "financialExecutionWarning": "Phantom IT Hardware: Invoice records 80 desktop computers delivered; physical inspection finds empty halls.",
      "violations": [
          {
              "id": "viol-24",
              "title": "Asset Misappropriation",
              "description": "Equipment claimed as procured has zero serial number entries on state asset portal.",
              "severity": "critical"
          },
          {
              "id": "viol-25",
              "title": "Extreme Price Gouging",
              "description": "Billed ₹1,12,000 per entry level terminal (GeM ref ₹34,500).",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-26",
              "label": "File criminal breach of trust case against supplier",
              "checked": true
          },
          {
              "id": "act-27",
              "label": "Issue recovery notice for ₹45.0 L",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "14 Nov 2023",
          "sanctioned": "08 Feb 2024",
          "disbursed": "16 Apr 2024",
          "completionTarget": "30 Oct 2024 (Severe Delay)"
      }
  },
  {
      "id": "proj-017",
      "workCode": "WS/TS01/25-26/009182",
      "title": "Historic Bazaars Heritage LED Illumination & Cable Ducting",
      "state": "Telangana",
      "district": "Hyderabad",
      "constituency": "Hyderabad (TS-01)",
      "mpName": "Asaduddin Owaisi",
      "mpHouse": "LS",
      "category": "Urban Amenities",
      "sanctionedAmount": 5100000,
      "sanctionedDisplay": "₹ 51.00 L",
      "disbursedAmount": 4800000,
      "disbursedDisplay": "₹ 48.00 L",
      "disbursedPercent": 94.1,
      "spentAmount": 4100000,
      "progressPercent": 82,
      "agingDays": 40,
      "agingDisplay": "+40d",
      "riskScore": 48,
      "riskLevel": "medium",
      "primaryAnomaly": "Subcontracted to non-registered local electrical vendor",
      "agency": "GHMC Hyderabad",
      "vendor": "Apex Infra Projects Ltd.",
      "vendorGst": "27AAACA9921D1Z4",
      "status": "Under Review",
      "financialExecutionWarning": "Unapproved Subletting: Primary contractor outsourced 60% of wiring works without municipal approval.",
      "violations": [
          {
              "id": "viol-26",
              "title": "Unauthorized Subcontracting",
              "description": "Breach of Clause 8 forbidding third party execution without prior NOC.",
              "severity": "medium"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-28",
              "label": "Issue show cause notice to prime contractor",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "20 May 2024",
          "sanctioned": "14 Jul 2024",
          "disbursed": "22 Sep 2024",
          "completionTarget": "15 Feb 2025"
      }
  },
  {
      "id": "proj-018",
      "workCode": "WS/HR01/25-26/006421",
      "title": "Multi-Sport Rural Akhada & Synthetic Track Complex",
      "state": "Haryana",
      "district": "Gurgaon",
      "constituency": "Gurgaon (HR-01)",
      "mpName": "Rao Inderjit Singh",
      "mpHouse": "LS",
      "category": "Sports & Culture",
      "sanctionedAmount": 6800000,
      "sanctionedDisplay": "₹ 68.00 L",
      "disbursedAmount": 2000000,
      "disbursedDisplay": "₹ 20.00 L",
      "disbursedPercent": 29.4,
      "spentAmount": 800000,
      "progressPercent": 15,
      "agingDays": 90,
      "agingDisplay": "+90d",
      "riskScore": 52,
      "riskLevel": "medium",
      "primaryAnomaly": "Land title dispute regarding gram sabha common land",
      "agency": "Municipal Corporation",
      "vendor": "Deccan Builders & Engineers",
      "vendorGst": "21AABCD7781R1Z2",
      "status": "Stalled",
      "financialExecutionWarning": "Boundary demarcation injunction issued by Sub-Divisional Magistrate.",
      "violations": [
          {
              "id": "viol-27",
              "title": "Site Possession Irregularity",
              "description": "Tender floated before revenue demarcation was completed.",
              "severity": "medium"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-29",
              "label": "Seek revenue record clarification from Tehsildar",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Apr 2024",
          "sanctioned": "05 Jul 2024",
          "disbursed": "15 Oct 2024",
          "completionTarget": "30 Apr 2025"
      }
  },
  {
      "id": "proj-019",
      "workCode": "WS/JH04/24-25/003892",
      "title": "Deep Borewell Solar Micro-Irrigation Check Dam",
      "state": "Jharkhand",
      "district": "Ranchi",
      "constituency": "Ranchi (JH-04)",
      "mpName": "Sanjay Seth",
      "mpHouse": "LS",
      "category": "Irrigation Works",
      "sanctionedAmount": 4900000,
      "sanctionedDisplay": "₹ 49.00 L",
      "disbursedAmount": 4700000,
      "disbursedDisplay": "₹ 47.00 L",
      "disbursedPercent": 95.9,
      "spentAmount": 2200000,
      "progressPercent": 45,
      "agingDays": 130,
      "agingDisplay": "+130d",
      "riskScore": 78,
      "riskLevel": "high",
      "primaryAnomaly": "Aquifer yield 65% below DPR minimum feasibility baseline",
      "agency": "Rural Dev Dept",
      "vendor": "Omkar Rural Enterprises",
      "vendorGst": "10DDGHK7781N1Z0",
      "status": "Under Investigation",
      "financialExecutionWarning": "Hydrological survey falsified: Borehole drilling hit dry strata with zero discharge.",
      "violations": [
          {
              "id": "viol-28",
              "title": "Fictitious Hydrological Survey",
              "description": "Pre-sanction yield report signed by blacklisted consultant firm.",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-30",
              "label": "Re-drill at certified geo-hydrology point",
              "checked": true
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "15 Jan 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "28 Jun 2024",
          "completionTarget": "15 Dec 2024 (Overdue)"
      }
  },
  {
      "id": "proj-020",
      "workCode": "WS/MH10/25-26/007101",
      "title": "Gram Panchayat Digital Citizen Seva Kendra Network",
      "state": "Maharashtra",
      "district": "Pune",
      "constituency": "Baramati (MH-10)",
      "mpName": "Supriya Sule",
      "mpHouse": "LS",
      "category": "Education & Tech",
      "sanctionedAmount": 3200000,
      "sanctionedDisplay": "₹ 32.00 L",
      "disbursedAmount": 3200000,
      "disbursedDisplay": "₹ 32.00 L",
      "disbursedPercent": 100,
      "spentAmount": 3100000,
      "progressPercent": 96,
      "agingDays": 0,
      "agingDisplay": "0d",
      "riskScore": 16,
      "riskLevel": "low",
      "primaryAnomaly": "Nominal operational status verified via citizen portal",
      "agency": "Zila Parishad",
      "vendor": "Vardhman Tech Infrastructures",
      "vendorGst": "32AABCV1029L1Z5",
      "status": "Completed",
      "violations": [],
      "recommendedActions": [],
      "evidenceImages": [],
      "timeline": {
          "recommended": "14 May 2024",
          "sanctioned": "22 Jul 2024",
          "disbursed": "10 Oct 2024",
          "completionTarget": "15 Jan 2025 (Done)"
      }
  },
  {
      "id": "proj-021",
      "workCode": "WS/UT21/25-26/00021",
      "title": "Construction of Cattle Shed & Veterinary First-Aid Clinic",
      "state": "Uttar Pradesh",
      "district": "Prayagraj",
      "constituency": "Prayagraj (UT-21)",
      "mpName": "Smt. Aparna Sen",
      "mpHouse": "LS",
      "category": "Flood Relief",
      "sanctionedAmount": 8230000,
      "sanctionedDisplay": "₹ 82.30 L",
      "disbursedAmount": 5843300,
      "disbursedDisplay": "₹ 58.43 L",
      "disbursedPercent": 71,
      "spentAmount": 3505980,
      "progressPercent": 39,
      "agingDays": 82,
      "agingDisplay": "+82d",
      "riskScore": 54,
      "riskLevel": "medium",
      "primaryAnomaly": "Minor timeline delay (<45 days) due to monsoon",
      "agency": "Zila Parishad Prayagraj",
      "vendor": "Sai Krupa Construction Co.",
      "vendorGst": "09BBCPR4412K1Z9",
      "status": "Stalled",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-21-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-21-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-022",
      "workCode": "WS/KA22/24-25/00022",
      "title": "Stormwater Masonry Drain & Culvert Construction Block C",
      "state": "Karnataka",
      "district": "Hubli-Dharwad",
      "constituency": "Hubli-Dharwad (KA-22)",
      "mpName": "Tejaswi M.",
      "mpHouse": "LS",
      "category": "Community Infrastructure",
      "sanctionedAmount": 21900000,
      "sanctionedDisplay": "₹ 2.19 Cr",
      "disbursedAmount": 17082000,
      "disbursedDisplay": "₹ 1.71 Cr",
      "disbursedPercent": 78,
      "spentAmount": 10249200,
      "progressPercent": 43,
      "agingDays": 99,
      "agingDisplay": "+99d",
      "riskScore": 72,
      "riskLevel": "high",
      "primaryAnomaly": "Substandard foundation gravel gradation noted in audit",
      "agency": "PWD Division 1 Hubli-Dharwad",
      "vendor": "Bharat Civil & Electric Works",
      "vendorGst": "29CCDEB1123M1Z2",
      "status": "Under Review",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-22-1",
              "title": "Substandard foundation gravel gradation noted in audit",
              "description": "Field inspection by State Cell flagged irregularity: Substandard foundation gravel gradation noted in audit",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-22-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-22-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-023",
      "workCode": "WS/BI23/23-24/00023",
      "title": "Solar Rooftop Grid-Tied System at Block Development Office",
      "state": "Bihar",
      "district": "Darbhanga",
      "constituency": "Darbhanga (BI-23)",
      "mpName": "Ajay Kumar Rai",
      "mpHouse": "LS",
      "category": "Renewable Energy",
      "sanctionedAmount": 71550000,
      "sanctionedDisplay": "₹ 7.16 Cr",
      "disbursedAmount": 60817500,
      "disbursedDisplay": "₹ 6.08 Cr",
      "disbursedPercent": 85,
      "spentAmount": 36490500,
      "progressPercent": 47,
      "agingDays": 116,
      "agingDisplay": "+116d",
      "riskScore": 96,
      "riskLevel": "critical",
      "primaryAnomaly": "Inspection photo metadata indicates mismatched camera EXIF",
      "agency": "Rural Dev Dept Darbhanga",
      "vendor": "Omkar Rural Enterprises",
      "vendorGst": "10DDGHK7781N1Z0",
      "status": "Under Investigation",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-23-1",
              "title": "Inspection photo metadata indicates mismatched camera EXIF",
              "description": "Field inspection by State Cell flagged irregularity: Inspection photo metadata indicates mismatched camera EXIF",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-23-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-23-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-024",
      "workCode": "WS/RA24/25-26/00024",
      "title": "Digital Smart Classroom Setup with Interactive Display Boards",
      "state": "Rajasthan",
      "district": "Jaipur",
      "constituency": "Jaipur (RA-24)",
      "mpName": "Vikramaditya S.",
      "mpHouse": "RS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 758000,
      "sanctionedDisplay": "₹ 7.58 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 0,
      "agingDays": 25,
      "agingDisplay": "+25d",
      "riskScore": 84,
      "riskLevel": "high",
      "primaryAnomaly": "Single bidder cartel pattern detected",
      "agency": "Municipal Corporation Jaipur",
      "vendor": "Vardhman Tech Infrastructures",
      "vendorGst": "32AABCV1029L1Z5",
      "status": "Recommended",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-24-1",
              "title": "Single bidder cartel pattern detected",
              "description": "Field inspection by State Cell flagged irregularity: Single bidder cartel pattern detected",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-24-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-24-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jan 2024",
          "sanctioned": "18 Feb 2024",
          "disbursed": "24 Mar 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-025",
      "workCode": "WS/WE25/24-25/00025",
      "title": "Construction of Open Gym & Children Recreational Park",
      "state": "West Bengal",
      "district": "Darjeeling",
      "constituency": "Darjeeling (WE-25)",
      "mpName": "Dr. S. Mukherjee",
      "mpHouse": "LS",
      "category": "Roads & Transport",
      "sanctionedAmount": 1625000,
      "sanctionedDisplay": "₹ 16.25 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 5,
      "agingDays": 150,
      "agingDisplay": "+150d",
      "riskScore": 94,
      "riskLevel": "critical",
      "primaryAnomaly": "Cost anomaly (2.2x rate schedule)",
      "agency": "APMC Division Darjeeling",
      "vendor": "National Highway Concessionaires",
      "vendorGst": "24AAACN4401F1ZX",
      "status": "Sanctioned",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-25-1",
              "title": "Cost anomaly",
              "description": "Field inspection by State Cell flagged irregularity: Cost anomaly (2.2x rate schedule)",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-25-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-25-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Mar 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "24 May 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-026",
      "workCode": "WS/TA26/23-24/00026",
      "title": "Rejuvenation & Deepening of Traditional Village Water Reservoir",
      "state": "Tamil Nadu",
      "district": "Tiruchirappalli",
      "constituency": "Tiruchirappalli (TA-26)",
      "mpName": "Su. Venkatesan",
      "mpHouse": "LS",
      "category": "Education & Tech",
      "sanctionedAmount": 4750000,
      "sanctionedDisplay": "₹ 47.50 L",
      "disbursedAmount": 2280000,
      "disbursedDisplay": "₹ 22.80 L",
      "disbursedPercent": 48,
      "spentAmount": 1368000,
      "progressPercent": 26,
      "agingDays": 167,
      "agingDisplay": "+167d",
      "riskScore": 76,
      "riskLevel": "high",
      "primaryAnomaly": "Premature advance payout prior to QC clearance",
      "agency": "School Education Department Tiruchirappalli",
      "vendor": "Pragati Green Energy Solutions",
      "vendorGst": "03AABCP8891G1Z6",
      "status": "Disbursed",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-26-1",
              "title": "Premature advance payout prior to QC clearance",
              "description": "Field inspection by State Cell flagged irregularity: Premature advance payout prior to QC clearance",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-26-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-26-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 May 2024",
          "sanctioned": "18 Jun 2024",
          "disbursed": "24 Jul 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-027",
      "workCode": "WS/KE27/25-26/00027",
      "title": "All-Weather Bituminous Road Overlay & Concrete Paver Shoulder",
      "state": "Kerala",
      "district": "Thiruvananthapuram",
      "constituency": "Thiruvananthapuram (KE-27)",
      "mpName": "Shashi Tharoor",
      "mpHouse": "LS",
      "category": "Healthcare",
      "sanctionedAmount": 9010000,
      "sanctionedDisplay": "₹ 90.10 L",
      "disbursedAmount": 4955500,
      "disbursedDisplay": "₹ 49.55 L",
      "disbursedPercent": 55,
      "spentAmount": 2973300,
      "progressPercent": 30,
      "agingDays": 184,
      "agingDisplay": "+184d",
      "riskScore": 95,
      "riskLevel": "critical",
      "primaryAnomaly": "Duplicate geo-coordinates detected with prior scheme",
      "agency": "Irrigation & Waterways Directorate Thiruvananthapuram",
      "vendor": "Deccan Builders & Engineers",
      "vendorGst": "21AABCD7781R1Z2",
      "status": "In Progress",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-27-1",
              "title": "Duplicate geo-coordinates detected with prior scheme",
              "description": "Field inspection by State Cell flagged irregularity: Duplicate geo-coordinates detected with prior scheme",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-27-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-27-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-028",
      "workCode": "WS/GU28/24-25/00028",
      "title": "Construction of Multi-Purpose Cyclone & Disaster Evacuation Hall",
      "state": "Gujarat",
      "district": "Vadodara",
      "constituency": "Vadodara (GU-28)",
      "mpName": "Hiren Patel",
      "mpHouse": "RS",
      "category": "Urban Amenities",
      "sanctionedAmount": 24600000,
      "sanctionedDisplay": "₹ 2.46 Cr",
      "disbursedAmount": 24600000,
      "disbursedDisplay": "₹ 2.46 Cr",
      "disbursedPercent": 100,
      "spentAmount": 23616000,
      "progressPercent": 100,
      "agingDays": 0,
      "agingDisplay": "0d",
      "riskScore": 68,
      "riskLevel": "medium",
      "primaryAnomaly": "Work progress delayed >180 days with dormant funds",
      "agency": "Zila Parishad Vadodara",
      "vendor": "Surya Solar Grid Systems",
      "vendorGst": "08AAACS5512K1ZT",
      "status": "Completed",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-28-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-28-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "Completed & Handed Over"
      }
  },
  {
      "id": "proj-029",
      "workCode": "WS/MA29/23-24/00029",
      "title": "Installation of Automated Solar Water ATM & Filtration Skid",
      "state": "Madhya Pradesh",
      "district": "Jabalpur",
      "constituency": "Jabalpur (MA-29)",
      "mpName": "Pragya Singh",
      "mpHouse": "LS",
      "category": "Flood Relief",
      "sanctionedAmount": 76650000,
      "sanctionedDisplay": "₹ 7.67 Cr",
      "disbursedAmount": 52888500,
      "disbursedDisplay": "₹ 5.29 Cr",
      "disbursedPercent": 69,
      "spentAmount": 31733100,
      "progressPercent": 38,
      "agingDays": 218,
      "agingDisplay": "+218d",
      "riskScore": 82,
      "riskLevel": "high",
      "primaryAnomaly": "Vendor concentration alert (5 works in 10 days)",
      "agency": "PWD Division 1 Jabalpur",
      "vendor": "Trident Watertech Solutions",
      "vendorGst": "07AAACT3321P1Z8",
      "status": "Stalled",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-29-1",
              "title": "Vendor concentration alert",
              "description": "Field inspection by State Cell flagged irregularity: Vendor concentration alert (5 works in 10 days)",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-29-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-29-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-030",
      "workCode": "WS/MA30/25-26/00030",
      "title": "Concrete Link Road Construction from Main Highway to Harijan Basti",
      "state": "Maharashtra",
      "district": "Solapur",
      "constituency": "Solapur (MA-30)",
      "mpName": "Arvind Sawant",
      "mpHouse": "LS",
      "category": "Community Infrastructure",
      "sanctionedAmount": 860000,
      "sanctionedDisplay": "₹ 8.60 L",
      "disbursedAmount": 653600,
      "disbursedDisplay": "₹ 6.54 L",
      "disbursedPercent": 76,
      "spentAmount": 392160,
      "progressPercent": 42,
      "agingDays": 235,
      "agingDisplay": "+235d",
      "riskScore": 90,
      "riskLevel": "critical",
      "primaryAnomaly": "Discrepancy in GSTR-3B turnover vs contract value",
      "agency": "Rural Dev Dept Solapur",
      "vendor": "Apex Infra Projects Ltd.",
      "vendorGst": "27AAACA9921D1Z4",
      "status": "Under Review",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-30-1",
              "title": "Discrepancy in GSTR-3B turnover vs contract value",
              "description": "Field inspection by State Cell flagged irregularity: Discrepancy in GSTR-3B turnover vs contract value",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-30-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-30-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jan 2024",
          "sanctioned": "18 Feb 2024",
          "disbursed": "24 Mar 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-031",
      "workCode": "WS/UT31/24-25/00031",
      "title": "Installation of 50kVA Solar Mini-Grid at Primary Health Centre",
      "state": "Uttar Pradesh",
      "district": "Kanpur Nagar",
      "constituency": "Kanpur Nagar (UT-31)",
      "mpName": "Smt. Aparna Sen",
      "mpHouse": "LS",
      "category": "Renewable Energy",
      "sanctionedAmount": 1895000,
      "sanctionedDisplay": "₹ 18.95 L",
      "disbursedAmount": 1572850,
      "disbursedDisplay": "₹ 15.73 L",
      "disbursedPercent": 83,
      "spentAmount": 943710,
      "progressPercent": 46,
      "agingDays": 252,
      "agingDisplay": "+252d",
      "riskScore": 18,
      "riskLevel": "low",
      "primaryAnomaly": "Asset functional with nominal documentation variance",
      "agency": "Municipal Corporation Kanpur Nagar",
      "vendor": "Sai Krupa Construction Co.",
      "vendorGst": "09BBCPR4412K1Z9",
      "status": "Under Investigation",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-31-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-31-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Mar 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "24 May 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-032",
      "workCode": "WS/KA32/23-24/00032",
      "title": "Construction of Community Anganwadi Center with Kitchen Garden",
      "state": "Karnataka",
      "district": "Mysore",
      "constituency": "Mysore (KA-32)",
      "mpName": "Tejaswi M.",
      "mpHouse": "RS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 3100000,
      "sanctionedDisplay": "₹ 31.00 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 0,
      "agingDays": 25,
      "agingDisplay": "+25d",
      "riskScore": 23,
      "riskLevel": "low",
      "primaryAnomaly": "Standard execution within statutory milestones",
      "agency": "APMC Division Mysore",
      "vendor": "Bharat Civil & Electric Works",
      "vendorGst": "29CCDEB1123M1Z2",
      "status": "Recommended",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-32-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-32-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 May 2024",
          "sanctioned": "18 Jun 2024",
          "disbursed": "24 Jul 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-033",
      "workCode": "WS/BI33/25-26/00033",
      "title": "High-Density Polyethylene Piped Drinking Water Network",
      "state": "Bihar",
      "district": "Gaya",
      "constituency": "Gaya (BI-33)",
      "mpName": "Ajay Kumar Rai",
      "mpHouse": "LS",
      "category": "Roads & Transport",
      "sanctionedAmount": 5590000,
      "sanctionedDisplay": "₹ 55.90 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 5,
      "agingDays": 286,
      "agingDisplay": "+286d",
      "riskScore": 56,
      "riskLevel": "medium",
      "primaryAnomaly": "Minor timeline delay (<45 days) due to monsoon",
      "agency": "School Education Department Gaya",
      "vendor": "Omkar Rural Enterprises",
      "vendorGst": "10DDGHK7781N1Z0",
      "status": "Sanctioned",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-33-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-33-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-034",
      "workCode": "WS/RA34/24-25/00034",
      "title": "Installation of High-Mast LED Lighting Towers in Market Yard",
      "state": "Rajasthan",
      "district": "Kota",
      "constituency": "Kota (RA-34)",
      "mpName": "Vikramaditya S.",
      "mpHouse": "LS",
      "category": "Education & Tech",
      "sanctionedAmount": 27300000,
      "sanctionedDisplay": "₹ 2.73 Cr",
      "disbursedAmount": 12558000,
      "disbursedDisplay": "₹ 1.26 Cr",
      "disbursedPercent": 46,
      "spentAmount": 7534800,
      "progressPercent": 25,
      "agingDays": 303,
      "agingDisplay": "+303d",
      "riskScore": 75,
      "riskLevel": "high",
      "primaryAnomaly": "Substandard foundation gravel gradation noted in audit",
      "agency": "Irrigation & Waterways Directorate Kota",
      "vendor": "Vardhman Tech Infrastructures",
      "vendorGst": "32AABCV1029L1Z5",
      "status": "Disbursed",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-34-1",
              "title": "Substandard foundation gravel gradation noted in audit",
              "description": "Field inspection by State Cell flagged irregularity: Substandard foundation gravel gradation noted in audit",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-34-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-34-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-035",
      "workCode": "WS/WE35/23-24/00035",
      "title": "Renovation & Upgrade of Government Higher Secondary Science Wing",
      "state": "West Bengal",
      "district": "Howrah",
      "constituency": "Howrah (WE-35)",
      "mpName": "Dr. S. Mukherjee",
      "mpHouse": "LS",
      "category": "Healthcare",
      "sanctionedAmount": 81750000,
      "sanctionedDisplay": "₹ 8.18 Cr",
      "disbursedAmount": 43327500,
      "disbursedDisplay": "₹ 4.33 Cr",
      "disbursedPercent": 53,
      "spentAmount": 25996500,
      "progressPercent": 29,
      "agingDays": 30,
      "agingDisplay": "+30d",
      "riskScore": 96,
      "riskLevel": "critical",
      "primaryAnomaly": "Inspection photo metadata indicates mismatched camera EXIF",
      "agency": "Zila Parishad Howrah",
      "vendor": "National Highway Concessionaires",
      "vendorGst": "24AAACN4401F1ZX",
      "status": "In Progress",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-35-1",
              "title": "Inspection photo metadata indicates mismatched camera EXIF",
              "description": "Field inspection by State Cell flagged irregularity: Inspection photo metadata indicates mismatched camera EXIF",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-35-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-35-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-036",
      "workCode": "WS/TA36/25-26/00036",
      "title": "Construction of Cattle Shed & Veterinary First-Aid Clinic",
      "state": "Tamil Nadu",
      "district": "Chennai",
      "constituency": "Chennai (TA-36)",
      "mpName": "Su. Venkatesan",
      "mpHouse": "RS",
      "category": "Urban Amenities",
      "sanctionedAmount": 662000,
      "sanctionedDisplay": "₹ 6.62 L",
      "disbursedAmount": 662000,
      "disbursedDisplay": "₹ 6.62 L",
      "disbursedPercent": 100,
      "spentAmount": 635520,
      "progressPercent": 100,
      "agingDays": 0,
      "agingDisplay": "0d",
      "riskScore": 87,
      "riskLevel": "high",
      "primaryAnomaly": "Single bidder cartel pattern detected",
      "agency": "PWD Division 1 Chennai",
      "vendor": "Pragati Green Energy Solutions",
      "vendorGst": "03AABCP8891G1Z6",
      "status": "Completed",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-36-1",
              "title": "Single bidder cartel pattern detected",
              "description": "Field inspection by State Cell flagged irregularity: Single bidder cartel pattern detected",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-36-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-36-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jan 2024",
          "sanctioned": "18 Feb 2024",
          "disbursed": "24 Mar 2024",
          "completionTarget": "Completed & Handed Over"
      }
  },
  {
      "id": "proj-037",
      "workCode": "WS/KE37/24-25/00037",
      "title": "Stormwater Masonry Drain & Culvert Construction Block C",
      "state": "Kerala",
      "district": "Kozhikode",
      "constituency": "Kozhikode (KE-37)",
      "mpName": "Shashi Tharoor",
      "mpHouse": "LS",
      "category": "Flood Relief",
      "sanctionedAmount": 2165000,
      "sanctionedDisplay": "₹ 21.65 L",
      "disbursedAmount": 1450550,
      "disbursedDisplay": "₹ 14.51 L",
      "disbursedPercent": 67,
      "spentAmount": 870330,
      "progressPercent": 37,
      "agingDays": 64,
      "agingDisplay": "+64d",
      "riskScore": 98,
      "riskLevel": "critical",
      "primaryAnomaly": "Cost anomaly (2.2x rate schedule)",
      "agency": "Rural Dev Dept Kozhikode",
      "vendor": "Deccan Builders & Engineers",
      "vendorGst": "21AABCD7781R1Z2",
      "status": "Stalled",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-37-1",
              "title": "Cost anomaly",
              "description": "Field inspection by State Cell flagged irregularity: Cost anomaly (2.2x rate schedule)",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-37-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-37-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Mar 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "24 May 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-038",
      "workCode": "WS/GU38/23-24/00038",
      "title": "Solar Rooftop Grid-Tied System at Block Development Office",
      "state": "Gujarat",
      "district": "Rajkot",
      "constituency": "Rajkot (GU-38)",
      "mpName": "Hiren Patel",
      "mpHouse": "LS",
      "category": "Community Infrastructure",
      "sanctionedAmount": 3550000,
      "sanctionedDisplay": "₹ 35.50 L",
      "disbursedAmount": 2627000,
      "disbursedDisplay": "₹ 26.27 L",
      "disbursedPercent": 74,
      "spentAmount": 1576200,
      "progressPercent": 41,
      "agingDays": 81,
      "agingDisplay": "+81d",
      "riskScore": 79,
      "riskLevel": "high",
      "primaryAnomaly": "Premature advance payout prior to QC clearance",
      "agency": "Municipal Corporation Rajkot",
      "vendor": "Surya Solar Grid Systems",
      "vendorGst": "08AAACS5512K1ZT",
      "status": "Under Review",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-38-1",
              "title": "Premature advance payout prior to QC clearance",
              "description": "Field inspection by State Cell flagged irregularity: Premature advance payout prior to QC clearance",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-38-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-38-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 May 2024",
          "sanctioned": "18 Jun 2024",
          "disbursed": "24 Jul 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-039",
      "workCode": "WS/MA39/25-26/00039",
      "title": "Digital Smart Classroom Setup with Interactive Display Boards",
      "state": "Madhya Pradesh",
      "district": "Indore",
      "constituency": "Indore (MA-39)",
      "mpName": "Pragya Singh",
      "mpHouse": "LS",
      "category": "Renewable Energy",
      "sanctionedAmount": 6370000,
      "sanctionedDisplay": "₹ 63.70 L",
      "disbursedAmount": 5159700,
      "disbursedDisplay": "₹ 51.60 L",
      "disbursedPercent": 81,
      "spentAmount": 3095820,
      "progressPercent": 45,
      "agingDays": 98,
      "agingDisplay": "+98d",
      "riskScore": 95,
      "riskLevel": "critical",
      "primaryAnomaly": "Duplicate geo-coordinates detected with prior scheme",
      "agency": "APMC Division Indore",
      "vendor": "Trident Watertech Solutions",
      "vendorGst": "07AAACT3321P1Z8",
      "status": "Under Investigation",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-39-1",
              "title": "Duplicate geo-coordinates detected with prior scheme",
              "description": "Field inspection by State Cell flagged irregularity: Duplicate geo-coordinates detected with prior scheme",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-39-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-39-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-040",
      "workCode": "WS/MA00/24-25/00040",
      "title": "Construction of Open Gym & Children Recreational Park",
      "state": "Maharashtra",
      "district": "Mumbai Suburban",
      "constituency": "Mumbai Suburban (MA-40)",
      "mpName": "Rahul Sharma",
      "mpHouse": "RS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 30000000,
      "sanctionedDisplay": "₹ 3.00 Cr",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 Cr",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 0,
      "agingDays": 25,
      "agingDisplay": "+25d",
      "riskScore": 53,
      "riskLevel": "medium",
      "primaryAnomaly": "Work progress delayed >180 days with dormant funds",
      "agency": "School Education Department Mumbai Suburban",
      "vendor": "Apex Infra Projects Ltd.",
      "vendorGst": "27AAACA9921D1Z4",
      "status": "Recommended",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-40-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-40-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-041",
      "workCode": "WS/UT01/23-24/00041",
      "title": "Rejuvenation & Deepening of Traditional Village Water Reservoir",
      "state": "Uttar Pradesh",
      "district": "Prayagraj",
      "constituency": "Prayagraj (UT-41)",
      "mpName": "Smt. Aparna Sen",
      "mpHouse": "LS",
      "category": "Roads & Transport",
      "sanctionedAmount": 86850000,
      "sanctionedDisplay": "₹ 8.69 Cr",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 Cr",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 5,
      "agingDays": 132,
      "agingDisplay": "+132d",
      "riskScore": 82,
      "riskLevel": "high",
      "primaryAnomaly": "Vendor concentration alert (5 works in 10 days)",
      "agency": "Irrigation & Waterways Directorate Prayagraj",
      "vendor": "Sai Krupa Construction Co.",
      "vendorGst": "09BBCPR4412K1Z9",
      "status": "Sanctioned",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-41-1",
              "title": "Vendor concentration alert",
              "description": "Field inspection by State Cell flagged irregularity: Vendor concentration alert (5 works in 10 days)",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-41-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-41-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-042",
      "workCode": "WS/KA02/25-26/00042",
      "title": "All-Weather Bituminous Road Overlay & Concrete Paver Shoulder",
      "state": "Karnataka",
      "district": "Hubli-Dharwad",
      "constituency": "Hubli-Dharwad (KA-42)",
      "mpName": "Tejaswi M.",
      "mpHouse": "LS",
      "category": "Education & Tech",
      "sanctionedAmount": 764000,
      "sanctionedDisplay": "₹ 7.64 L",
      "disbursedAmount": 336160,
      "disbursedDisplay": "₹ 3.36 L",
      "disbursedPercent": 44,
      "spentAmount": 201696,
      "progressPercent": 24,
      "agingDays": 149,
      "agingDisplay": "+149d",
      "riskScore": 90,
      "riskLevel": "critical",
      "primaryAnomaly": "Discrepancy in GSTR-3B turnover vs contract value",
      "agency": "Zila Parishad Hubli-Dharwad",
      "vendor": "Bharat Civil & Electric Works",
      "vendorGst": "29CCDEB1123M1Z2",
      "status": "Disbursed",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-42-1",
              "title": "Discrepancy in GSTR-3B turnover vs contract value",
              "description": "Field inspection by State Cell flagged irregularity: Discrepancy in GSTR-3B turnover vs contract value",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-42-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-42-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jan 2024",
          "sanctioned": "18 Feb 2024",
          "disbursed": "24 Mar 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-043",
      "workCode": "WS/BI03/24-25/00043",
      "title": "Construction of Multi-Purpose Cyclone & Disaster Evacuation Hall",
      "state": "Bihar",
      "district": "Darbhanga",
      "constituency": "Darbhanga (BI-43)",
      "mpName": "Ajay Kumar Rai",
      "mpHouse": "LS",
      "category": "Healthcare",
      "sanctionedAmount": 1485000,
      "sanctionedDisplay": "₹ 14.85 L",
      "disbursedAmount": 757350,
      "disbursedDisplay": "₹ 7.57 L",
      "disbursedPercent": 51,
      "spentAmount": 454410,
      "progressPercent": 28,
      "agingDays": 166,
      "agingDisplay": "+166d",
      "riskScore": 18,
      "riskLevel": "low",
      "primaryAnomaly": "Asset functional with nominal documentation variance",
      "agency": "PWD Division 1 Darbhanga",
      "vendor": "Omkar Rural Enterprises",
      "vendorGst": "10DDGHK7781N1Z0",
      "status": "In Progress",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-43-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-43-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Mar 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "24 May 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-044",
      "workCode": "WS/RA04/23-24/00044",
      "title": "Installation of Automated Solar Water ATM & Filtration Skid",
      "state": "Rajasthan",
      "district": "Jaipur",
      "constituency": "Jaipur (RA-44)",
      "mpName": "Vikramaditya S.",
      "mpHouse": "RS",
      "category": "Urban Amenities",
      "sanctionedAmount": 4000000,
      "sanctionedDisplay": "₹ 40.00 L",
      "disbursedAmount": 4000000,
      "disbursedDisplay": "₹ 40.00 L",
      "disbursedPercent": 100,
      "spentAmount": 3840000,
      "progressPercent": 100,
      "agingDays": 0,
      "agingDisplay": "0d",
      "riskScore": 25,
      "riskLevel": "low",
      "primaryAnomaly": "Standard execution within statutory milestones",
      "agency": "Rural Dev Dept Jaipur",
      "vendor": "Vardhman Tech Infrastructures",
      "vendorGst": "32AABCV1029L1Z5",
      "status": "Completed",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-44-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-44-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 May 2024",
          "sanctioned": "18 Jun 2024",
          "disbursed": "24 Jul 2024",
          "completionTarget": "Completed & Handed Over"
      }
  },
  {
      "id": "proj-045",
      "workCode": "WS/WE05/25-26/00045",
      "title": "Concrete Link Road Construction from Main Highway to Harijan Basti",
      "state": "West Bengal",
      "district": "Darjeeling",
      "constituency": "Darjeeling (WE-45)",
      "mpName": "Dr. S. Mukherjee",
      "mpHouse": "LS",
      "category": "Flood Relief",
      "sanctionedAmount": 7150000,
      "sanctionedDisplay": "₹ 71.50 L",
      "disbursedAmount": 4647500,
      "disbursedDisplay": "₹ 46.48 L",
      "disbursedPercent": 65,
      "spentAmount": 2788500,
      "progressPercent": 36,
      "agingDays": 200,
      "agingDisplay": "+200d",
      "riskScore": 58,
      "riskLevel": "medium",
      "primaryAnomaly": "Minor timeline delay (<45 days) due to monsoon",
      "agency": "Municipal Corporation Darjeeling",
      "vendor": "National Highway Concessionaires",
      "vendorGst": "24AAACN4401F1ZX",
      "status": "Stalled",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-45-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-45-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-046",
      "workCode": "WS/TA06/24-25/00046",
      "title": "Installation of 50kVA Solar Mini-Grid at Primary Health Centre",
      "state": "Tamil Nadu",
      "district": "Tiruchirappalli",
      "constituency": "Tiruchirappalli (TA-46)",
      "mpName": "Su. Venkatesan",
      "mpHouse": "LS",
      "category": "Community Infrastructure",
      "sanctionedAmount": 32700000,
      "sanctionedDisplay": "₹ 3.27 Cr",
      "disbursedAmount": 23544000,
      "disbursedDisplay": "₹ 2.35 Cr",
      "disbursedPercent": 72,
      "spentAmount": 14126400,
      "progressPercent": 40,
      "agingDays": 217,
      "agingDisplay": "+217d",
      "riskScore": 78,
      "riskLevel": "high",
      "primaryAnomaly": "Substandard foundation gravel gradation noted in audit",
      "agency": "APMC Division Tiruchirappalli",
      "vendor": "Pragati Green Energy Solutions",
      "vendorGst": "03AABCP8891G1Z6",
      "status": "Under Review",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-46-1",
              "title": "Substandard foundation gravel gradation noted in audit",
              "description": "Field inspection by State Cell flagged irregularity: Substandard foundation gravel gradation noted in audit",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-46-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-46-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-047",
      "workCode": "WS/KE07/23-24/00047",
      "title": "Construction of Community Anganwadi Center with Kitchen Garden",
      "state": "Kerala",
      "district": "Thrissur",
      "constituency": "Thrissur (KE-47)",
      "mpName": "Shashi Tharoor",
      "mpHouse": "LS",
      "category": "Renewable Energy",
      "sanctionedAmount": 91950000,
      "sanctionedDisplay": "₹ 9.20 Cr",
      "disbursedAmount": 72640500,
      "disbursedDisplay": "₹ 7.26 Cr",
      "disbursedPercent": 79,
      "spentAmount": 43584300,
      "progressPercent": 43,
      "agingDays": 234,
      "agingDisplay": "+234d",
      "riskScore": 96,
      "riskLevel": "critical",
      "primaryAnomaly": "Inspection photo metadata indicates mismatched camera EXIF",
      "agency": "School Education Department Thrissur",
      "vendor": "Deccan Builders & Engineers",
      "vendorGst": "21AABCD7781R1Z2",
      "status": "Under Investigation",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-47-1",
              "title": "Inspection photo metadata indicates mismatched camera EXIF",
              "description": "Field inspection by State Cell flagged irregularity: Inspection photo metadata indicates mismatched camera EXIF",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-47-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-47-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-048",
      "workCode": "WS/GU08/25-26/00048",
      "title": "High-Density Polyethylene Piped Drinking Water Network",
      "state": "Gujarat",
      "district": "Surat",
      "constituency": "Surat (GU-48)",
      "mpName": "Hiren Patel",
      "mpHouse": "RS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 866000,
      "sanctionedDisplay": "₹ 8.66 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 0,
      "agingDays": 25,
      "agingDisplay": "+25d",
      "riskScore": 79,
      "riskLevel": "high",
      "primaryAnomaly": "Single bidder cartel pattern detected",
      "agency": "Irrigation & Waterways Directorate Surat",
      "vendor": "Surya Solar Grid Systems",
      "vendorGst": "08AAACS5512K1ZT",
      "status": "Recommended",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-48-1",
              "title": "Single bidder cartel pattern detected",
              "description": "Field inspection by State Cell flagged irregularity: Single bidder cartel pattern detected",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-48-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-48-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jan 2024",
          "sanctioned": "18 Feb 2024",
          "disbursed": "24 Mar 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-049",
      "workCode": "WS/MA09/24-25/00049",
      "title": "Installation of High-Mast LED Lighting Towers in Market Yard",
      "state": "Madhya Pradesh",
      "district": "Gwalior",
      "constituency": "Gwalior (MA-49)",
      "mpName": "Pragya Singh",
      "mpHouse": "LS",
      "category": "Roads & Transport",
      "sanctionedAmount": 1755000,
      "sanctionedDisplay": "₹ 17.55 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 5,
      "agingDays": 268,
      "agingDisplay": "+268d",
      "riskScore": 94,
      "riskLevel": "critical",
      "primaryAnomaly": "Cost anomaly (2.2x rate schedule)",
      "agency": "Zila Parishad Gwalior",
      "vendor": "Trident Watertech Solutions",
      "vendorGst": "07AAACT3321P1Z8",
      "status": "Sanctioned",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-49-1",
              "title": "Cost anomaly",
              "description": "Field inspection by State Cell flagged irregularity: Cost anomaly (2.2x rate schedule)",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-49-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-49-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Mar 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "24 May 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-050",
      "workCode": "WS/MA10/23-24/00050",
      "title": "Renovation & Upgrade of Government Higher Secondary Science Wing",
      "state": "Maharashtra",
      "district": "Solapur",
      "constituency": "Solapur (MA-50)",
      "mpName": "Supriya Sule",
      "mpHouse": "LS",
      "category": "Education & Tech",
      "sanctionedAmount": 4450000,
      "sanctionedDisplay": "₹ 44.50 L",
      "disbursedAmount": 1869000,
      "disbursedDisplay": "₹ 18.69 L",
      "disbursedPercent": 42,
      "spentAmount": 1121400,
      "progressPercent": 23,
      "agingDays": 285,
      "agingDisplay": "+285d",
      "riskScore": 82,
      "riskLevel": "high",
      "primaryAnomaly": "Premature advance payout prior to QC clearance",
      "agency": "PWD Division 1 Solapur",
      "vendor": "Apex Infra Projects Ltd.",
      "vendorGst": "27AAACA9921D1Z4",
      "status": "Disbursed",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-50-1",
              "title": "Premature advance payout prior to QC clearance",
              "description": "Field inspection by State Cell flagged irregularity: Premature advance payout prior to QC clearance",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-50-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-50-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 May 2024",
          "sanctioned": "18 Jun 2024",
          "disbursed": "24 Jul 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-051",
      "workCode": "WS/UT11/25-26/00051",
      "title": "Construction of Cattle Shed & Veterinary First-Aid Clinic",
      "state": "Uttar Pradesh",
      "district": "Kanpur Nagar",
      "constituency": "Kanpur Nagar (UT-51)",
      "mpName": "Smt. Aparna Sen",
      "mpHouse": "LS",
      "category": "Healthcare",
      "sanctionedAmount": 7930000,
      "sanctionedDisplay": "₹ 79.30 L",
      "disbursedAmount": 3885700,
      "disbursedDisplay": "₹ 38.86 L",
      "disbursedPercent": 49,
      "spentAmount": 2331420,
      "progressPercent": 27,
      "agingDays": 302,
      "agingDisplay": "+302d",
      "riskScore": 95,
      "riskLevel": "critical",
      "primaryAnomaly": "Duplicate geo-coordinates detected with prior scheme",
      "agency": "Rural Dev Dept Kanpur Nagar",
      "vendor": "Sai Krupa Construction Co.",
      "vendorGst": "09BBCPR4412K1Z9",
      "status": "In Progress",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-51-1",
              "title": "Duplicate geo-coordinates detected with prior scheme",
              "description": "Field inspection by State Cell flagged irregularity: Duplicate geo-coordinates detected with prior scheme",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-51-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-51-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-052",
      "workCode": "WS/KA12/24-25/00052",
      "title": "Stormwater Masonry Drain & Culvert Construction Block C",
      "state": "Karnataka",
      "district": "Mysore",
      "constituency": "Mysore (KA-52)",
      "mpName": "Tejaswi M.",
      "mpHouse": "RS",
      "category": "Urban Amenities",
      "sanctionedAmount": 35400000,
      "sanctionedDisplay": "₹ 3.54 Cr",
      "disbursedAmount": 35400000,
      "disbursedDisplay": "₹ 3.54 Cr",
      "disbursedPercent": 100,
      "spentAmount": 33984000,
      "progressPercent": 100,
      "agingDays": 0,
      "agingDisplay": "0d",
      "riskScore": 55,
      "riskLevel": "medium",
      "primaryAnomaly": "Work progress delayed >180 days with dormant funds",
      "agency": "Municipal Corporation Mysore",
      "vendor": "Bharat Civil & Electric Works",
      "vendorGst": "29CCDEB1123M1Z2",
      "status": "Completed",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-52-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-52-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "Completed & Handed Over"
      }
  },
  {
      "id": "proj-053",
      "workCode": "WS/BI13/23-24/00053",
      "title": "Solar Rooftop Grid-Tied System at Block Development Office",
      "state": "Bihar",
      "district": "Gaya",
      "constituency": "Gaya (BI-53)",
      "mpName": "Ajay Kumar Rai",
      "mpHouse": "LS",
      "category": "Flood Relief",
      "sanctionedAmount": 52050000,
      "sanctionedDisplay": "₹ 5.21 Cr",
      "disbursedAmount": 32791500,
      "disbursedDisplay": "₹ 3.28 Cr",
      "disbursedPercent": 63,
      "spentAmount": 19674900,
      "progressPercent": 35,
      "agingDays": 46,
      "agingDisplay": "+46d",
      "riskScore": 82,
      "riskLevel": "high",
      "primaryAnomaly": "Vendor concentration alert (5 works in 10 days)",
      "agency": "APMC Division Gaya",
      "vendor": "Omkar Rural Enterprises",
      "vendorGst": "10DDGHK7781N1Z0",
      "status": "Stalled",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-53-1",
              "title": "Vendor concentration alert",
              "description": "Field inspection by State Cell flagged irregularity: Vendor concentration alert (5 works in 10 days)",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-53-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-53-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-054",
      "workCode": "WS/RA14/25-26/00054",
      "title": "Digital Smart Classroom Setup with Interactive Display Boards",
      "state": "Rajasthan",
      "district": "Kota",
      "constituency": "Kota (RA-54)",
      "mpName": "Vikramaditya S.",
      "mpHouse": "LS",
      "category": "Community Infrastructure",
      "sanctionedAmount": 668000,
      "sanctionedDisplay": "₹ 6.68 L",
      "disbursedAmount": 467600,
      "disbursedDisplay": "₹ 4.68 L",
      "disbursedPercent": 70,
      "spentAmount": 280560,
      "progressPercent": 39,
      "agingDays": 63,
      "agingDisplay": "+63d",
      "riskScore": 90,
      "riskLevel": "critical",
      "primaryAnomaly": "Discrepancy in GSTR-3B turnover vs contract value",
      "agency": "School Education Department Kota",
      "vendor": "Vardhman Tech Infrastructures",
      "vendorGst": "32AABCV1029L1Z5",
      "status": "Under Review",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-54-1",
              "title": "Discrepancy in GSTR-3B turnover vs contract value",
              "description": "Field inspection by State Cell flagged irregularity: Discrepancy in GSTR-3B turnover vs contract value",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-54-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-54-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jan 2024",
          "sanctioned": "18 Feb 2024",
          "disbursed": "24 Mar 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-055",
      "workCode": "WS/WE15/24-25/00055",
      "title": "Construction of Open Gym & Children Recreational Park",
      "state": "West Bengal",
      "district": "Howrah",
      "constituency": "Howrah (WE-55)",
      "mpName": "Dr. S. Mukherjee",
      "mpHouse": "LS",
      "category": "Renewable Energy",
      "sanctionedAmount": 2025000,
      "sanctionedDisplay": "₹ 20.25 L",
      "disbursedAmount": 1559250,
      "disbursedDisplay": "₹ 15.59 L",
      "disbursedPercent": 77,
      "spentAmount": 935550,
      "progressPercent": 42,
      "agingDays": 80,
      "agingDisplay": "+80d",
      "riskScore": 18,
      "riskLevel": "low",
      "primaryAnomaly": "Asset functional with nominal documentation variance",
      "agency": "Irrigation & Waterways Directorate Howrah",
      "vendor": "National Highway Concessionaires",
      "vendorGst": "24AAACN4401F1ZX",
      "status": "Under Investigation",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-55-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-55-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Mar 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "24 May 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-056",
      "workCode": "WS/TA16/23-24/00056",
      "title": "Rejuvenation & Deepening of Traditional Village Water Reservoir",
      "state": "Tamil Nadu",
      "district": "Chennai",
      "constituency": "Chennai (TA-56)",
      "mpName": "Su. Venkatesan",
      "mpHouse": "RS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 2800000,
      "sanctionedDisplay": "₹ 28.00 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 0,
      "agingDays": 25,
      "agingDisplay": "+25d",
      "riskScore": 27,
      "riskLevel": "low",
      "primaryAnomaly": "Standard execution within statutory milestones",
      "agency": "Zila Parishad Chennai",
      "vendor": "Pragati Green Energy Solutions",
      "vendorGst": "03AABCP8891G1Z6",
      "status": "Recommended",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-56-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-56-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 May 2024",
          "sanctioned": "18 Jun 2024",
          "disbursed": "24 Jul 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-057",
      "workCode": "WS/KE17/25-26/00057",
      "title": "All-Weather Bituminous Road Overlay & Concrete Paver Shoulder",
      "state": "Kerala",
      "district": "Thiruvananthapuram",
      "constituency": "Thiruvananthapuram (KE-57)",
      "mpName": "Shashi Tharoor",
      "mpHouse": "LS",
      "category": "Roads & Transport",
      "sanctionedAmount": 8710000,
      "sanctionedDisplay": "₹ 87.10 L",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 L",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 5,
      "agingDays": 114,
      "agingDisplay": "+114d",
      "riskScore": 43,
      "riskLevel": "medium",
      "primaryAnomaly": "Minor timeline delay (<45 days) due to monsoon",
      "agency": "PWD Division 1 Thiruvananthapuram",
      "vendor": "Deccan Builders & Engineers",
      "vendorGst": "21AABCD7781R1Z2",
      "status": "Sanctioned",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-57-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-57-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-058",
      "workCode": "WS/GU18/24-25/00058",
      "title": "Construction of Multi-Purpose Cyclone & Disaster Evacuation Hall",
      "state": "Gujarat",
      "district": "Vadodara",
      "constituency": "Vadodara (GU-58)",
      "mpName": "Hiren Patel",
      "mpHouse": "LS",
      "category": "Education & Tech",
      "sanctionedAmount": 38100000,
      "sanctionedDisplay": "₹ 3.81 Cr",
      "disbursedAmount": 15240000,
      "disbursedDisplay": "₹ 1.52 Cr",
      "disbursedPercent": 40,
      "spentAmount": 9144000,
      "progressPercent": 22,
      "agingDays": 131,
      "agingDisplay": "+131d",
      "riskScore": 81,
      "riskLevel": "high",
      "primaryAnomaly": "Substandard foundation gravel gradation noted in audit",
      "agency": "Rural Dev Dept Vadodara",
      "vendor": "Surya Solar Grid Systems",
      "vendorGst": "08AAACS5512K1ZT",
      "status": "Disbursed",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-58-1",
              "title": "Substandard foundation gravel gradation noted in audit",
              "description": "Field inspection by State Cell flagged irregularity: Substandard foundation gravel gradation noted in audit",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-58-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-58-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-059",
      "workCode": "WS/MA19/23-24/00059",
      "title": "Installation of Automated Solar Water ATM & Filtration Skid",
      "state": "Madhya Pradesh",
      "district": "Jabalpur",
      "constituency": "Jabalpur (MA-59)",
      "mpName": "Pragya Singh",
      "mpHouse": "LS",
      "category": "Healthcare",
      "sanctionedAmount": 57150000,
      "sanctionedDisplay": "₹ 5.71 Cr",
      "disbursedAmount": 26860500,
      "disbursedDisplay": "₹ 2.69 Cr",
      "disbursedPercent": 47,
      "spentAmount": 16116300,
      "progressPercent": 26,
      "agingDays": 148,
      "agingDisplay": "+148d",
      "riskScore": 96,
      "riskLevel": "critical",
      "primaryAnomaly": "Inspection photo metadata indicates mismatched camera EXIF",
      "agency": "Municipal Corporation Jabalpur",
      "vendor": "Trident Watertech Solutions",
      "vendorGst": "07AAACT3321P1Z8",
      "status": "In Progress",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-59-1",
              "title": "Inspection photo metadata indicates mismatched camera EXIF",
              "description": "Field inspection by State Cell flagged irregularity: Inspection photo metadata indicates mismatched camera EXIF",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-59-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-59-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-060",
      "workCode": "WS/MA20/25-26/00060",
      "title": "Concrete Link Road Construction from Main Highway to Harijan Basti",
      "state": "Maharashtra",
      "district": "Mumbai Suburban",
      "constituency": "Mumbai Suburban (MA-60)",
      "mpName": "Arvind Sawant",
      "mpHouse": "RS",
      "category": "Urban Amenities",
      "sanctionedAmount": 770000,
      "sanctionedDisplay": "₹ 7.70 L",
      "disbursedAmount": 770000,
      "disbursedDisplay": "₹ 7.70 L",
      "disbursedPercent": 100,
      "spentAmount": 739200,
      "progressPercent": 100,
      "agingDays": 0,
      "agingDisplay": "0d",
      "riskScore": 82,
      "riskLevel": "high",
      "primaryAnomaly": "Single bidder cartel pattern detected",
      "agency": "APMC Division Mumbai Suburban",
      "vendor": "Apex Infra Projects Ltd.",
      "vendorGst": "27AAACA9921D1Z4",
      "status": "Completed",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-60-1",
              "title": "Single bidder cartel pattern detected",
              "description": "Field inspection by State Cell flagged irregularity: Single bidder cartel pattern detected",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-60-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-60-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jan 2024",
          "sanctioned": "18 Feb 2024",
          "disbursed": "24 Mar 2024",
          "completionTarget": "Completed & Handed Over"
      }
  },
  {
      "id": "proj-061",
      "workCode": "WS/UT21/24-25/00061",
      "title": "Installation of 50kVA Solar Mini-Grid at Primary Health Centre",
      "state": "Uttar Pradesh",
      "district": "Prayagraj",
      "constituency": "Prayagraj (UT-61)",
      "mpName": "Smt. Aparna Sen",
      "mpHouse": "LS",
      "category": "Flood Relief",
      "sanctionedAmount": 2295000,
      "sanctionedDisplay": "₹ 22.95 L",
      "disbursedAmount": 1399950,
      "disbursedDisplay": "₹ 14.00 L",
      "disbursedPercent": 61,
      "spentAmount": 839970,
      "progressPercent": 34,
      "agingDays": 182,
      "agingDisplay": "+182d",
      "riskScore": 98,
      "riskLevel": "critical",
      "primaryAnomaly": "Cost anomaly (2.2x rate schedule)",
      "agency": "School Education Department Prayagraj",
      "vendor": "Sai Krupa Construction Co.",
      "vendorGst": "09BBCPR4412K1Z9",
      "status": "Stalled",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 24-25.",
      "violations": [
          {
              "id": "viol-61-1",
              "title": "Cost anomaly",
              "description": "Field inspection by State Cell flagged irregularity: Cost anomaly (2.2x rate schedule)",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-61-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-61-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Mar 2024",
          "sanctioned": "18 Apr 2024",
          "disbursed": "24 May 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-062",
      "workCode": "WS/KA22/23-24/00062",
      "title": "Construction of Community Anganwadi Center with Kitchen Garden",
      "state": "Karnataka",
      "district": "Hubli-Dharwad",
      "constituency": "Hubli-Dharwad (KA-62)",
      "mpName": "Tejaswi M.",
      "mpHouse": "LS",
      "category": "Community Infrastructure",
      "sanctionedAmount": 3250000,
      "sanctionedDisplay": "₹ 32.50 L",
      "disbursedAmount": 2210000,
      "disbursedDisplay": "₹ 22.10 L",
      "disbursedPercent": 68,
      "spentAmount": 1326000,
      "progressPercent": 37,
      "agingDays": 199,
      "agingDisplay": "+199d",
      "riskScore": 85,
      "riskLevel": "high",
      "primaryAnomaly": "Premature advance payout prior to QC clearance",
      "agency": "Irrigation & Waterways Directorate Hubli-Dharwad",
      "vendor": "Bharat Civil & Electric Works",
      "vendorGst": "29CCDEB1123M1Z2",
      "status": "Under Review",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-62-1",
              "title": "Premature advance payout prior to QC clearance",
              "description": "Field inspection by State Cell flagged irregularity: Premature advance payout prior to QC clearance",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-62-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-62-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 May 2024",
          "sanctioned": "18 Jun 2024",
          "disbursed": "24 Jul 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-063",
      "workCode": "WS/BI23/25-26/00063",
      "title": "High-Density Polyethylene Piped Drinking Water Network",
      "state": "Bihar",
      "district": "Darbhanga",
      "constituency": "Darbhanga (BI-63)",
      "mpName": "Ajay Kumar Rai",
      "mpHouse": "LS",
      "category": "Renewable Energy",
      "sanctionedAmount": 9490000,
      "sanctionedDisplay": "₹ 94.90 L",
      "disbursedAmount": 7117500,
      "disbursedDisplay": "₹ 71.17 L",
      "disbursedPercent": 75,
      "spentAmount": 4270500,
      "progressPercent": 41,
      "agingDays": 216,
      "agingDisplay": "+216d",
      "riskScore": 95,
      "riskLevel": "critical",
      "primaryAnomaly": "Duplicate geo-coordinates detected with prior scheme",
      "agency": "Zila Parishad Darbhanga",
      "vendor": "Omkar Rural Enterprises",
      "vendorGst": "10DDGHK7781N1Z0",
      "status": "Under Investigation",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 25-26.",
      "violations": [
          {
              "id": "viol-63-1",
              "title": "Duplicate geo-coordinates detected with prior scheme",
              "description": "Field inspection by State Cell flagged irregularity: Duplicate geo-coordinates detected with prior scheme",
              "severity": "critical"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-63-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-63-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Jul 2024",
          "sanctioned": "18 Aug 2024",
          "disbursed": "24 Sep 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-064",
      "workCode": "WS/RA24/24-25/00064",
      "title": "Installation of High-Mast LED Lighting Towers in Market Yard",
      "state": "Rajasthan",
      "district": "Jaipur",
      "constituency": "Jaipur (RA-64)",
      "mpName": "Vikramaditya S.",
      "mpHouse": "RS",
      "category": "Water & Sanitation",
      "sanctionedAmount": 40800000,
      "sanctionedDisplay": "₹ 4.08 Cr",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 Cr",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 0,
      "agingDays": 25,
      "agingDisplay": "+25d",
      "riskScore": 57,
      "riskLevel": "medium",
      "primaryAnomaly": "Work progress delayed >180 days with dormant funds",
      "agency": "PWD Division 1 Jaipur",
      "vendor": "Vardhman Tech Infrastructures",
      "vendorGst": "32AABCV1029L1Z5",
      "status": "Recommended",
      "violations": [],
      "recommendedActions": [
          {
              "id": "act-64-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-64-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Sep 2024",
          "sanctioned": "18 Oct 2024",
          "disbursed": "24 Nov 2024",
          "completionTarget": "31 Mar 2025"
      }
  },
  {
      "id": "proj-065",
      "workCode": "WS/WE25/23-24/00065",
      "title": "Renovation & Upgrade of Government Higher Secondary Science Wing",
      "state": "West Bengal",
      "district": "Darjeeling",
      "constituency": "Darjeeling (WE-65)",
      "mpName": "Dr. S. Mukherjee",
      "mpHouse": "LS",
      "category": "Roads & Transport",
      "sanctionedAmount": 62250000,
      "sanctionedDisplay": "₹ 6.22 Cr",
      "disbursedAmount": 0,
      "disbursedDisplay": "₹ 0.00 Cr",
      "disbursedPercent": 0,
      "spentAmount": 0,
      "progressPercent": 5,
      "agingDays": 250,
      "agingDisplay": "+250d",
      "riskScore": 82,
      "riskLevel": "high",
      "primaryAnomaly": "Vendor concentration alert (5 works in 10 days)",
      "agency": "Rural Dev Dept Darjeeling",
      "vendor": "National Highway Concessionaires",
      "vendorGst": "24AAACN4401F1ZX",
      "status": "Sanctioned",
      "financialExecutionWarning": "Audit observation logged under statutory inspection cycle FY 23-24.",
      "violations": [
          {
              "id": "viol-65-1",
              "title": "Vendor concentration alert",
              "description": "Field inspection by State Cell flagged irregularity: Vendor concentration alert (5 works in 10 days)",
              "severity": "high"
          }
      ],
      "recommendedActions": [
          {
              "id": "act-65-1",
              "label": "Reconcile PFMS electronic bank transaction ledger",
              "checked": true
          },
          {
              "id": "act-65-2",
              "label": "Verify geo-tagged physical milestone completion",
              "checked": false
          }
      ],
      "evidenceImages": [],
      "timeline": {
          "recommended": "10 Nov 2024",
          "sanctioned": "18 Dec 2024",
          "disbursed": "24 Jan 2024",
          "completionTarget": "31 Mar 2025"
      }
  }
]
