import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/algoritmos/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            if (id.includes('/algorithms/sorting/')) return 'demos-sorting';
            if (id.includes('/algorithms/graphs/')) return 'demos-graphs';
            if (id.includes('/algorithms/structures/')) return 'demos-structures';
            if (id.includes('/algorithms/strings/')) return 'demos-strings';
            if (id.includes('/algorithms/remaining/')) return 'demos-remaining';
            if (id.includes('/algorithms/bulk/')) return 'demos-bulk';
            return undefined;
          }
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
            return 'vendor-react';
          }
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('i18next')) return 'vendor-i18n';
          if (id.includes('html-to-image') || id.includes('gifenc')) return 'vendor-export';
          return 'vendor';
        },
      },
    },
  },
});
