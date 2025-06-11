import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OSU_CLIENT;
  const clientSecret = process.env.OSU_SECRET;
  const redirectUri = `${process.env.BASE_URL}/api/auth/osu/callback`;

  if (!code) {
    res.status(400).send('Missing code');
    return;
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://osu.ppy.sh/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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

    // Fetch user info
    const userRes = await fetch('https://osu.ppy.sh/api/v2/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    const userData = await userRes.json();
    
    if (!userData.id) {
      res.status(400).json({ error: 'Failed to get user data', details: userData });
      return;
    }

    const user = {
      id: userData.id,
      username: userData.username,
      avatar_url: userData.avatar_url,
      country_code: userData.country_code,
      access_token: tokenData.access_token
    };

    const baseUrl = process.env.BASE_URL || '';
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Set a cookie with user info with proper settings
    res.setHeader('Set-Cookie', [
      `osuUser=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly; SameSite=Lax; Secure; Domain=${domain}`
    ]);

    // Redirect to frontend
    res.writeHead(302, { Location: `/` });
    res.end();
  } catch (error) {
    console.error('Osu callback error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
