// models/Url.js
import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, unique: true, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  password: { type: String },
  expiryDate: { type: Date },
  visitCount: { type: Number, default: 0 },
  linkType: {
    type: String,
    enum: [
      "open",
      "password_protected",
      "expiry",
      "password_protected_and_expiry",
    ],
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
