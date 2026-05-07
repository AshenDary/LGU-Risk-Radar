
const MONTHS = [
  "January", "February", "March", "April", "May",
  "June", "July", "August", "September", "October",
  "November", "December",
];

export { MONTHS };
 
/** Derive risk level from a numeric score (0–100). */
export function getRiskLevel(score) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}
 
// ── NCR City Master List ──────────────────────────────────────
 
export const NCR_CITIES = [
  { id: 1,  name: "Manila"},
  { id: 2,  name: "Quezon City"},
  { id: 3,  name: "Caloocan"},
  { id: 4,  name: "Las Piñas"},
  { id: 5,  name: "Makati"},
  { id: 6,  name: "Malabon"},
  { id: 7,  name: "Mandaluyong"},
  { id: 8,  name: "Marikina"},
  { id: 9,  name: "Muntinlupa"},
  { id: 10, name: "Navotas"},
  { id: 11, name: "Parañaque"},
  { id: 12, name: "Pasay"},
  { id: 13, name: "Pasig"},
  { id: 14, name: "San Juan"},
  { id: 15, name: "Taguig"},
  { id: 16, name: "Valenzuela"},
];
 
// ── Monthly Score Snapshots ───────────────────────────────────
// Each entry = one city's risk score for a given year+month.
// Scores are deliberately varied to reflect realistic procurement
// risk patterns (budget releases, audit seasons, election years).
 
