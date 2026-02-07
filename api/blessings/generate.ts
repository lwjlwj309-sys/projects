import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 初始化 LLM 客户端
const config = new Config();
const client = new LLMClient(config);

// 风格配置
const STYLE_PROMPTS: Record<string, string> = {
  'dachang': '你是一个擅长"废话文学/大厂风"的祝福语创作专家，专门为打工族创作。要大量运用"赋能、闭环、抓手、心智、底层逻辑、赛道、生态、落地"等互联网黑话，营造一种高大上又有点幽默的职场氛围。',
  'saibo': '你是一个擅长"赛博/科幻风"的祝福语创作专家，符合2026年审美。要融入电子、霓虹、算法、代码、永生、算力、AI等科幻元素，营造未来感，适合程序员和科技爱好者。',
  'fakuang': '你是一个擅长"发疯/情绪化风格"的祝福语创作专家，这是当下年轻人的解压阀。语言要夸张、直白，甚至带点咆哮感，可以发泄对加班和穷的"愤怒"，适合密友、铁磁之间互发。',
  'jijian': '你是一个擅长"极简/性冷淡风"的祝福语创作专家，追求高级感的极致。字数要极少，留白要多，非常有格调，适合配图很美的朋友圈。',
  'gaoqing': '你是一个擅长"高情商/拒酒词风"的祝福语创作专家，这是春节实战刚需。要优雅地拒绝，得体地祝福，适合年夜饭桌、面对讨厌的亲戚。',
  'foxi': '你是一个擅长"佛系/躺平风"的祝福语创作专家，属于治愈系。语言要体现顺其自然、反卷、平安喜乐的理念，适合想要休息的打工族。',
  'shangwu': '你是一个专业的"职场商务风格"祝福语创作专家，适合正式场合。语言要正式、得体、大气，体现专业素养和商务礼仪，适合职场商务场合或发给客户、合作伙伴。',
  'baofu': '你是一个擅长"暴富/直球风"的祝福语创作专家，特别是初五接财神专用。语言要直白、有冲击力，全都是关于钱的，非常有视觉冲击力。',
};

// 节日配置
const FESTIVAL_PROMPTS: Record<string, string> = {
  'xiaonian': '现在是马年小年，祝福语要围绕辞旧迎新、祭灶祈福、春节序幕、扫尘迎新的主题，融入马的元素（奔跑、骏马、千里马等）。',
  'chuxi': '现在是马年除夕夜，祝福语要围绕辞旧迎新、阖家团圆、期待新年的主题，融入马的元素（马到成功、龙马精神、万马奔腾等）。',
  'chuyi': '现在是马年正月初一，祝福语要围绕新春佳节、拜年问候、马年美好祝愿的主题，大量使用马的吉祥寓意。',
  'chuer': '现在是马年正月初二，祝福语要围绕回娘家、拜年访友、亲情主题，融入马年元素。',
  'chusan': '现在是马年正月初三，祝福语要围绕迎春纳福、万事如意的主题，用马年的吉祥话。',
  'chusi': '现在是马年正月初四，祝福语要围绕喜迎财神、接福纳祥的主题，结合马年寓意。',
  'chuwu': '现在是马年正月初五，祝福语要围绕迎财神、开市大吉、财源广进的主题，特别适合表达"马上暴富"的愿望。',
  'chuliu': '现在是马年正月初六，祝福语要围绕送穷迎富、事事顺心的主题，融入马年元素。',
  'chuqi': '现在是马年正月初七，祝福语要围绕人日（人生日）、平安健康、万事顺遂的主题，用马年祝福。',
  'chuba': '现在是马年正月初八，祝福语要围绕谷日、五谷丰登、事业兴旺的主题，体现马年精神。',
  'yuanxiao': '现在是马年元宵节，祝福语要围绕赏灯吃汤圆、团团圆圆、欢乐祥和的主题，融入马年元素。',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { style = 'dachang', festival = 'chuyi', recipient } = body;

    // 构建系统提示词
    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS['dachang'];
    const festivalPrompt = FESTIVAL_PROMPTS[festival] || FESTIVAL_PROMPTS['chuyi'];

    const systemPrompt = `${stylePrompt} ${festivalPrompt}
请根据上述要求创作1-3条祝福语，每条祝福语要简洁有力，不要超过50字。如果是给特定对象，请在祝福语中体现。`;

    const userPrompt = recipient
      ? `请给${recipient}写几条拜年祝福语。`
      : '请写几条通用的拜年祝福语。';

    const customHeaders = HeaderUtils.extractForwardHeaders(
      Object.fromEntries(request.headers.entries()) as Record<string, string>
    );

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ];

    const response = await client.invoke(messages, { temperature: 0.8 }, undefined, customHeaders);

    return NextResponse.json({
      success: true,
      blessings: response.content,
    });
  } catch (error) {
    console.error('Generate blessing error:', error);
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
