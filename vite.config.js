import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        articles: resolve(__dirname, 'articles.html'),
        article: resolve(__dirname, 'article.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
