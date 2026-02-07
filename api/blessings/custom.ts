import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 初始化 LLM 客户端
const config = new Config();
const client = new LLMClient(config);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '请输入您的需求',
        },
        { status: 400 }
      );
    }

    const systemPrompt = `你是一个专业的祝福语创作专家，擅长根据用户的具体需求创作个性化的祝福语。
你的祝福语要：
1. 简洁有力，富有创意
2. 符合用户的个性化需求
3. 温馨感人，传递美好祝愿
4. 适合新年拜年场合
5. 生成1-3条祝福语供用户选择`;

    const customHeaders = HeaderUtils.extractForwardHeaders(
      Object.fromEntries(request.headers.entries()) as Record<string, string>
    );

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt },
    ];

    const response = await client.invoke(messages, { temperature: 0.8 }, undefined, customHeaders);

    return NextResponse.json({
      success: true,
      blessings: response.content,
    });
  } catch (error) {
    console.error('Custom blessing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '生成祝福语失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'nodejs',
};
