export const summaryData = {
  totalLGUs: 1634,
  highRisk: 312,
  avgRisk: 54.7,
  critical: 78,
}

export const riskTrendData = [
  { year: '2019', value: 42 },
  { year: '2020', value: 45 },
  { year: '2021', value: 48 },
  { year: '2022', value: 52 },
  { year: '2023', value: 54 },
]

export const riskDistributionData = [
  { name: 'Critical', value: 78 },
  { name: 'High', value: 312 },
  { name: 'Medium', value: 820 },
  { name: 'Low', value: 424 },
]

export const topLGUs = [
  {
    rank: 1,
    name: 'Sta. Catalina',
    province: 'Negros Oriental',
    riskScore: 94,
    riskLevel: 'Critical',
  },
  {
    rank: 2,
    name: 'San Isidro',
    province: 'Northern Samar',
    riskScore: 91,
    riskLevel: 'Critical',
  },
  {
    rank: 3,
    name: 'Magsaysay',
    province: 'Davao del Sur',
    riskScore: 89,
    riskLevel: 'High',
  },
  {
    rank: 4,
    name: 'Balabac',
    province: 'Palawan',
    riskScore: 86,
    riskLevel: 'High',
  },
  {
    rank: 5,
    name: 'Tandag',
    province: 'Surigao del Sur',
    riskScore: 84,
    riskLevel: 'High',
  },
  {
    rank: 6,
    name: 'Baler',
    province: 'Aurora',
    riskScore: 78,
    riskLevel: 'High',
  },
  {
    rank: 7,
    name: 'Culion',
    province: 'Palawan',
    riskScore: 74,
    riskLevel: 'Medium',
  },
  {
    rank: 8,
    name: 'Gubat',
    province: 'Sorsogon',
    riskScore: 71,
    riskLevel: 'Medium',
  },
  {
    rank: 9,
    name: 'Dapa',
    province: 'Surigao del Norte',
    riskScore: 68,
    riskLevel: 'Medium',
  },
  {
    rank: 10,
    name: 'Kalibo',
    province: 'Aklan',
    riskScore: 64,
    riskLevel: 'Medium',
  },
]

export const lguDetails = {
  name: 'Sta. Catalina',
  riskScore: 94,
  factors: {
    singleBidRate: 0.78,
    repeatFindings: 0.65,
    supplierConcentration: 0.84,
  },
}

//Mock data for LGU Audit

export const auditLogs = [
  {
    timestamp: "2025-05-25 10:45:12",
    logId: "LOG-0001",
    city: "Manila",
    action: "Procurement Created",
    details: "New procurement entry recorded (Ref No: PR-2025-0045, Amount: ₱12,400,000, Supplier: ABC Infrastructure Corp)",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 10:42:33",
    logId: "LOG-0002",
    city: "Manila",
    action: "Risk Score Updated",
    details: "Risk score increased from 68 to 72 following addition of high-value procurement",
    riskLevel: "High"
  },
  {
    timestamp: "2025-05-25 10:40:10",
    logId: "LOG-0003",
    city: "Manila",
    action: "Risk Explanation Generated",
    details: "Automated explanation generated for updated procurement risk profile",
    riskLevel: "High"
  },
  {
    timestamp: "2025-05-25 10:35:27",
    logId: "LOG-0004",
    city: "Quezon City",
    action: "Procurement Updated",
    details: "Contract amount revised (Ref No: PR-2025-0032) from ₱9,800,000 to ₱11,200,000",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 10:30:18",
    logId: "LOG-0005",
    city: "Quezon City",
    action: "Risk Score Updated",
    details: "Risk score adjusted from 58 to 62 due to increase in total procurement value",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 10:28:05",
    logId: "LOG-0006",
    city: "Makati",
    action: "Procurement Deleted",
    details: "Duplicate procurement record removed (Ref No: PR-2025-0021)",
    riskLevel: "Low"
  },
  {
    timestamp: "2025-05-25 10:20:44",
    logId: "LOG-0007",
    city: "Pasig",
    action: "LGU Record Updated",
    details: "LGU profile updated to reflect revised population and budget allocation data",
    riskLevel: "Low"
  },
  {
    timestamp: "2025-05-25 10:15:11",
    logId: "LOG-0008",
    city: "Pasig",
    action: "Risk Score Updated",
    details: "Risk score increased from 48 to 55 following addition of new procurement records",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 10:10:39",
    logId: "LOG-0009",
    city: "Taguig",
    action: "Procurement Created",
    details: "New procurement recorded (Ref No: PR-2025-0018, Amount: ₱6,500,000, Supplier: UrbanBuild Co.)",
    riskLevel: "Low"
  },
  {
    timestamp: "2025-05-25 10:05:22",
    logId: "LOG-0010",
    city: "Taguig",
    action: "Risk Score Updated",
    details: "Risk score adjusted from 42 to 46 based on recent procurement activity",
    riskLevel: "Low"
  },
  {
    timestamp: "2025-05-25 09:58:17",
    logId: "LOG-0011",
    city: "Caloocan",
    action: "Procurement Created",
    details: "High-value procurement recorded (Ref No: PR-2025-0050, Amount: ₱18,700,000, Supplier: Prime Logistics Inc.)",
    riskLevel: "High"
  },
  {
    timestamp: "2025-05-25 09:55:02",
    logId: "LOG-0012",
    city: "Caloocan",
    action: "Risk Score Updated",
    details: "Risk score increased from 66 to 74 due to significant procurement spike",
    riskLevel: "High"
  },
  {
    timestamp: "2025-05-25 09:50:44",
    logId: "LOG-0013",
    city: "Pasay",
    action: "Procurement Updated",
    details: "Supplier changed (Ref No: PR-2025-0029) from MetroTrade Inc. to Apex Builders Corp.",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 09:45:30",
    logId: "LOG-0014",
    city: "Pasay",
    action: "Risk Score Updated",
    details: "Risk score increased from 59 to 61 due to supplier concentration",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 09:40:11",
    logId: "LOG-0015",
    city: "Marikina",
    action: "Procurement Created",
    details: "Procurement entry added (Ref No: PR-2025-0012, Amount: ₱3,200,000, Supplier: GreenField Supplies)",
    riskLevel: "Low"
  },
  {
    timestamp: "2025-05-25 09:35:05",
    logId: "LOG-0016",
    city: "Marikina",
    action: "Risk Explanation Generated",
    details: "System generated explanation for stable procurement and low-risk profile",
    riskLevel: "Low"
  },
  {
    timestamp: "2025-05-25 09:30:49",
    logId: "LOG-0017",
    city: "Mandaluyong",
    action: "Procurement Created",
    details: "Procurement recorded (Ref No: PR-2025-0037, Amount: ₱7,900,000, Supplier: CityWorks Ltd.)",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 09:25:14",
    logId: "LOG-0018",
    city: "Mandaluyong",
    action: "Risk Score Updated",
    details: "Risk score increased from 52 to 60 due to multiple mid-value procurement entries",
    riskLevel: "Medium"
  },
  {
    timestamp: "2025-05-25 09:20:33",
    logId: "LOG-0019",
    city: "Parañaque",
    action: "Procurement Updated",
    details: "Procurement status updated (Ref No: PR-2025-0024) from Pending to Completed",
    riskLevel: "Low"
  },
  {
    timestamp: "2025-05-25 09:15:08",
    logId: "LOG-0020",
    city: "Parañaque",
    action: "Risk Score Updated",
    details: "Risk score remains at 45 after procurement status update",
    riskLevel: "Low"
  }
];
