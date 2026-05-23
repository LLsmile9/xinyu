import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time, answersJson, summary, encouragement, book } = body;

    if (!date || !time || !answersJson || !summary || !encouragement) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    const checkIn = await db.checkIn.create({
      data: {
        date,
        time,
        answersJson: typeof answersJson === 'string' ? answersJson : JSON.stringify(answersJson),
        summary,
        encouragement,
        book: book || '',
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get('date');

    if (date) {
      // Get check-ins for a specific date
      const checkIns = await db.checkIn.findMany({
        where: { date },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json(checkIns);
    }

    // Get all recent check-ins
    const checkIns = await db.checkIn.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
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
