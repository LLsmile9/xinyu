import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ error: '获取统计失败' }, { status: 500 });
  }
}
