import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Total unique visitors
    const totalVisitors = await db.visitor.count();

    // Total check-ins
    const totalCheckIns = await db.checkIn.count();

    // Today's date
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Today's visitors (lastSeen today)
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayVisitors = await db.visitor.count({
      where: { lastSeen: { gte: todayStart } },
    });

    // Today's check-ins
    const todayCheckIns = await db.checkIn.count({
      where: { date: todayStr },
    });

    // Recent 7 days daily stats
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const recentCheckIns = await db.checkIn.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { date: true, visitorId: true },
      orderBy: { date: 'desc' },
    });

    // Group by date
    const dailyStats: Record<string, { checkIns: number; visitors: Set<string> }> = {};
    for (const ci of recentCheckIns) {
      if (!dailyStats[ci.date]) dailyStats[ci.date] = { checkIns: 0, visitors: new Set() };
      dailyStats[ci.date].checkIns++;
      if (ci.visitorId) dailyStats[ci.date].visitors.add(ci.visitorId);
    }

    const daily = Object.entries(dailyStats)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, stat]) => ({
        date,
        checkIns: stat.checkIns,
        visitors: stat.visitors.size,
      }));

    return NextResponse.json({
      totalVisitors,
      totalCheckIns,
      todayVisitors,
      todayCheckIns,
      daily,
    });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ error: '获取统计失败' }, { status: 500 });
  }
}
