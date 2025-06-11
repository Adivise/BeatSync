export default function handler(req, res) {
  const osuUser = req.cookies.osuUser;

  if (!osuUser) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated with osu!'
    });
  }

  try {
    const user = JSON.parse(decodeURIComponent(osuUser));
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        country_code: user.country_code
      }
    });
  } catch (error) {
    console.error('Error parsing osu! user data:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing user data'
    });
  }
} 