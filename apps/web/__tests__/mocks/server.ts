import { setupServer } from 'msw/node';

/**
 * MSWサーバーのベース設定
 * 各テストで拡張して使用する
 */
export const server = setupServer();
