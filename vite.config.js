import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { pathToFileURL } from 'url';

function apiDevMiddleware() {
  const handler = (server) => {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url.startsWith('/api/')) {
        return next();
      }

      const urlPath = req.url.split('?')[0].replace(/^\/api\//, '');
      const handlerName = urlPath.replace(/\.js$/, '');

      try {
        const filePath = path.resolve(process.cwd(), 'api', `${handlerName}.js`);
        const fileUrl = pathToFileURL(filePath).href;
        const mod = await import(`${fileUrl}?t=${Date.now()}`);
        if (mod && mod.default) {
          enhanceResponse(res);

          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            let bodyStr = '';
            req.on('data', (chunk) => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                req.body = bodyStr ? JSON.parse(bodyStr) : {};
              } catch {
                req.body = {};
              }
              try {
                await mod.default(req, res);
              } catch (err) {
                res.status(500).json({ error: err.message });
              }
            });
          } else {
            await mod.default(req, res);
          }
          return;
        }
      } catch (err) {
        console.error('API middleware error:', err);
      }
      next();
    });
  };

  return {
    name: 'api-dev-middleware',
    configureServer: handler,
    configurePreviewServer: handler
  };
}

function enhanceResponse(res) {
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this;
  };
}

export default defineConfig({
  plugins: [react(), apiDevMiddleware()]
});
