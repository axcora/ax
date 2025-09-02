import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { watch } from 'chokidar';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';

// ABSOLUTE path ke build.js di CLI/engine
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUILD_SCRIPT = path.join(__dirname, 'build.js');

const distDir = path.resolve('dist');
const port = 3000;
const wsPort = 35729;

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  if (reqPath === '/blog.html') reqPath = '/blog/index.html';
  let filePath = path.join(distDir, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      if (filePath.endsWith('.html')) {
        // Make sure string interpolation correct!
        const reloadScript = `
<script>
(() => {
  const ws = new WebSocket('ws://localhost:${wsPort}');
  ws.onmessage = (event) => {
    if (event.data === 'reload') window.location.reload();
  };
})();
</script>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data.toString() + reloadScript);
      } else {
        res.end(data);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`🚀 Dev Server: http://localhost:${port}`);
});

// 2. WebSocket server buat live reload
const wss = new WebSocketServer({ port: wsPort });
function triggerReload() {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send('reload');
  });
}

// 3. Watch & auto build (debounce 300ms)
let buildTimeout = null;
const watcher = watch(['content', 'templates', 'data', 'assets'], { ignoreInitial: true });

const build = () => {
  const buildProcess = spawn('node', [BUILD_SCRIPT], { stdio: 'inherit', shell: true });
  buildProcess.on('close', code => {
    if (code === 0) {
      console.log('✓ Build updated.');
      triggerReload();
    } else {
      console.error('✗ Build failed.');
    }
  });
};

build(); // Initial build

watcher.on('all', (event, filePath) => {
  console.log(`🔄 Change detected: ${filePath}`);
  if (buildTimeout) clearTimeout(buildTimeout);
  buildTimeout = setTimeout(build, 300);
});
