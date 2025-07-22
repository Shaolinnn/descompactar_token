const express = require('express');
const zlib = require('zlib');
const app = express();

app.use(express.json());

app.post('/decompress-token', (req, res) => {
  const { compressedToken } = req.body;

  if (!compressedToken) {
    return res.status(400).json({ error: 'Token missing' });
  }

  const base64 = decodeURIComponent(compressedToken)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const buffer = Buffer.from(base64, 'base64');

  zlib.gunzip(buffer, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Decompression failed', details: err.message });
    }
    const token = decoded.toString('utf-8');
    res.json({ access_token: token });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