const RAW_MONTHLY = {
  // city id → { year → [Jan…Dec scores] }
  // Realistic corruption risk patterns: high variance, observable trends
 
  1: { // Manila — historically high risk, persistent issues
    2022: [85, 83, 87, 89, 88, 86, 84, 82, 85, 87, 89, 91],
    2023: [89, 87, 90, 92, 91, 89, 88, 86, 89, 91, 93, 95],
    2024: [92, 90, 93, 95, 94, 92, 91, 89, 92, 94, 96, 98],
    2025: [85, 83, 86, 88, 87, 85, 83, 81, 84, 86, 88, 90],
    2026: [80, 78, 81, 83, 82],
  },
  2: { // Quezon City — medium-high, strong reform efforts
    2022: [72, 70, 75, 78, 76, 74, 72, 70, 73, 75, 77, 79],
    2023: [75, 72, 76, 79, 77, 75, 73, 71, 74, 76, 78, 80],
    2024: [60, 58, 62, 65, 63, 61, 59, 57, 60, 62, 64, 66],
    2025: [55, 53, 57, 60, 58, 56, 54, 52, 55, 57, 59, 61],
    2026: [48, 46, 50, 53, 51],
  },
  3: { // Caloocan — medium risk, unstable
    2022: [58, 56, 61, 64, 62, 60, 58, 56, 59, 61, 63, 65],
    2023: [68, 66, 71, 74, 72, 70, 68, 66, 69, 71, 73, 75],
    2024: [65, 63, 68, 71, 69, 67, 65, 63, 66, 68, 70, 72],
    2025: [52, 50, 55, 58, 56, 54, 52, 50, 53, 55, 57, 59],
    2026: [45, 43, 48, 51, 49],
  },
  4: { // Las Piñas — low risk, consistently good governance
    2022: [28, 26, 30, 33, 31, 29, 27, 25, 28, 30, 32, 34],
    2023: [25, 23, 27, 30, 28, 26, 24, 22, 25, 27, 29, 31],
    2024: [22, 20, 24, 27, 25, 23, 21, 19, 22, 24, 26, 28],
    2025: [19, 17, 21, 24, 22, 20, 18, 16, 19, 21, 23, 25],
    2026: [15, 13, 17, 20, 18],
  },
  5: { // Makati — very low risk, strong governance
    2022: [18, 16, 20, 23, 21, 19, 17, 15, 18, 20, 22, 24],
    2023: [15, 13, 17, 20, 18, 16, 14, 12, 15, 17, 19, 21],
    2024: [12, 10, 14, 17, 15, 13, 11, 9, 12, 14, 16, 18],
    2025: [9, 7, 11, 14, 12, 10, 8, 6, 9, 11, 13, 15],
    2026: [6, 4, 8, 11, 9],
  },
  6: { // Malabon — medium-high, moderate corruption
    2022: [68, 66, 71, 74, 72, 70, 68, 66, 69, 71, 73, 75],
    2023: [70, 68, 73, 76, 74, 72, 70, 68, 71, 73, 75, 77],
    2024: [65, 63, 68, 71, 69, 67, 65, 63, 66, 68, 70, 72],
    2025: [60, 58, 63, 66, 64, 62, 60, 58, 61, 63, 65, 67],
    2026: [54, 52, 57, 60, 58],
  },
  7: { // Mandaluyong — medium risk, improving
    2022: [55, 53, 58, 61, 59, 57, 55, 53, 56, 58, 60, 62],
    2023: [58, 56, 61, 64, 62, 60, 58, 56, 59, 61, 63, 65],
    2024: [50, 48, 53, 56, 54, 52, 50, 48, 51, 53, 55, 57],
    2025: [45, 43, 48, 51, 49, 47, 45, 43, 46, 48, 50, 52],
    2026: [38, 36, 41, 44, 42],
  },
  8: { // Marikina — low-medium, good governance
    2022: [32, 30, 35, 38, 36, 34, 32, 30, 33, 35, 37, 39],
    2023: [28, 26, 31, 34, 32, 30, 28, 26, 29, 31, 33, 35],
    2024: [24, 22, 27, 30, 28, 26, 24, 22, 25, 27, 29, 31],
    2025: [20, 18, 23, 26, 24, 22, 20, 18, 21, 23, 25, 27],
    2026: [16, 14, 19, 22, 20],
  },
  9: { // Muntinlupa — low risk, excellent governance
    2022: [22, 20, 25, 28, 26, 24, 22, 20, 23, 25, 27, 29],
    2023: [19, 17, 22, 25, 23, 21, 19, 17, 20, 22, 24, 26],
    2024: [16, 14, 19, 22, 20, 18, 16, 14, 17, 19, 21, 23],
    2025: [13, 11, 16, 19, 17, 15, 13, 11, 14, 16, 18, 20],
    2026: [10, 8, 13, 16, 14],
  },
  10: { // Navotas — high risk, chronic issues
    2022: [78, 76, 81, 84, 82, 80, 78, 76, 79, 81, 83, 85],
    2023: [82, 80, 85, 88, 86, 84, 82, 80, 83, 85, 87, 89],
    2024: [85, 83, 88, 91, 89, 87, 85, 83, 86, 88, 90, 92],
    2025: [80, 78, 83, 86, 84, 82, 80, 78, 81, 83, 85, 87],
    2026: [75, 73, 78, 81, 79],
  },
  11: { // Parañaque — medium risk, volatile
    2022: [55, 53, 58, 61, 59, 57, 55, 53, 56, 58, 60, 62],
    2023: [62, 60, 65, 68, 66, 64, 62, 60, 63, 65, 67, 69],
    2024: [58, 56, 61, 64, 62, 60, 58, 56, 59, 61, 63, 65],
    2025: [50, 48, 53, 56, 54, 52, 50, 48, 51, 53, 55, 57],
    2026: [43, 41, 46, 49, 47],
  },
  12: { // Pasay — medium-high risk, mixed signals
    2022: [68, 66, 71, 74, 72, 70, 68, 66, 69, 71, 73, 75],
    2023: [72, 70, 75, 78, 76, 74, 72, 70, 73, 75, 77, 79],
    2024: [65, 63, 68, 71, 69, 67, 65, 63, 66, 68, 70, 72],
    2025: [58, 56, 61, 64, 62, 60, 58, 56, 59, 61, 63, 65],
    2026: [52, 50, 55, 58, 56],
  },
  13: { // Pasig — low-medium, improving business hub
    2022: [38, 36, 41, 44, 42, 40, 38, 36, 39, 41, 43, 45],
    2023: [35, 33, 38, 41, 39, 37, 35, 33, 36, 38, 40, 42],
    2024: [28, 26, 31, 34, 32, 30, 28, 26, 29, 31, 33, 35],
    2025: [22, 20, 25, 28, 26, 24, 22, 20, 23, 25, 27, 29],
    2026: [16, 14, 19, 22, 20],
  },
  14: { // San Juan — low risk, well-managed
    2022: [24, 22, 27, 30, 28, 26, 24, 22, 25, 27, 29, 31],
    2023: [21, 19, 24, 27, 25, 23, 21, 19, 22, 24, 26, 28],
    2024: [18, 16, 21, 24, 22, 20, 18, 16, 19, 21, 23, 25],
    2025: [15, 13, 18, 21, 19, 17, 15, 13, 16, 18, 20, 22],
    2026: [12, 10, 15, 18, 16],
  },
  15: { // Taguig — very low risk, strong governance (BGC effect)
    2022: [16, 14, 19, 22, 20, 18, 16, 14, 17, 19, 21, 23],
    2023: [13, 11, 16, 19, 17, 15, 13, 11, 14, 16, 18, 20],
    2024: [10, 8, 13, 16, 14, 12, 10, 8, 11, 13, 15, 17],
    2025: [7, 5, 10, 13, 11, 9, 7, 5, 8, 10, 12, 14],
    2026: [4, 2, 7, 10, 8],
  },
  16: { // Valenzuela — medium risk, industrial area
    2022: [58, 56, 61, 64, 62, 60, 58, 56, 59, 61, 63, 65],
    2023: [62, 60, 65, 68, 66, 64, 62, 60, 63, 65, 67, 69],
    2024: [55, 53, 58, 61, 59, 57, 55, 53, 56, 58, 60, 62],
    2025: [50, 48, 53, 56, 54, 52, 50, 48, 51, 53, 55, 57],
    2026: [44, 42, 47, 50, 48],
  },
};
 
