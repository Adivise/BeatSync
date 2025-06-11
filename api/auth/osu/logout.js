export default function handler(req, res) {
    const baseUrl = process.env.BASE_URL || '';
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    res.setHeader('Set-Cookie', [
        `osuUser=; Path=/; HttpOnly; SameSite=Lax; Secure; Domain=${domain}; Max-Age=0`
    ]);

    res.writeHead(302, { Location: '/login' });
    res.end();
} 