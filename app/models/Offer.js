import { Schema, model } from "mongoose";

const OfferModel = new Schema(
  {
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
