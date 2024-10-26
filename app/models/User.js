import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserModel = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    offers: { type: [Schema.Types.ObjectId], ref: "Offers" },
  },
  { versionKey: false, timestamps: true }
);

UserModel.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default model("User", UserModel);
