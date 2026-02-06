const http = require("http");
const { exec } = require("child_process");
const { readFile, stat } = require("fs/promises");
const path = require("path");

const PORT = 3003;
const DIST_DIR = path.join(__dirname, "dist");

// --- MIME Types ---
const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// --- Health Check Definitions ---
const services = [
  { name: "Clawdbot Gateway", port: 18789, check: () => curlCheck("http://localhost:18789") },
  { name: "Agent Zero", port: 50080, check: () => curlCheck("http://localhost:50080") },
  { name: "Whisper STT", port: 8002, check: () => curlCheck("http://localhost:8002/health") },
  { name: "Planka", port: 18790, check: () => curlCheck("http://localhost:18790") },
  { name: "Kanban API", port: 3002, check: () => curlCheck("http://localhost:3002/api/health") },
  { name: "Ollama", port: 11434, check: () => curlCheck("http://localhost:11434/api/tags") },
  { name: "Marvin Cron", check: checkMarvinCron },
  { name: "Claude Processes", check: checkClaudeProcesses },
];

function run(cmd, timeout = 3000) {
  return new Promise((resolve) => {
    exec(cmd, { timeout }, (err, stdout) => {
      if (err) resolve({ ok: false, output: "" });
      else resolve({ ok: true, output: stdout.trim() });
    });
  });
}

async function curlCheck(url) {
  const { ok } = await run(`curl -s --max-time 2 -o /dev/null -w "%{http_code}" ${url}`);
  if (!ok) return { status: "down", detail: "Connection refused" };
  return { status: "up", detail: "Reachable" };
}

async function checkMarvinCron() {
  const { ok, output } = await run("crontab -l 2>/dev/null | grep marvin");
  if (!ok || !output) return { status: "down", detail: "No Marvin cron found" };
  const { ok: logOk, output: logAge } = await run(
    'find /home/moltbot/marvin/ -name "*.log" -mmin -10 2>/dev/null | head -1'
  );
  if (logOk && logAge) return { status: "up", detail: "Cron active, recent log" };
  return { status: "degraded", detail: "Cron exists, no recent activity" };
}

async function checkClaudeProcesses() {
  const { ok, output } = await run('pgrep -c -f "claude" 2>/dev/null');
  const count = parseInt(output) || 0;
  if (count > 0) return { status: "up", detail: `${count} process${count > 1 ? "es" : ""}` };
  return { status: "down", detail: "No Claude processes" };
}

async function getSystemResources() {
  const [ramResult, diskResult, loadResult, uptimeResult] = await Promise.all([
    run("free -m"),
    run("df -h /"),
    readFile("/proc/loadavg", "utf-8").catch(() => ""),
    readFile("/proc/uptime", "utf-8").catch(() => ""),
  ]);

  let ram = { total: 0, used: 0, available: 0, percent: 0 };
  if (ramResult.ok) {
    const memLine = ramResult.output.split("\n").find((l) => l.startsWith("Mem:"));
    if (memLine) {
      const p = memLine.split(/\s+/);
      ram = { total: +p[1] || 0, used: +p[2] || 0, available: +p[6] || 0, percent: 0 };
      ram.percent = ram.total > 0 ? Math.round((ram.used / ram.total) * 100) : 0;
    }
  }

  let disk = { total: "", used: "", available: "", percent: 0 };
  if (diskResult.ok) {
    const line = diskResult.output.split("\n")[1];
    if (line) {
      const p = line.split(/\s+/);
      disk = { total: p[1] || "", used: p[2] || "", available: p[3] || "", percent: parseInt(p[4]) || 0 };
    }
  }

  let load = { avg1: 0, avg5: 0, avg15: 0 };
  if (loadResult) {
    const p = loadResult.split(" ");
    load = { avg1: parseFloat(p[0]) || 0, avg5: parseFloat(p[1]) || 0, avg15: parseFloat(p[2]) || 0 };
  }

  let uptime = "";
  if (uptimeResult) {
    const seconds = parseFloat(uptimeResult.split(" ")[0]) || 0;
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    uptime = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return { ram, disk, load, uptime };
}

async function gatherStatus() {
  const checks = await Promise.all(
    services.map(async (svc) => ({
      name: svc.name,
      port: svc.port || null,
      ...(await svc.check()),
    }))
  );
  const resources = await getSystemResources();
  return { timestamp: new Date().toISOString(), services: checks, resources };
}

// --- Static File Server ---
async function serveStatic(req, res) {
  let filePath = path.join(DIST_DIR, req.url === "/" ? "index.html" : req.url);
  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = path.join(filePath, "index.html");
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    // SPA fallback: serve index.html for non-file routes
    try {
      const data = await readFile(path.join(DIST_DIR, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
}

// --- HTTP Server ---
const server = http.createServer(async (req, res) => {
  if (req.url === "/api/status" && req.method === "GET") {
    try {
      const status = await gatherStatus();
      res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify(status));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    await serveStatic(req, res);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Nexus Dashboard running on http://0.0.0.0:${PORT}`);
});
