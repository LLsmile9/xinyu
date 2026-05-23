import { NextResponse } from 'next/server';
import { turso } from '@/lib/db';

export async function GET() {
  const debug = {
    DATABASE_URL: process.env.DATABASE_URL ? '✅ set' : '❌ not set',
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? '✅ set' : '❌ not set',
    AI_BASE_URL: process.env.AI_BASE_URL || '❌ not set',
    AI_API_KEY: process.env.AI_API_KEY ? '✅ set' : '❌ not set',
    AI_MODEL: process.env.AI_MODEL || '(default)',
    NODE_ENV: process.env.NODE_ENV,
  };

  // Test database connection
  let dbStatus = 'not tested';
  try {
    const result = await turso.execute('SELECT 1 as test');
    dbStatus = `✅ connected (test=${(result.rows[0] as any).test})`;
  } catch (e: any) {
    dbStatus = `❌ ${e.message}`;
  }

  // Test AI connection
  let aiStatus = 'not tested';
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
          messages: [{ role: 'user', content: 'say OK' }],
          max_tokens: 5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        aiStatus = `✅ connected (${data.choices?.[0]?.message?.content || 'no content'})`;
      } else {
        aiStatus = `❌ HTTP ${res.status}: ${await res.text()}`;
      }
    } else {
      aiStatus = '❌ AI_BASE_URL or AI_API_KEY not set';
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
