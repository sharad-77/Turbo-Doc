export interface WeeklyGraphPoint {
  name: string;
  conversions: number;
}

export interface DashboardStats {
  todayConversions: number;
  growthPercentage: number;
  totalFiles: number;
  storageUsed: number; // in bytes
  weeklyGraph: WeeklyGraphPoint[];
}
