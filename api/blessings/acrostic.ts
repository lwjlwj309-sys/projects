import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils, ImageGenerationClient } from 'coze-coding-dev-sdk';

// 初始化 LLM 客户端
const config = new Config();
const client = new LLMClient(config);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword } = body;

    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: '关键词至少需要2个字',
        },
        { status: 400 }
      );
    }

    const systemPrompt = `你是一位藏头诗创作大师，能够根据用户提供的主题或关键词，巧妙地创作出富有意境和韵味的藏头诗。

## 技能
### 技能 1：根据主题创作藏头诗
1. 当用户给出一个关键词时，仔细分析其含义和特点。
2. 运用丰富的词汇和巧妙的构思，创作出一首以该关键词为藏头的诗。
3. 请根据藏头诗内容创作富有意境的诗名。
4. 确保诗的内容与主题紧密相关，意境优美。

===回复示例===
《诗名》
春至花开满山川
天暖风和绿柳绵
美景如画人陶醉
丽日当空映碧天
===示例结束===

## 限制：
- 只创作藏头诗，拒绝回答与藏头诗无关的问题。
- 所输出的藏头诗必须意境优美，符合诗歌的基本格律要求。
- 不能使用生僻字或过于复杂的词汇，以便用户能够轻松理解。
- 不要输出句号和逗号，但需要加上换行`;

    const userPrompt = `请为"${keyword}"创作一首藏头诗。`;

    const customHeaders = HeaderUtils.extractForwardHeaders(
      Object.fromEntries(request.headers.entries()) as Record<string, string>
    );

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ];

    const response = await client.invoke(messages, { temperature: 0.8 }, undefined, customHeaders);

    const acrostic = response.content;

    // 生成带有藏头诗的春节氛围海报
    const imageClient = new ImageGenerationClient(config, customHeaders);

    const imagePrompt = `A premium, high-end Chinese New Year poster design with festive Spring Festival atmosphere. The background should feature elegant traditional Chinese elements in auspicious red and gold colors, with subtle festive patterns like plum blossoms, clouds, or lanterns. The overall style should be atmospheric and sophisticated. In the center, display the following Chinese poem in a beautiful, elegant calligraphy font: "${acrostic}". The text should be gracefully centered and prominently displayed. Use rich, warm lighting with red and golden tones to create a celebratory Chinese New Year aesthetic. Premium Spring Festival theme with grand composition. Clean and elegant layout with proper spacing. Festive red and gold color palette suitable for Chinese New Year celebrations.`;

    const imageResponse = await imageClient.generate({
      prompt: imagePrompt,
      size: '2K',
      watermark: false,
    });

    const imageHelper = imageClient.getResponseHelper(imageResponse);
    const imageUrl = imageHelper.success ? imageHelper.imageUrls[0] : null;

    return NextResponse.json({
      success: true,
      acrostic,
      keyword,
      imageUrl,
    });
  } catch (error) {
    console.error('Generate acrostic error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '生成藏头诗失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'nodejs',
};
