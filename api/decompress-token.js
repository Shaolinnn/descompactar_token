import zlib from 'zlib';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { compressedToken } = req.body;
  if (!compressedToken) {
    return res.status(400).json({ error: 'compressedToken missing' });
  }

  try {
    const base64 = decodeURIComponent(compressedToken)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .replace(/%2B/g, '+')
      .replace(/%2F/g, '/');

    const buffer = Buffer.from(base64, 'base64');

    zlib.gunzip(buffer, (err, decoded) => {
      if (err) {
        return res.status(500).json({ error: 'Decompression failed', details: err.message });
      }
      res.status(200).json({ access_token: decoded.toString('utf-8') });
    });
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error', details: error.message });
  }
}
