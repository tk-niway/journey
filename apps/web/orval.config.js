import { defineConfig } from 'orval';

export default defineConfig({
  webApi: {
    output: {
      mode: 'tags-split',
      target: 'app/generated/web-api/',
      schemas: 'app/generated/web-api/model',
      client: 'react-query',
      mock: true,
      path: 'app/generated/web-api/',
      override: {
        mutator: {
          path: 'app/lib/axios-clients/api-client.ts',
          name: 'apiMutator',
        },
      },
    },
    input: {
      target: '../../shared/openapi.yml',
    },
  },
});
