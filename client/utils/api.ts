/**
 * API 配置工具
 * 自动适配开发环境和 Vercel 生产环境
 */

/**
 * 获取 API Base URL
 * - 开发环境：使用 EXPO_PUBLIC_BACKEND_BASE_URL
 * - Vercel 生产环境：使用相对路径
 */
export function getApiBaseUrl(): string {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

  // 如果配置了后端 URL（开发环境），直接使用
  if (backendUrl) {
    return backendUrl;
  }

  // Vercel 生产环境：使用相对路径，通过 Vercel Rewrites 处理
  if (typeof window !== 'undefined') {
    // Web 环境：使用相对路径
    return '';
  }

  // 默认：使用本地开发环境
  return 'http://localhost:9091';
}

/**
 * 构建 API 完整 URL
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * 获取完整的 API URL（用于调试）
 */
export function getFullApiUrl(path: string): string {
  const apiUrl = buildApiUrl(path);
  // 如果是相对路径，加上当前域名
  if (apiUrl.startsWith('/')) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${apiUrl}`;
    }
  }
  return apiUrl;
}
