import { connectToDatabase } from './database.js';
import Map from './models/maps.js';

export default async function handler(req, res) {
  await connectToDatabase(); // Ensure mongoose is connected

  if (req.method === 'GET') {
    // Fetch all requests
    try {
      const maps = await Map.find({}).sort({ createdAt: -1 }).limit(25);
      return res.status(200).json({ maps });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  }

  if (req.method === 'POST') {
    // Add a new request with cooldown
    try {
      const { username, mods, map } = req.body;
      if (!username || !map) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      return res.status(201).json({ success: true });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
} 