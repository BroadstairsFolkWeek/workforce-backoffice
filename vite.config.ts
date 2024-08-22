import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    port: 53000,
  },
  plugins: [
    reactRefresh(),
    basicSsl({
      name: "localhost",
      domains: ["localhost"],
    }),
  ],
});
