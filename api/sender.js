import bancho from "bancho.js";
import nodesu from "nodesu";
import mongoose from "mongoose";
import Map from "./models/maps.js"; // Adjust path if needed

// Ensure mongoose is connected (for serverless)
if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.DATABASE);
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

		const regex = {
			beatmap_official: /https?:\/\/osu.ppy.sh\/beatmapsets\/[0-9]+\#(osu|taiko|fruits|mania)\/([0-9]+)/,
			beatmap_old: /https?:\/\/(osu|old).ppy.sh\/b\/([0-9]+)/,
			beatmap_alternate: /https?:\/\/osu.ppy.sh\/beatmaps\/([0-9]+)/,
			beatmap_old_alternate: /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?b=([0-9]+)/,
			beatmapset_official: /https?:\/\/osu.ppy.sh\/beatmapsets\/([0-9]+)/,
			beatmapset_old: /https?:\/\/(osu|old).ppy.sh\/s\/([0-9]+)/,
			beatmapset_old_alternate: /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?s=([0-9]+)/,
		};

    let matchedRegex = null;
    for (const key in regex) {
      if (regex[key].test(map)) {
        matchedRegex = regex[key];
        break;
      }
    }

    if (!matchedRegex) {
      return res.status(400).json({ error: "Invalid map link. Please use a valid osu! map link." });
    }

    const fullMapLink = map.trim();
    
    let beatmapId;
    const match = map.match(matchedRegex);
    if (matchedRegex === regex.beatmap_official) {
      beatmapId = match[2];
    } else if (
      matchedRegex === regex.beatmap_old ||
      matchedRegex === regex.beatmap_old_alternate
    ) {
      beatmapId = match[2];
    } else if (matchedRegex === regex.beatmap_alternate) {
      beatmapId = match[1];
    } else {
      // For beatmapset links, you may want to reject or handle differently
      return res.status(400).json({ error: "Please provide a direct beatmap link, not a beatmapset link." });
    }

    const client = new bancho.BanchoClient({
      username: process.env.OSU_USERNAME,
      password: process.env.OSU_PWD,
    });

    const api = new nodesu.Client(process.env.API_KEY);
    const beatmaps = await api.beatmaps.getByBeatmapId(beatmapId);

    if (beatmaps.length == 0) {
      client.disconnect();
      return res.status(400).json({ error: "No beatmaps found." });
    }

    await client.connect();
    const beatmap = beatmaps[0];

    if (beatmap.mode != 0) {
      return res.status(400).json({ error: `Only osu!standard maps are allowed. this map is ${['Standard', 'Taiko', 'Catch the Beat', 'Mania'][beatmap.mode] || 'Unknown'} mode.` });
    }

    let finalMessage = `[${fullMapLink} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]]`;
    if (mods && mods.length > 0) {
      finalMessage += ` +${mods.join("")}`;
    }

    const starRating = Math.round(beatmap.difficultyrating * 10) / 10;
    finalMessage += ` | ${starRating}★ | BPM: ${beatmap.bpm}`;

    await client.getSelf().sendMessage(`@${username} : ${finalMessage}`);

    client.disconnect();

    const createdMap = await Map.create({
      beatmapId: beatmap.beatmap_id,
      mapInfo: [beatmap],
      username,
      mods,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: finalMessage,
      mapInfo: beatmap,
      id: createdMap ? createdMap._id : undefined,
    });
    
  } catch (err) {
    console.error("Error in Sender handler:", err, req.body);
    return res.status(500).json({ error: "Internal server error." });
  }
}