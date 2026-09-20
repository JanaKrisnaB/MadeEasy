import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // OAuth callback handler for Supabase / Google OAuth popup and redirect
  app.get(['/auth/callback', '/auth/callback/'], (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Authenticating...</title>
    <style>
      body { font-family: monospace; background: #090b10; color: #34d399; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
      .box { border: 1px solid #1e2638; padding: 28px; border-radius: 10px; background: #0e121b; text-align: center; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      h3 { margin: 0 0 8px 0; color: #fff; font-size: 16px; }
      p { margin: 0; color: #94a3b8; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="box">
      <h3>Google Authentication Complete</h3>
      <p>Synchronizing your account and closing window...</p>
    </div>
    <script>
      try {
        if (window.opener) {
          window.opener.postMessage({
            type: 'OAUTH_AUTH_SUCCESS',
            url: window.location.href,
            hash: window.location.hash,
            search: window.location.search
          }, '*');
          setTimeout(function() {
            window.close();
          }, 300);
        } else {
          window.location.href = '/' + window.location.hash;
        }
      } catch (err) {
        window.location.href = '/' + window.location.hash;
      }
    </script>
  </body>
</html>`);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
