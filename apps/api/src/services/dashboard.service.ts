import { prisma } from '@repo/database';
import { format, startOfDay, subDays } from 'date-fns';

export const getDashboardStats = async (userId: string) => {
  const todayStart = startOfDay(new Date());

  // 1. Today's Conversions (Count usageLog entries for today)
  const todayConversions = await prisma.usageLog.count({
    where: {
      userId,
      timestamp: { gte: todayStart },
      // Optional: Filter by specific operations if needed
      // operation: { in: ['PDF_CONVERT', 'IMAGE_CONVERT', 'MERGE', 'SPLIT', 'COMPRESS', 'RESIZE'] }
    },
  });

  // 2. Growth % (Today vs Yesterday)
  const yesterdayStart = subDays(todayStart, 1);
  const yesterdayConversions = await prisma.usageLog.count({
    where: {
      userId,
      timestamp: {
        gte: yesterdayStart,
        lt: todayStart,
      },
    },
  });

  let growthPercentage = 0;
  if (yesterdayConversions > 0) {
    growthPercentage = ((todayConversions - yesterdayConversions) / yesterdayConversions) * 100;
  } else if (todayConversions > 0) {
    growthPercentage = 100; // 0 to something is 100% growth (or just treat as positive)
  }

  // 3. Total Files (Lifetime) - derived from UserUsage
  const userUsage = await prisma.userUsage.findUnique({
    where: { userId },
  });

  const lifetimeDocumentCount = userUsage?.lifetimeDocumentCount || 0;
  const lifetimeImageCount = userUsage?.lifetimeImageCount || 0;
  const totalFiles = lifetimeDocumentCount + lifetimeImageCount;

  // 4. Storage Used - Aggregate fileSize from Document and Image tables
  // Note: This sums ALL current files. If files are deleted, storage used goes down.
  // This matches "Storage Used" usually implies current occupancy.
  const documentStorage = await prisma.document.aggregate({
    where: { userId },
    _sum: { fileSize: true },
  });

  const imageStorage = await prisma.image.aggregate({
    where: { userId },
    _sum: { fileSize: true },
  });

  const totalStorageBytes =
    (documentStorage._sum.fileSize || 0) + (imageStorage._sum.fileSize || 0);

  // 5. Weekly Usage Graph
  // Query usageLog for last 7 days
  const weekStart = subDays(todayStart, 6); // 6 days ago + today = 7 days
  const weeklyLogs = await prisma.usageLog.findMany({
    where: {
      userId,
      timestamp: { gte: weekStart },
    },
    select: {
      timestamp: true,
    },
  });

  // Initialize map for last 7 days
  const weeklyDataMap = new Map<string, number>();
  const days: { date: string; day: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dayName = format(d, 'EEE'); // Mon, Tue
    // Use proper keying to handle same-day-name edge cases if any (though 7 days won't overlap day name)
    // Actually format 'EEE' is enough for 7 days.
    const key = dayName;
    weeklyDataMap.set(key, 0);
    days.push({ date: key, day: dayName });
  }

  // Populate counts
  weeklyLogs.forEach(log => {
    const dayName = format(log.timestamp, 'EEE');
    if (weeklyDataMap.has(dayName)) {
      weeklyDataMap.set(dayName, (weeklyDataMap.get(dayName) || 0) + 1);
    }
  });

  // Format for frontend
  const weeklyGraph = days.map(d => ({
    name: d.day,
    conversions: weeklyDataMap.get(d.day) || 0,
  }));

  return {
    todayConversions,
    growthPercentage: Math.round(growthPercentage * 10) / 10, // Round to 1 decimal
    totalFiles,
    storageUsed: totalStorageBytes,
    weeklyGraph,
  };
};
