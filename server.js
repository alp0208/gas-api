const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// トップページ（URL入力フォーム）
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Proxy</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 60px auto; padding: 0 20px; }
    h1 { font-size: 24px; }
    input { width: 100%; padding: 10px; font-size: 16px; box-sizing: border-box; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 10px 24px; font-size: 16px; background: #4A90E2; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #357ABD; }
  </style>
</head>
<body>
  <h1>Web Proxy</h1>
  <form action="/proxy" method="GET">
    <input type="text" name="url" placeholder="https://example.com" />
    <button type="submit">アクセス</button>
  </form>
</body>
</html>
  `);
});

// プロキシ処理
app.get('/proxy', async (req, res) => {
  let url = req.query.url;
  if (!url) return res.redirect('/');
  if (!url.startsWith('http')) url = 'https://' + url;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const contentType = response.headers.get('content-type') || '';
    const body = await response.text();

    res.setHeader('Content-Type', contentType);
    res.send(body);
  } catch (e) {
    res.status(500).send(`<p>エラー: ${e.message}</p><a href="/">戻る</a>`);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('起動しました'));
