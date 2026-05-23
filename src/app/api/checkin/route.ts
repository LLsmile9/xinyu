import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, sleepQuality, mood, trouble, expectation, word, summary, encouragement } = body;

    if (!date || sleepQuality === undefined || !mood || !summary || !encouragement) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    const checkIn = await db.checkIn.upsert({
      where: { date },
      update: {
        sleepQuality,
        mood,
        trouble: trouble || null,
        expectation: expectation || null,
        word: word || null,
        summary,
        encouragement,
      },
      create: {
        date,
        sleepQuality,
        mood,
        trouble: trouble || null,
        expectation: expectation || null,
        word: word || null,
        summary,
        encouragement,
      },
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error('CheckIn POST error:', error);
    return NextResponse.json(
      { error: '保存失败，请稍后再试' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const checkIns = await db.checkIn.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error('CheckIn GET error:', error);
    return NextResponse.json(
      { error: '获取记录失败' },
      { status: 500 }
    );
  }
}
