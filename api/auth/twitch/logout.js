export default function handler(req, res) {
    // Extract hostname from BASE_URL (remove protocol)
    const baseUrl = process.env.BASE_URL || '';
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Clear the twitchUser cookie with matching flags
    res.setHeader('Set-Cookie', [
      `twitchUser=; Path=/; HttpOnly; SameSite=Lax; Secure; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ]);
    // Redirect to /login
    res.writeHead(302, { Location: '/login' });
    res.end();
}