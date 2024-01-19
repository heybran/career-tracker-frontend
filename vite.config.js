import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
    },
  },
  build: {
    outDir: "build"
  },
  server: {
    https: {
      key: 'key.pem',
      cert: 'cert.pem'
    }
  }
});