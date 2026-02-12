import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely expose the API_KEY from build environment to the client code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});