// ── Procurement Values (₱ millions) ──────────────────────────
// Monthly procurement totals per city per year.
// 2026 only Jan–May populated; rest are null.
 
const RAW_PROCUREMENT = {
  // city id → { year → [Jan…Dec values in ₱M] }
  // High risk cities: volatile, concentrated suppliers; Low risk: stable, diverse
  
  1: { // Manila — volatile high-value procurements, supplier concentration
    2022: [320, 210, 380, 520, 450, 380, 410, 320, 480, 580, 650, 820],
    2023: [380, 250, 420, 580, 520, 420, 460, 350, 540, 640, 720, 920],
    2024: [450, 300, 500, 680, 600, 500, 550, 420, 620, 740, 820, 1050],
    2025: [280, 180, 320, 420, 360, 300, 340, 260, 380, 460, 520, 680],
    2026: [220, 140, 260, 360, 300, null, null, null, null, null, null, null],
  },
  2: { // Quezon City — improving, more stable procurement
    2022: [280, 190, 330, 440, 380, 340, 365, 280, 380, 450, 500, 620],
    2023: [260, 170, 300, 400, 350, 310, 330, 250, 350, 420, 470, 580],
    2024: [150, 110, 180, 240, 210, 180, 195, 150, 210, 260, 290, 360],
    2025: [130, 95, 155, 210, 180, 155, 170, 130, 185, 230, 260, 320],
    2026: [105, 75, 130, 175, 150, null, null, null, null, null, null, null],
  },
  3: { // Caloocan — volatile, inconsistent patterns
    2022: [95, 65, 125, 170, 145, 125, 135, 105, 145, 175, 195, 250],
    2023: [140, 100, 170, 230, 200, 170, 185, 145, 200, 240, 270, 350],
    2024: [120, 85, 145, 195, 170, 145, 160, 125, 175, 210, 235, 300],
    2025: [75, 55, 95, 125, 105, 90, 100, 75, 105, 130, 150, 200],
    2026: [60, 42, 75, 100, 85, null, null, null, null, null, null, null],
  },
  4: { // Las Piñas — stable, conservative procurement
    2022: [58, 42, 68, 92, 80, 72, 78, 62, 82, 98, 110, 138],
    2023: [55, 40, 65, 88, 77, 69, 75, 59, 79, 94, 105, 131],
    2024: [50, 36, 58, 78, 68, 61, 66, 52, 71, 85, 95, 119],
    2025: [45, 32, 52, 70, 61, 55, 60, 46, 64, 77, 86, 108],
    2026: [40, 28, 46, 62, 54, null, null, null, null, null, null, null],
  },
  5: { // Makati — efficient, transparent procurement
    2022: [260, 190, 310, 420, 370, 330, 355, 280, 370, 440, 490, 610],
    2023: [240, 175, 285, 385, 335, 300, 320, 250, 340, 405, 450, 560],
    2024: [210, 155, 250, 335, 290, 260, 280, 220, 300, 360, 400, 500],
    2025: [180, 135, 215, 290, 250, 225, 240, 190, 260, 310, 345, 430],
    2026: [155, 115, 185, 250, 215, null, null, null, null, null, null, null],
  },
  6: { // Malabon — high concentration, unstable
    2022: [68, 50, 85, 115, 100, 88, 96, 76, 105, 125, 140, 175],
    2023: [75, 55, 95, 130, 112, 98, 108, 85, 118, 140, 158, 198],
    2024: [65, 48, 80, 110, 95, 84, 92, 72, 100, 120, 135, 170],
    2025: [55, 40, 68, 92, 80, 72, 78, 60, 85, 102, 115, 145],
    2026: [45, 33, 56, 76, 66, null, null, null, null, null, null, null],
  },
  7: { // Mandaluyong — improving efficiency
    2022: [98, 72, 128, 175, 152, 135, 148, 117, 160, 192, 215, 270],
    2023: [110, 80, 140, 190, 165, 147, 160, 127, 175, 210, 235, 295],
    2024: [80, 58, 100, 135, 115, 103, 112, 88, 125, 150, 168, 210],
    2025: [68, 50, 85, 115, 100, 88, 96, 76, 105, 125, 140, 175],
    2026: [56, 41, 70, 95, 82, null, null, null, null, null, null, null],
  },
  8: { // Marikina — stable, diverse procurement
    2022: [75, 55, 90, 120, 105, 94, 102, 81, 108, 130, 145, 182],
    2023: [70, 51, 84, 112, 98, 88, 95, 75, 100, 120, 135, 169],
    2024: [60, 44, 72, 96, 84, 75, 82, 65, 87, 104, 116, 146],
    2025: [50, 37, 60, 80, 70, 63, 68, 54, 74, 88, 98, 123],
    2026: [42, 31, 50, 67, 59, null, null, null, null, null, null, null],
  },
  9: { // Muntinlupa — excellent governance, predictable
    2022: [65, 48, 78, 105, 92, 82, 89, 70, 94, 112, 125, 157],
    2023: [60, 44, 72, 96, 84, 75, 82, 65, 86, 104, 116, 146],
    2024: [52, 38, 62, 84, 73, 65, 71, 56, 75, 90, 101, 127],
    2025: [45, 33, 54, 73, 64, 57, 62, 49, 66, 79, 88, 110],
    2026: [38, 28, 46, 62, 54, null, null, null, null, null, null, null],
  },
  10: { // Navotas — high volatility, supplier concentration
    2022: [45, 32, 58, 80, 70, 62, 68, 54, 75, 90, 102, 128],
    2023: [52, 38, 68, 95, 82, 73, 80, 63, 88, 106, 120, 152],
    2024: [58, 42, 75, 105, 92, 82, 90, 71, 100, 120, 135, 170],
    2025: [50, 36, 65, 90, 78, 70, 76, 60, 85, 102, 115, 145],
    2026: [42, 30, 54, 75, 65, null, null, null, null, null, null, null],
  },
  11: { // Parañaque — medium stability, moderate variance
    2022: [95, 70, 115, 155, 135, 120, 130, 103, 140, 170, 190, 240],
    2023: [110, 82, 135, 185, 160, 142, 155, 123, 170, 205, 230, 290],
    2024: [95, 70, 115, 155, 135, 120, 130, 103, 140, 170, 190, 240],
    2025: [75, 55, 90, 120, 105, 94, 102, 80, 110, 135, 150, 190],
    2026: [60, 44, 72, 98, 85, null, null, null, null, null, null, null],
  },
  12: { // Pasay — medium-high volatility
    2022: [85, 63, 105, 142, 124, 111, 121, 96, 132, 160, 178, 224],
    2023: [98, 73, 122, 165, 144, 128, 140, 111, 153, 186, 207, 262],
    2024: [80, 60, 98, 132, 115, 103, 112, 89, 122, 148, 165, 208],
    2025: [65, 48, 80, 108, 94, 84, 92, 73, 100, 122, 136, 172],
    2026: [54, 40, 66, 89, 77, null, null, null, null, null, null, null],
  },
  13: { // Pasig — improving transparency
    2022: [125, 92, 150, 205, 178, 160, 175, 139, 190, 230, 257, 325],
    2023: [115, 85, 138, 188, 162, 145, 158, 125, 172, 210, 235, 295],
    2024: [90, 67, 108, 145, 125, 112, 122, 97, 133, 162, 182, 230],
    2025: [70, 52, 84, 112, 98, 88, 95, 75, 103, 126, 141, 177],
    2026: [56, 41, 68, 90, 78, null, null, null, null, null, null, null],
  },
  14: { // San Juan — stable, consistent
    2022: [45, 33, 54, 73, 64, 57, 62, 49, 67, 81, 91, 114],
    2023: [42, 31, 50, 67, 59, 53, 57, 45, 62, 75, 84, 105],
    2024: [38, 28, 46, 62, 54, 48, 52, 41, 56, 68, 76, 95],
    2025: [34, 25, 41, 55, 48, 43, 47, 37, 50, 61, 68, 85],
    2026: [30, 22, 36, 48, 42, null, null, null, null, null, null, null],
  },
  15: { // Taguig — highly efficient, predictable
    2022: [180, 132, 216, 291, 253, 227, 246, 195, 261, 315, 352, 441],
    2023: [168, 124, 201, 271, 236, 211, 230, 182, 244, 294, 329, 411],
    2024: [145, 107, 174, 234, 204, 183, 198, 157, 211, 254, 284, 355],
    2025: [125, 92, 150, 202, 175, 157, 170, 135, 182, 220, 246, 308],
    2026: [108, 79, 130, 175, 152, null, null, null, null, null, null, null],
  },
  16: { // Valenzuela — medium stability
    2022: [78, 58, 95, 128, 112, 100, 109, 86, 118, 142, 159, 200],
    2023: [85, 63, 105, 142, 124, 111, 121, 96, 132, 160, 178, 224],
    2024: [72, 54, 88, 118, 103, 92, 100, 79, 110, 132, 147, 185],
    2025: [60, 45, 73, 98, 85, 76, 83, 66, 90, 110, 123, 154],
    2026: [50, 37, 60, 80, 70, null, null, null, null, null, null, null],
  },
};

