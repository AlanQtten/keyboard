import { defineConfig } from 'vite';
import { defineConfig as defineVitestConfig, mergeConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default mergeConfig(
  defineConfig({
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'keyboard',
        fileName: 'keyboard',
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }
  }),
  defineVitestConfig({
    test: {
      include: ['src/**/__test__/*'],
      environment: 'jsdom',
    },
  })
);
