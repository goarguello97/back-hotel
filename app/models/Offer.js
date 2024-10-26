import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const OfferModel = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model("Offer", OfferModel);
