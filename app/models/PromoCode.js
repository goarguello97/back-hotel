import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import generatePromoCode from "../utils/generatePromoCode";
const PromoCodeModel = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    code: { type: String, unique: true },
    used: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    offer: { type: Schema.Types.ObjectId, ref: "Offer" },
  },
  { versionKey: false, timestamps: true }
);

PromoCodeModel.pre("save", function (next) {
  if (!this.code) {
    this.code = generatePromoCode(10);
  }
  next();
});

export default model("PromoCode", PromoCodeModel);
