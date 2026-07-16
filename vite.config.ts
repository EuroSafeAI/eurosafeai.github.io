import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { existsSync } from "fs";

/* Some local proxies/VPNs/extensions send compressed WebSocket frames the
 * HMR server never negotiated (WS_ERR_UNEXPECTED_RSV_1). Without an error
 * listener on the socket, that single bad frame kills the whole dev server.
 * Log it and drop the connection instead. */
const hmrSocketErrorGuard = (): Plugin => ({
  name: "hmr-socket-error-guard",
  apply: "serve",
  configureServer(server) {
    server.ws.on("connection", (socket: { on: (ev: string, cb: (err: Error) => void) => void }) => {
      socket.on("error", (err) => {
        server.config.logger.warn(`[hmr] websocket error (connection dropped, server kept alive): ${err.message}`);
      });
    });
  },
});

/* GitHub Pages resolves /some/dir to /some/dir/index.html, but the Vite dev
 * server falls through to the SPA instead. Mirror the production behavior so
 * clean URLs into public/ (e.g. /institute-efforts/canada) work in dev. */
const publicDirIndexFallback = (): Plugin => ({
  name: "public-dir-index-fallback",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = (req.url ?? "").split("?")[0];
      if (
        req.method === "GET" &&
        !url.includes(".") &&
        existsSync(path.join(__dirname, "public", url, "index.html"))
      ) {
        req.url = path.posix.join(url, "index.html");
      }
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "localhost",
    port: Number(process.env.PORT) || 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), hmrSocketErrorGuard(), publicDirIndexFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-router")) return "react-vendor";
          if (id.includes("/react-dom/") || id.includes("/react/")) return "react-vendor";
          if (id.includes("scheduler")) return "react-vendor";
          if (id.includes("@radix-ui")) return "radix-vendor";
          if (id.includes("framer-motion")) return "motion-vendor";
          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("/zod/")
          ) {
            return "forms-vendor";
          }
          return undefined;
        },
      },
    },
  },
}));
