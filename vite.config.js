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
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://127.0.0.1:57005",
  //       changeOrigin: true,
  //     },
  //   },
  // },
  server: {
    https: {
      key: 'key.pem',
      cert: 'cert.pem'
    }
  }
});