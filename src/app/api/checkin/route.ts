import { NextRequest, NextResponse } from 'next/server';
import { createCheckIn, getAllCheckIns, getCheckInsByDate, ensureTables } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();
    const { date, time, answersJson, summary, encouragement, book, visitorId } = body;

    if (!date || !time || !answersJson || !summary || !encouragement) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    await createCheckIn({
      date,
      time,
      answersJson: typeof answersJson === 'string' ? answersJson : JSON.stringify(answersJson),
      summary,
      encouragement,
      book: book || '',
      visitorId: visitorId || '',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('CheckIn POST error:', error);
    return NextResponse.json(
      { error: '保存失败，请稍后再试', detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureTables();
    const url = new URL(req.url);
    const date = url.searchParams.get('date');

    if (date) {
      const checkIns = await getCheckInsByDate(date);
      return NextResponse.json(checkIns);
    }

    const checkIns = await getAllCheckIns();
    return NextResponse.json(checkIns.slice(0, 50));
  } catch (error) {
    console.error('CheckIn GET error:', error);
    return NextResponse.json(
      { error: '获取记录失败' },
      { status: 500 }
    );
  }
}
