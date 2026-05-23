import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { answers, previousCheckIns, allPreviousEncouragements } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: '请完成问题' },
        { status: 400 }
      );
    }

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

    // Build list of previously used philosophers to avoid repetition
    let usedPhilosophersContext = '';
    if (allPreviousEncouragements && Array.isArray(allPreviousEncouragements) && allPreviousEncouragements.length > 0) {
      const usedList = allPreviousEncouragements
        .map((c: { encouragement: string; book: string }, i: number) => `${i + 1}. ${c.encouragement} | ${c.book}`)
        .join('\n');
      usedPhilosophersContext = `\n\n【非常重要】以下是该用户之前已经收到过的心语和哲学家，你绝对不能重复使用这些哲学家，必须选择列表中未出现过的其他哲学家：\n${usedList}`;
    }

    const systemPrompt = `你是一位温暖而富有洞察力的心灵陪伴者，精通多种心理学流派和东西方哲学。根据用户对五个抽象心理问题的回答，生成三段内容：

1. 心情总结（summary）：用温柔、诗意、隐喻的语言，概括用户此刻的心理状态。像写一句诗一样，不超过30个中文字。不要用"你"开头，用第三人称或意象来描述。

【重要】绝对不要直接拼接或堆砌用户选择的词语！例如用户选了"湖蓝"和"正午"，不能写"湖蓝正午"，而要转化为诗意意象，如"午后湖面泛着静谧的光"。要把用户选择的元素消化、融合、升华，变成一个全新的诗意画面或意境。

2. 哲学鼓励（encouragement）：从以下50位思想家/哲学家中选取一位，化用或借鉴其核心思想，给予温暖而有力量的鼓励，不超过40个中文字。必须包含这位思想者的名字。

【关键规则】绝对不能重复使用用户之前已经收到过的哲学家！如果用户附上了"已经收到过的心语"列表，你必须从中识别出已使用的哲学家，并选择一位全新的、未出现过的哲学家。只有在所有50位都用完后才允许重复。

可选思想家列表：
荣格、毛姆、弗兰克尔、阿德勒、马可·奥勒留、王阳明、托尔斯泰、陀思妥耶夫斯基、克尔凯郭尔、传道书/箴言、尼采、加缪、庄子、老子、赫尔曼·黑塞、里里尔克、萨特、弗洛姆、孔子、苏格拉底、柏拉图、亚里士多德、伊壁鸠鲁、塞涅卡、爱比克泰德、蒙田、帕斯卡、卢梭、康德、叔本华、海德格尔、维特根斯坦、波伏娃、汉娜·阿伦特、罗曼·罗兰、纪伯伦、泰戈尔、梭罗、惠特曼、普鲁斯特、卡夫卡、博尔赫斯、三岛由纪夫、川端康成、夏目漱石、鲁迅、林语堂、丰子恺、朱光潜

3. 推荐书目（book）：推荐这位思想家的一本与当前心境相关的著作，格式为"作者《中文书名》/ Book Title"，不超过30个字。确保书名真实存在。

请严格按以下JSON格式返回，不要包含任何其他文字：
{"summary": "...", "encouragement": "...", "book": "..."}`;

    const userMessage = `这是我此刻的心理画像：\n${currentAnswers}${comparisonContext}${usedPhilosophersContext}`;

    // Call AI API - support both z-ai-web-dev-sdk (sandbox) and OpenAI-compatible API (production)
    let responseText = '';

    const aiBaseUrl = process.env.AI_BASE_URL;
    const aiApiKey = process.env.AI_API_KEY;
    const aiModel = process.env.AI_MODEL || 'gpt-4o-mini';

    if (aiBaseUrl && aiApiKey) {
      // Production mode: use OpenAI-compatible API directly
      const apiResponse = await fetch(`${aiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiApiKey}`,
        },
        body: JSON.stringify({
          model: aiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.8,
        }),
      });

      if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error('AI API error:', apiResponse.status, errorBody);
        return NextResponse.json(
          { error: 'AI 生成失败，请稍后再试' },
          { status: 500 }
        );
      }

      const result = await apiResponse.json();
      responseText = result.choices?.[0]?.message?.content || '';
    } else {
      // Sandbox mode: use z-ai-web-dev-sdk
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        thinking: { type: 'disabled' },
      });
      responseText = completion.choices[0]?.message?.content || '';
    }

    if (!responseText) {
      return NextResponse.json(
        { error: 'AI 生成失败，请稍后再试' },
        { status: 500 }
      );
    }

    // Try to parse JSON from the response
    let parsed;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*?"summary"[\s\S]*?"encouragement"[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          parsed = null;
        }
      }
      if (!parsed || !parsed.summary) {
        const jsonMatch2 = responseText.match(/\{[\s\S]*?"summary"[\s\S]*?"encouragement"[\s\S]*?"book"[\s\S]*?\}/);
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
