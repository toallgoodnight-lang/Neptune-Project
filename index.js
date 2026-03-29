import { createServer } from "http";
import express from "express";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

// ✅ correct modern import
import * as wisp from "@mercuryworkshop/wisp-js/server";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

// ── Static frontend ─────────────────────────────
app.use(express.static(join(__dirname, "public")));

// ── Scramjet ────────────────────────────────────
app.use(
  "/scramjet/",
  express.static(
    join(__dirname, "node_modules/@mercuryworkshop/scramjet/dist")
  )
);

// ── Bare-mux ────────────────────────────────────
app.use(
  "/baremux/",
  express.static(
    join(__dirname, "node_modules/@mercuryworkshop/bare-mux/dist")
  )
);

// ── Libcurl ─────────────────────────────────────
app.use(
  "/libcurl/",
  express.static(
    join(__dirname, "node_modules/@mercuryworkshop/libcurl-transport/dist")
  )
);

// ── HTTP server ────────────────────────────────
const server = createServer(app);

// ── ✅ Wisp WebSocket handler (FIXED) ───────────
server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/wisp/")) {
    // ✅ modern usage: call wisp directly
    wisp(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════╗`);
  console.log(`  ║   Neptune Proxy — Running    ║`);
  console.log(`  ║   http://localhost:${PORT}     ║`);
  console.log(`  ╚══════════════════════════════╝\n`);
});
