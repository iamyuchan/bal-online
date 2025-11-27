import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
      // Serve static files from build directory
      "/build/*": async (req) => {
        const path = new URL(req.url).pathname;
        const filePath = `.${path}`;

        try {
          const file = Bun.file(filePath);

          if (await file.exists()) {
            // Determine Content-Type based on file extension
            const contentType =
              path.endsWith(".js") ? "application/javascript" :
              path.endsWith(".wasm") ? "application/wasm" :
              path.endsWith(".data") ? "application/octet-stream" :
              "application/octet-stream";

            return new Response(file, {
              headers: {
                "Content-Type": contentType
              }
            });
          }

          return new Response("Not Found", { status: 404 });
        } catch (e) {
          return new Response("Not Found", { status: 404 });
        }
      },

      // Serve index.html for all unmatched routes
      "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
