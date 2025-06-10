import bancho from "bancho.js";
import nodesu from "nodesu";
import mongoose from "mongoose";
import Map from "./models/maps.js";

// Ensure mongoose is connected (for serverless)
if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.DATABASE);
}

const MAP_LINK_REGEX = {
  beatmap_official: /https?:\/\/osu.ppy.sh\/beatmapsets\/[0-9]+\#(osu|taiko|fruits|mania)\/([0-9]+)/,
  beatmap_old: /https?:\/\/(osu|old).ppy.sh\/b\/([0-9]+)/,
  beatmap_alternate: /https?:\/\/osu.ppy.sh\/beatmaps\/([0-9]+)/,
  beatmap_old_alternate: /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?b=([0-9]+)/,
  beatmapset_official: /https?:\/\/osu.ppy.sh\/beatmapsets\/([0-9]+)/,
  beatmapset_old: /https?:\/\/(osu|old).ppy.sh\/s\/([0-9]+)/,
  beatmapset_old_alternate: /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?s=([0-9]+)/,
};

/**
 * Validates and extracts beatmap ID from the provided map link
 * @param {string} mapLink - The map link to validate and parse
 * @returns {string} The extracted beatmap ID
 * @throws {Error} If the map link is invalid
 */
function validateAndExtractBeatmapId(mapLink) {
  const trimmedLink = mapLink.trim();
  let matchedRegex = null;
  
  for (const key in MAP_LINK_REGEX) {
    if (MAP_LINK_REGEX[key].test(trimmedLink)) {
      matchedRegex = MAP_LINK_REGEX[key];
      break;
    }
  }

  if (!matchedRegex) {
    throw new Error("Invalid map link. Please use a valid osu! map link.");
  }

  const match = trimmedLink.match(matchedRegex);
  
  if (matchedRegex === MAP_LINK_REGEX.beatmap_official) {
    return match[2];
  } else if (
    matchedRegex === MAP_LINK_REGEX.beatmap_old ||
    matchedRegex === MAP_LINK_REGEX.beatmap_old_alternate
  ) {
    return match[2];
  } else if (matchedRegex === MAP_LINK_REGEX.beatmap_alternate) {
    return match[1];
  } else {
    throw new Error("Please provide a direct beatmap link, not a beatmapset link.");
  }
}

/**
 * Retrieves beatmap information using the osu! API
 * @param {string} beatmapId - The beatmap ID to fetch
 * @returns {Promise<Object>} The beatmap information
 * @throws {Error} If the beatmap cannot be found or is not standard mode
 */
async function getBeatmapInfo(beatmapId) {
  const api = new nodesu.Client(process.env.API_KEY);
  const beatmaps = await api.beatmaps.getByBeatmapId(beatmapId);

  if (beatmaps.length === 0) {
    throw new Error("No beatmaps found.");
  }

  const beatmap = beatmaps[0];
  if (beatmap.mode !== 0) {
    throw new Error("Only standard maps are allowed.");
  }

  return beatmap;
}

/**
 * Formats the message to be sent to the user
 * @param {string} mapLink - The original map link
 * @param {Object} beatmap - The beatmap information
 * @param {string[]} mods - Optional mods to include
 * @returns {string} The formatted message
 */
function formatMessage(mapLink, beatmap, mods = []) {
  let message = `[${mapLink} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]]`;
  
  if (mods && mods.length > 0) {
    message += ` +${mods.join("")}`;
  }

  const starRating = Math.round(beatmap.difficultyrating * 10) / 10;
  message += ` | ${starRating}★ | BPM: ${beatmap.bpm}`;
  
  return message;
}

/**
 * Sends a message to a user via bancho
 * @param {string} username - The username to send the message to
 * @param {string} message - The message to send
 */
async function sendBanchoMessage(username, message) {
  const client = new bancho.BanchoClient({
    username: process.env.OSU_USERNAME,
    password: process.env.OSU_PWD,
  });

  try {
    await client.connect();
    await client.getSelf().sendMessage(`@${username} : ${message}`);
  } finally {
    client.disconnect();
  }
}

/**
 * Saves the map information to the database
 * @param {Object} beatmap - The beatmap information
 * @param {string} username - The username who submitted the map
 * @param {string[]} mods - The mods used
 * @returns {Promise<Object>} The created map document
 */
async function saveMapToDatabase(beatmap, username, mods) {
  return await Map.create({
    beatmapId: beatmap.beatmap_id,
    mapInfo: [beatmap],
    username,
    mods,
    createdAt: new Date(),
  });
}

/**
 * Handles map submission and info update.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { map, mods, username } = req.body;
    
    if (!map || !username) {
      return res.status(400).json({ error: "Missing required fields: map and username." });
    }

    const beatmapId = validateAndExtractBeatmapId(map);
    const beatmap = await getBeatmapInfo(beatmapId);
    const finalMessage = formatMessage(map, beatmap, mods);
    
    await sendBanchoMessage(username, finalMessage);
    const createdMap = await saveMapToDatabase(beatmap, username, mods);

    return res.status(200).json({
      success: true,
      message: finalMessage,
      mapInfo: beatmap,
      id: createdMap?._id,
    });
  } catch (err) {
    console.error("Error in Sender handler:", err, req.body);
    const statusCode = err.message.includes("Invalid") || err.message.includes("Please") ? 400 : 500;
    return res.status(statusCode).json({ error: err.message || "Internal server error." });
  }
}
