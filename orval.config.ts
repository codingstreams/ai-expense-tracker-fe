import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:8080/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: './generated',
      schemas: './generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './service/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
