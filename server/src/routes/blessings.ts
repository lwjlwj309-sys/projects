import express, { type Request, type Response } from 'express';
import { LLMClient, Config, HeaderUtils, ImageGenerationClient } from 'coze-coding-dev-sdk';

const router = express.Router();

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

/**
 * 快速生成祝福语
 * POST /api/v1/blessings/generate
 * Body 参数：style: string, festival: string, recipient?: string
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { style = 'doubi', festival = 'chuyi', recipient } = req.body;

    // 构建系统提示词
    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS['doubi'];
    const festivalPrompt = FESTIVAL_PROMPTS[festival] || FESTIVAL_PROMPTS['chuyi'];

    const systemPrompt = `${stylePrompt} ${festivalPrompt}
请根据上述要求创作1-3条祝福语，每条祝福语要简洁有力，不要超过50字。如果是给特定对象，请在祝福语中体现。`;

    const userPrompt = recipient
      ? `请给${recipient}写几条拜年祝福语。`
      : '请写几条通用的拜年祝福语。';

    const customHeaders = HeaderUtils.extractForwardHeaders(req.headers as Record<string, string>);

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ];

    const response = await client.invoke(messages, { temperature: 0.8 }, undefined, customHeaders);

    res.json({
      success: true,
      blessings: response.content,
    });
  } catch (error) {
    console.error('Generate blessing error:', error);
    res.status(500).json({
      success: false,
      error: '生成祝福语失败，请稍后重试',
    });
  }
});

/**
 * 生成藏头诗
 * POST /api/v1/blessings/acrostic
 * Body 参数：keyword: string
 */
router.post('/acrostic', async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;

    if (!keyword || keyword.length < 2) {
      return res.status(400).json({
        success: false,
        error: '关键词至少需要2个字',
      });
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

    const customHeaders = HeaderUtils.extractForwardHeaders(req.headers as Record<string, string>);

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

    res.json({
      success: true,
      acrostic,
      keyword,
      imageUrl,
    });
  } catch (error) {
    console.error('Generate acrostic error:', error);
    res.status(500).json({
      success: false,
      error: '生成藏头诗失败，请稍后重试',
    });
  }
});

/**
 * AI自定义生成祝福语
 * POST /api/v1/blessings/custom
 * Body 参数：prompt: string
 */
router.post('/custom', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: '请输入您的需求',
      });
    }

    const systemPrompt = `你是一个专业的祝福语创作专家，擅长根据用户的具体需求创作个性化的祝福语。
你的祝福语要：
1. 简洁有力，富有创意
2. 符合用户的个性化需求
3. 温馨感人，传递美好祝愿
4. 适合新年拜年场合
5. 生成1-3条祝福语供用户选择`;

    const customHeaders = HeaderUtils.extractForwardHeaders(req.headers as Record<string, string>);

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt },
    ];

    const response = await client.invoke(messages, { temperature: 0.8 }, undefined, customHeaders);

    res.json({
      success: true,
      blessings: response.content,
    });
  } catch (error) {
    console.error('Custom blessing error:', error);
    res.status(500).json({
      success: false,
      error: '生成祝福语失败，请稍后重试',
    });
  }
});

export default router;
