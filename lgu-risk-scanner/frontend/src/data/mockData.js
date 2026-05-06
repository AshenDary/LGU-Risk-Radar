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
