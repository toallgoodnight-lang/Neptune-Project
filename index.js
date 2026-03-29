import { createServer } from "http";
import { createRequire } from "module";
import express from "express";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { routeRequest } from "@mercuryworkshop/wisp-js/server";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

// ── Serve static frontend ──────────────────────────────────
app.use(express.static(join(__dirname, "public")));

// ── Serve Scramjet dist files at /scramjet/ ───────────────
app.use(
  "/scramjet/",
  express.static(
    join(__dirname, "node_modules/@mercuryworkshop/scramjet/dist")
  )
);

// ── Serve bare-mux at /baremux/ ───────────────────────────
app.use(
  "/baremux/",
  express.static(
    join(__dirname, "node_modules/@mercuryworkshop/bare-mux/dist")
  )
);

// ── Serve libcurl transport at /libcurl/ ──────────────────
app.use(
  "/libcurl/",
  express.static(
    join(__dirname, "node_modules/@mercuryworkshop/libcurl-transport/dist")
  )
);

// ── HTTP server ────────────────────────────────────────────
const server = createServer(app);

// ── Wisp WebSocket handler (replaces bare server) ─────────
server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/wisp/")) {
    routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════╗`);
  console.log(`  ║   Neptune Proxy — Running    ║`);
  console.log(`  ║   http://localhost:${PORT}     ║`);
  console.log(`  ╚══════════════════════════════╝\n`);
});
