const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY || 'my-secret-key';

app.use((req, res, next) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/ping', (req, res) => res.json({ status: 'ok' }));

app.post('/api/data', (req, res) => {
  res.json({ received: req.body });
});

app.listen(process.env.PORT || 3000);
