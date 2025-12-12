export default function handler(req, res) {
    const baseUrl = process.env.BASE_URL || '';
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const isProduction = baseUrl.startsWith('https://') && !baseUrl.includes('localhost');

    let cookie = `osuUser=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
    if (isProduction) cookie += `; Secure; Domain=${domain}`;
    res.setHeader('Set-Cookie', [cookie]);
    
    res.writeHead(302, { Location: '/login' });
    res.end();
} 