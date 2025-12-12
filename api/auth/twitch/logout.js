export default function handler(req, res) {
    const baseUrl = process.env.BASE_URL || '';
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const isProduction = baseUrl.startsWith('https://') && !baseUrl.includes('localhost');

    let cookie = `twitchUser=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    if (isProduction) cookie += `; Secure; Domain=${domain}`;
    res.setHeader('Set-Cookie', [cookie]);
    
    res.writeHead(302, { Location: '/login' });
    res.end();
}