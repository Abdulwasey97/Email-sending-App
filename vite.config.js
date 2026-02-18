import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: "save-template",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/dev/save-template" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const filePath = path.resolve(
                  __dirname,
                  "src/data/template.json",
                );
                // Ensure directory exists just in case
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(filePath, body);
                res.statusCode = 200;
                res.end("Saved");
              } catch (err) {
                console.error("Error saving template:", err);
                res.statusCode = 500;
                res.end("Error saving: " + err.message);
              }
            });
          } else {
            next();
          }
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:44352",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
