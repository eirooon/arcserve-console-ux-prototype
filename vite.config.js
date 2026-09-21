import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: "/arcserve-console-ux-prototype/",
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          "vendor-mui-data-grid": ["@mui/x-data-grid"],
          "vendor-mui-charts": ["@mui/x-charts"],
        },
      },
    },
  },
});
