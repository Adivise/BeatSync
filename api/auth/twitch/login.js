export default function handler(req, res) {
  const clientId = process.env.TWITCH_CLIENT;
  const redirectUri = `${process.env.BASE_URL}/api/auth/twitch/callback`;
  const scope = 'user:read:email';

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;

  res.writeHead(302, { Location: twitchAuthUrl });
  res.end();
}
