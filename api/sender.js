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

    const osuMapRegex = /https:\/\/osu\.ppy\.sh\/(beatmapsets\/\d+#osu\/\d+|b\/\d+|beatmaps\/\d+)/;
    if (!osuMapRegex.test(map)) {
      return res.status(400).json({ error: "Invalid map link. Please use a valid osu! map link." });
    }

    // https://osu.ppy.sh/beatmapsets/123456#osu/654321
    // https://osu.ppy.sh/b/4875522
    // https://osu.ppy.sh/beatmaps/5053677

    const fullMapLink = map.trim();
    const mapID = fullMapLink.split("/").pop();

    const client = new bancho.BanchoClient({
      username: process.env.OSU_USERNAME,
      password: process.env.OSU_PWD,
    });

    await client.connect();
    const api = new nodesu.Client(process.env.API_KEY);
    const beatmaps = await api.beatmaps.getByBeatmapId(mapID);

    if (!beatmaps || beatmaps.length === 0) {
      client.disconnect();
      return res.status(400).json({ error: "No beatmaps found." });
    }

    const beatmap = beatmaps[0];

    if (beatmap.mode !== 0) {
      return res.status(400).json({ error: "Only standard maps are allowed." });
    }

    let finalMessage = `[${fullMapLink} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]]`;
    if (mods && mods.length > 0) {
      finalMessage += ` +${mods.join(", ")}`;
    }
    await client.getSelf().sendMessage(finalMessage);

    client.disconnect();

    // Upsert map info in the database
    await Map.updateOne(
      { beatmapId: beatmap.beatmap_id },
      { mapInfo: [beatmap], username, mods },
      { upsert: true }
    );
    const updatedMap = await Map.findOne({ beatmapId: beatmap.beatmap_id });

    return res.status(200).json({
      success: true,
      message: finalMessage,
      mapInfo: beatmap,
      id: updatedMap ? updatedMap._id : undefined,
    });
  } catch (err) {
    console.error("Error in Sender handler:", err, req.body);
    return res.status(500).json({ error: "Internal server error." });
  }
}
