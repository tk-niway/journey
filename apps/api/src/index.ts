import { serve } from '@hono/node-server';
import api from './api/routers';
import generateOpenApiYml from '../scripts/generate-openapi-yml';

// スキーマファイルを生成
generateOpenApiYml();

const server = serve({
  fetch: api.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

// shutdown
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});