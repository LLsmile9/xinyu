import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId } = body;

    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: '缺少 visitorId' }, { status: 400 });
    }

    // Upsert: create if new, update lastSeen & increment visits if existing
    const visitor = await db.visitor.upsert({
      where: { visitorId },
      create: {
        visitorId,
        firstSeen: new Date(),
        lastSeen: new Date(),
        visits: 1,
      },
      update: {
        lastSeen: new Date(),
        visits: { increment: 1 },
      },
    });

    return NextResponse.json({ ok: true, isNew: visitor.visits === 1 });
  } catch (error) {
    console.error('Visit POST error:', error);
    return NextResponse.json({ error: '记录失败' }, { status: 500 });
  }
}