// ── Calculate Summary Statistics ──────────────────────────────
export function calculateSummaryStats() {
  // Get latest 2026 scores (May, index 4)
  const latestScores = NCR_CITIES.map(city => {
    return RAW_MONTHLY[city.id][2026][4]; // May 2026
  });

  const totalLGUs = NCR_CITIES.length;
  const highRisk = latestScores.filter(score => score >= 70).length;
  const avgRisk = (latestScores.reduce((a, b) => a + b, 0) / latestScores.length).toFixed(1);
  const critical = latestScores.filter(score => score >= 85).length;

  return {
    totalLGUs,
    highRisk,
    avgRisk,
    critical,
  };
}

// ── Get Top Trustworthy LGUs (Lowest Risk) ────────────────────
export function getTopTrustworthyLGUs(year = 2026) {
  const scores = NCR_CITIES.map(city => {
    const yearData = RAW_MONTHLY[city.id][year];
    // For 2026, only take available months (0-4 = Jan-May)
    const validScores = year === 2026 ? yearData.slice(0, 5) : yearData;
    const avgScore = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    
    return {
      id: city.id,
      name: city.name,
      avgScore: avgScore.toFixed(2),
      riskLevel: getRiskLevel(avgScore),
    };
  });

  // Sort by score (lowest = most trustworthy)
  return scores.sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);
}

