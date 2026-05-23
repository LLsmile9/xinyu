import { NextResponse } from 'next/server';
import { turso, ensureTables } from '@/lib/db';

// Daily quotes pool
const QUOTES = [
  '温柔地对待自己，你值得被好好爱。',
  '今天也是值得期待的一天。',
  '每一个清晨，都是新的开始。',
  '慢慢来，比较快。',
  '你已经很棒了，别对自己太苛刻。',
  '生活不在别处，当下即是风景。',
  '深呼吸，一切都会好的。',
  '你的存在本身就是一件美好的事。',
  '允许自己慢一点，花开有时。',
  '今天，试着对身边的人微笑吧。',
  '不必事事完美，尽力就好。',
  '日子是过出来的，不是想出来的。',
  '每个认真生活的人，都闪闪发光。',
  '心若向阳，何处不是晴天。',
  '你比想象中更勇敢。',
  '世界很大，幸福很小，刚好装在心里。',
  '今天也要做个温柔的人呀。',
  '有些路，走慢点也没关系。',
  '生活总会给你另一个机会，它叫明天。',
  '好好吃饭，好好睡觉，好好爱自己。',
  '不急不躁，岁月静好。',
  '你的温柔，终将被世界善待。',
  '把每一个平凡的日子，过成值得纪念的样子。',
  '此刻的你，刚刚好。',
  '往前走，别回头，前面有光。',
  '今天的风，一定很温柔。',
  '做一个内心有光的人。',
  '所有的美好，都在路上。',
  '你笑起来真好看。',
  '日日是好日，步步是修行。',
];

function getDailyQuote(): string {
  // Use date as seed so same day gets same quote
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

function getWeekdayChinese(): string {
  const d = new Date();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[d.getDay()];
}

function formatDateChinese(): string {
  const d = new Date();
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export async function GET() {
  try {
    await ensureTables();
    const sendKey = process.env.SCT_SEND_KEY;
    if (!sendKey) {
      return NextResponse.json({ error: '未配置 SCT_SEND_KEY' }, { status: 500 });
    }

    // Get stats
    const [visitors, checkIns, todayVisitors, todayCheckIns] = await Promise.all([
      turso.execute('SELECT COUNT(*) as count FROM Visitor'),
      turso.execute('SELECT COUNT(*) as count FROM CheckIn'),
      turso.execute("SELECT COUNT(*) as count FROM Visitor WHERE date(lastSeen) = date('now')"),
      turso.execute("SELECT COUNT(*) as count FROM CheckIn WHERE date = strftime('%Y-%m-%d', 'now')"),
    ]);

    const totalVisitors = (visitors.rows[0] as any).count;
    const totalCheckIns = (checkIns.rows[0] as any).count;
    const todayVisitorsCount = (todayVisitors.rows[0] as any).count;
    const todayCheckInsCount = (todayCheckIns.rows[0] as any).count;

    const quote = getDailyQuote();
    const weekday = getWeekdayChinese();
    const dateStr = formatDateChinese();

    const title = `🌿 晨间心语 · ${dateStr} ${weekday}`;
    const body = `
## ☀️ 早安！

**${quote}**

---

📊 **心语站点数据**
- 累计访客：${totalVisitors} 人
- 累计心语：${totalCheckIns} 次
- 今日访客：${todayVisitorsCount} 人
- 今日心语：${todayCheckInsCount} 次

---

👉 [点击打开晨间心语](https://xinyu-ten.vercel.app)
`.trim();

    // Call Server酱 API
    const resp = await fetch(`https://sctapi.ftqq.com/${sendKey}.send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        desp: body,
      }),
    });

    const result = await resp.json();

    if (result.code === 0) {
      return NextResponse.json({
        ok: true,
        message: '推送成功',
        title,
        stats: { totalVisitors, totalCheckIns, todayVisitors: todayVisitorsCount, todayCheckIns: todayCheckInsCount },
      });
    } else {
      return NextResponse.json({ error: '推送失败', detail: result }, { status: 500 });
    }
  } catch (error) {
    console.error('Daily push error:', error);
    return NextResponse.json({ error: '推送异常' }, { status: 500 });
  }
}
