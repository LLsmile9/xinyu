import { NextRequest, NextResponse } from 'next/server';
import { upsertVisitor } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId } = body;

    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: '缺少 visitorId' }, { status: 400 });
    }

    await upsertVisitor(visitorId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Visit POST error:', error);
    return NextResponse.json({ error: '记录失败' }, { status: 500 });
  }
}