// ── Get all years with data
export function getAvailableYears() {
  return ['All Time', '2022', '2023', '2024', '2025', '2026'];
}

// ── Get All Years Average (for "All Time") ────────────────────
export function getTopTrustworthyLGUsAllTime() {
  const scores = NCR_CITIES.map(city => {
    const allScores = [];
    for (let year = 2022; year <= 2026; year++) {
      const yearData = RAW_MONTHLY[city.id][year];
      const validScores = year === 2026 ? yearData.slice(0, 5) : yearData;
      allScores.push(...validScores);
    }
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    
    return {
      id: city.id,
      name: city.name,
      avgScore: avgScore.toFixed(2),
      riskLevel: getRiskLevel(avgScore),
    };
  });

  return scores.sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);
}

// ── Get NCR Cities Score Distribution ─────────────────────────
export function getNCRScoresForChart() {
  // Get latest 2026 scores (May)
  return NCR_CITIES.map(city => {
    const score = RAW_MONTHLY[city.id][2026][4];
    return {
      name: city.name,
      score,
      riskLevel: getRiskLevel(score),
    };
  }).sort((a, b) => b.score - a.score); // Sort by score descending
}

// ── Top Risk LGUs (for TopRiskTable) ──────────────────────────
export const topLGUs = (() => {
  const scores = NCR_CITIES.map((city, idx) => {
    const score = RAW_MONTHLY[city.id][2026][4];
    return {
      rank: idx + 1,
      name: city.name,
      province: 'NCR',
      riskScore: score,
      riskLevel: getRiskLevel(score),
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  return scores.slice(0, 10); // Top 10
})()

// ── Legacy summary data (for backward compatibility) ──────────
export const summaryData = {
  totalLGUs: 1634,
  highRisk: 312,
  avgRisk: 54.7,
  critical: 78,
}

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

// ── Get Monthly Scores for a Specific City ────────────────────
export function getMonthlyScoresForCity(cityId) {
  const cityData = RAW_MONTHLY[cityId];
  const result = [];
  
  for (let year = 2022; year <= 2026; year++) {
    const yearData = cityData[year];
    yearData.forEach((score, monthIdx) => {
      result.push({
        month: MONTHS[monthIdx],
        year,
        score,
      });
    });
  }
  
  return result;
}

// ── Get Monthly Procurement for a Specific City ────────────────
export function getMonthlyProcurementForCity(cityId) {
  const cityData = RAW_PROCUREMENT[cityId];
  const result = [];
  
  for (let year = 2022; year <= 2026; year++) {
    const yearData = cityData[year];
    yearData.forEach((value, monthIdx) => {
      result.push({
        month: MONTHS[monthIdx],
        year,
        value,
      });
    });
  }
  
  return result;
}
