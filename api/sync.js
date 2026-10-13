export default async function handler(req, res) {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { clicks, user } = req.body || {};

    if (clicks === undefined) {
      res.status(400).json({ error: 'Missing clicks field' });
      return;
    }

    const parsed = Number(clicks);
    if (!Number.isFinite(parsed) || parsed < 0) {
      res.status(422).json({ error: 'Invalid clicks value' });
      return;
    }

    const validClicks = Math.min(Math.floor(parsed), 200);

    console.info(`Received ${validClicks} clicks${user ? ` from ${user.id || user}` : ''}`);

    res.status(200).json({
      success: true,
      message: 'Server received clicks',
      addedClicks: validClicks,
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    console.error('sync handler error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
