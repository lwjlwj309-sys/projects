import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 返回标准的 JSON
  res.status(200).json({ 
    status: 'ok',
    framework: 'Native Vercel Function',
    timestamp: new Date().toISOString()
  });
}
