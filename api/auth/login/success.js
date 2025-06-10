export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/twitchUser=([^;]+)/);
    
    if (!match) {
      return res.status(400).json({ success: false, message: 'Not authenticated' });
    }

    let user;
    try {
      user = JSON.parse(decodeURIComponent(match[1]));
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }

    return res.status(200).json({ success: true, user: user });
  } catch (err) {
    console.error('Login success error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
} 