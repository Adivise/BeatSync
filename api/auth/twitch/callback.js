import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.TWITCH_CLIENT;
  const clientSecret = process.env.TWITCH_SECRET;
  const redirectUri = `${process.env.BASE_URL}/api/auth/twitch/callback`;

  if (!code) {
    res.status(400).send('Missing code');
    return;
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    res.status(400).json({ error: 'Failed to get access token', details: tokenData });
    return;
  }

  // Optionally: fetch user info
  const userRes = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Client-Id': clientId,
    },
  });
  const userData = await userRes.json();
  const user = userData.data[0];

  const baseUrl = process.env.BASE_URL || '';
  const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Set a cookie with user info with proper settings
  res.setHeader('Set-Cookie', [
    `twitchUser=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly; SameSite=Lax; Secure; Domain=${domain}`
  ]);

  // Redirect to frontend
  res.writeHead(302, { Location: `/` });
  res.end();
}
