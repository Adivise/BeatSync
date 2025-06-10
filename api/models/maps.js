import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mapsSchema = new Schema(
  {
    beatmapId: { type: String, required: true },
    mapInfo: {
      type: Array,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    mods: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Map = mongoose.models.map || mongoose.model("map", mapsSchema);

export default Map;