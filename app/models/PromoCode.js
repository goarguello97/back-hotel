import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PromoCodeModel = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    code: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    offer: { type: Schema.Types.ObjectId, ref: "Offer" },
  },
  { versionKey: false, timestamps: true }
);

export default model("PromoCode", PromoCodeModel);
