import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    const { answers, previousCheckIns } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: '请完成问题' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Format current answers
    const currentAnswers = answers
      .map((a: { question: string; answer: string }, i: number) => `${i + 1}. ${a.question} ${a.answer}`)
      .join('\n');

    // Build context for comparison with earlier check-ins today
    let comparisonContext = '';
    if (previousCheckIns && Array.isArray(previousCheckIns) && previousCheckIns.length > 0) {
      const previousSummaries = previousCheckIns
        .map((c: { time: string; summary: string }, i: number) => `第${i + 1}次（${c.time}）：${c.summary}`)
        .join('\n');
      comparisonContext = `\n\n今天之前的心语记录：\n${previousSummaries}\n\n请在生成总结时，与今天之前的记录做一个温和的对照或呼应，体现出心情的变化轨迹。`;
    }

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `你是一位温暖而富有洞察力的心灵陪伴者，精通荣格心理学、色彩心理学、塔罗象征和东方哲学。根据用户对五个抽象心理问题的回答，生成三段内容：

1. 心情总结（summary）：用温柔、诗意、隐喻的语言，概括用户此刻的心理状态。像写一句诗一样，不超过30个中文字。不要用"你"开头，用第三人称或意象来描述。

【重要】绝对不要直接拼接或堆砌用户选择的词语！例如用户选了"湖蓝"和"正午"，不能写"湖蓝正午"，而要转化为诗意意象，如"午后湖面泛着静谧的光"。要把用户选择的元素消化、融合、升华，变成一个全新的诗意画面或意境。

2. 哲学鼓励（encouragement）：化用或借鉴一位哲学家或心理学家的思想（如尼采、加缪、荣格、庄子、老子、赫尔曼·黑塞、里尔克、萨特、弗洛姆等），给予温暖而有力量的鼓励，不超过40个中文字。需要包含这位思想者的名字。

3. 推荐书目（book）：推荐这位哲学家/心理学家的一本与当前心境相关的著作，格式为"作者《中文书名》/ Book Title"，不超过30个字。确保书名真实存在。

请严格按以下JSON格式返回，不要包含任何其他文字：
{"summary": "...", "encouragement": "...", "book": "..."}`,
        },
        {
          role: 'user',
          content: `这是我此刻的心理画像：\n${currentAnswers}${comparisonContext}`,
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
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const jsonMatch = response.match(/\{[\s\S]*?"summary"[\s\S]*?"encouragement"[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          parsed = null;
        }
      }
      // Try to also match with book field
      if (!parsed || !parsed.summary) {
        const jsonMatch2 = response.match(/\{[\s\S]*?"summary"[\s\S]*?"encouragement"[\s\S]*?"book"[\s\S]*?\}/);
        if (jsonMatch2) {
          try {
            parsed = JSON.parse(jsonMatch2[0]);
          } catch {
            parsed = null;
          }
        }
      }
      if (!parsed) {
        parsed = {
          summary: '风穿过林间，叶子轻轻颤动。',
          encouragement: '尼采说：每一个不曾起舞的日子，都是对生命的辜负。',
          book: '尼采《查拉图斯特拉如是说》/ Thus Spoke Zarathustra',
        };
      }
    }

    return NextResponse.json({
      summary: parsed.summary || '晨光温柔地落在窗台上。',
      encouragement: parsed.encouragement || '加缪说：在隆冬，我终于知道，我身上有一个不可战胜的夏天。',
      book: parsed.book || '加缪《西西弗神话》/ The Myth of Sisyphus',
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后再试' },
      { status: 500 }
    );
  }
}
