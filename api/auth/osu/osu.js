export default function handler(req, res) {
    const clientId = process.env.OSU_CLIENT;
    const redirectUri = `${process.env.BASE_URL}/api/auth/osu/callback`;
    const scope = 'identify';

    const authUrl = `https://osu.ppy.sh/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;

    res.writeHead(302, { Location: authUrl });
    res.end();
}