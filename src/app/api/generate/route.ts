import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    const { sleepQuality, mood, trouble, expectation, word } = await req.json();

    if (sleepQuality === undefined || !mood) {
      return NextResponse.json(
        { error: '请完成所有必填问题' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const sleepLabels = ['很糟糕', '不太好', '一般般', '还不错', '非常好'];
    const sleepDesc = sleepLabels[sleepQuality - 1] || '一般';

    const userAnswers = [
      `1. 昨晚睡眠：${sleepDesc}`,
      `2. 此刻心情：${mood}`,
      `3. 近期困扰：${trouble || '无'}`,
      `4. 今日期待：${expectation || '无'}`,
      `5. 一个词形容自己：${word || '未填写'}`,
    ].join('\n');

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `你是一位温暖而富有洞察力的心灵陪伴者。根据用户今日的五个心理状态回答，生成两段文字：

1. 心情总结（summary）：用温柔、诗意、隐喻的语言，概括用户此刻的心理状态。像写一句诗一样，不超过30个中文字。不要用"你"开头，用第三人称或意象来描述。

2. 哲学鼓励（encouragement）：化用或借鉴一位哲学家的思想（如尼采、加缪、萨特、庄子、老子、赫拉克利特等），给予温暖而有力量的鼓励，不超过40个中文字。

请严格按以下JSON格式返回，不要包含任何其他文字：
{"summary": "...", "encouragement": "..."}`,
        },
        {
          role: 'user',
          content: `这是我今天的心理状态：\n${userAnswers}`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'AI 生成失败，请稍后再试' },
        { status: 500 }
      );
    }

    // Try to parse JSON from the response
    let parsed;
    try {
      // Handle potential markdown code blocks
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = response.match(/\{[\s\S]*?"summary"[\s\S]*?"encouragement"[\s\S]*?\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = {
          summary: '风穿过林间，叶子轻轻颤动。',
          encouragement: '尼采说：每一个不曾起舞的日子，都是对生命的辜负。',
        };
      }
    }

    return NextResponse.json({
      summary: parsed.summary || '晨光温柔地落在窗台上。',
      encouragement: parsed.encouragement || '加缪说：在隆冬，我终于知道，我身上有一个不可战胜的夏天。',
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
}
