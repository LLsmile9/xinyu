import { NextResponse } from 'next/server';

export async function GET() {
  const debug = {
    DATABASE_URL: process.env.DATABASE_URL ? '✅ 已设置' : '❌ 未设置',
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? '✅ 已设置' : '❌ 未设置',
    AI_BASE_URL: process.env.AI_BASE_URL || '❌ 未设置',
    AI_API_KEY: process.env.AI_API_KEY ? '✅ 已设置' : '❌ 未设置',
    AI_MODEL: process.env.AI_MODEL || '(默认值)',
    NODE_ENV: process.env.NODE_ENV,
  };

  // Test database connection
  let dbStatus = '未测试';
  try {
    const { getDb } = await import('@/lib/db');
    const db = getDb();
    await db.$queryRaw`SELECT 1`;
    dbStatus = '✅ 连接正常';
  } catch (e: any) {
    dbStatus = `❌ ${e.message}`;
  }

  // Test AI connection
  let aiStatus = '未测试';
  try {
    const baseUrl = process.env.AI_BASE_URL;
    const apiKey = process.env.AI_API_KEY;
    if (baseUrl && apiKey) {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'moonshot-v1-8k',
          messages: [{ role: 'user', content: '你好，请回复OK' }],
          max_tokens: 5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        aiStatus = `✅ 连接正常 (${data.choices?.[0]?.message?.content || 'no content'})`;
      } else {
        aiStatus = `❌ HTTP ${res.status}: ${await res.text()}`;
      }
    } else {
      aiStatus = '❌ AI_BASE_URL 或 AI_API_KEY 未设置';
    }
  } catch (e: any) {
    aiStatus = `❌ ${e.message}`;
  }

  return NextResponse.json({
    env: debug,
    database: dbStatus,
    ai: aiStatus,
  });
}
