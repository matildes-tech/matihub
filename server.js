const http = require('http');
const fs   = require('fs');
const path = require('path');
const dir  = __dirname;
const PORT = 3000;

const mime = {
  '.html':'text/html', '.css':'text/css', '.js':'application/javascript',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.svg':'image/svg+xml', '.mp4':'video/mp4', '.webm':'video/webm',
  '.woff':'font/woff', '.woff2':'font/woff2', '.json':'application/json',
  '.ico':'image/x-icon'
};

http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const fp = path.join(dir, decodeURIComponent(file));
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(fp)] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => console.log('MATIHUB server running on http://localhost:' + PORT));
