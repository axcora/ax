import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  blue: '\x1b[94m',
  cyan: '\x1b[96m',
};

function log(message, color = 'cyan') {
  console.log(colors[color] + message + colors.reset);
}

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Remove query strings
  filePath = filePath.split('?')[0];
  
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Try to serve index.html for SPA-like behavior
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err, indexContent) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
              <h1>404 - Page Not Found</h1>
              <p>The requested page <code>${req.url}</code> was not found.</p>
              <p><a href="/">← Back to Home</a></p>
            `);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      
      // Log request
      const timestamp = new Date().toLocaleTimeString();
      log(`[${timestamp}] ${req.method} ${req.url}`, 'green');
    }
  });
});

// Check if dist folder exists
if (!fs.existsSync(DIST_DIR)) {
  console.error(colors.yellow + '⚠ Warning: dist/ folder not found. Run "npm run build" first.' + colors.reset);
  process.exit(1);
}

server.listen(PORT, () => {
  console.clear();
  console.log(colors.cyan + `
 █████╗ ██╗  ██╗
██╔══██╗╚██╗██╔╝
███████║ ╚███╔╝ 
██╔══██║ ██╔██╗ 
██║  ██║██╔╝ ██╗
╚═╝  ╚═╝╚═╝  ╚═╝
    ` + colors.reset);
  
  log('🚀 Axcora AX Development Server', 'yellow');
  log('', 'reset');
  log('🌐 Server running at:', 'cyan');
  log(`   http://localhost:${PORT}`, 'green');
  log('', 'reset');
//  log('📁 Serving files from: dist/', 'yellow');
  log('💡 Press Ctrl+C to stop server', 'blue');
  log('', 'reset');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`❌ Port ${PORT} is already in use. Try a different port.`, 'yellow');
  } else {
    log(`❌ Server error: ${err.message}`, 'yellow');
  }
  process.exit(1);
});
