import { describe, it, expect } from 'vitest';
import app from '@api/index';

describe('GET /health - E2E', () => {
  it('ヘルスチェックエンドポイントに疎通できる', async () => {
    // Act: app.request() を使用してリクエスト
    const res = await app.request('/health');

    // Assert: ステータスコード
    expect(res.status).toBe(200);

    // Assert: レスポンスボディ
    const body = await res.text();
    expect(body).toBe('Health check successful');
  });
});
