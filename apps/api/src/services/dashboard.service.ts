import { prisma } from '@repo/database';
import { format, startOfDay, subDays } from 'date-fns';

export const getDashboardStats = async (userId: string) => {
  const todayStart = startOfDay(new Date());

  const todayConversions = await prisma.usageLog.count({
    where: {
      userId,
      timestamp: { gte: todayStart },
    },
  });

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
    growthPercentage = 100;
  }

  const userUsage = await prisma.userUsage.findUnique({
    where: { userId },
  });

  const lifetimeDocumentCount = userUsage?.lifetimeDocumentCount || 0;
  const lifetimeImageCount = userUsage?.lifetimeImageCount || 0;
  const totalFiles = lifetimeDocumentCount + lifetimeImageCount;

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

  const weekStart = subDays(todayStart, 6);
  const weeklyLogs = await prisma.usageLog.findMany({
    where: {
      userId,
      timestamp: { gte: weekStart },
    },
    select: {
      timestamp: true,
    },
  });

  const weeklyDataMap = new Map<string, number>();
  const days: { date: string; day: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dayName = format(d, 'EEE');
    const key = dayName;
    weeklyDataMap.set(key, 0);
    days.push({ date: key, day: dayName });
  }

  weeklyLogs.forEach(log => {
    const dayName = format(log.timestamp, 'EEE');
    if (weeklyDataMap.has(dayName)) {
      weeklyDataMap.set(dayName, (weeklyDataMap.get(dayName) || 0) + 1);
    }
  });

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
