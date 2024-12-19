// models/Url.js
import mongoose from "mongoose";
import moment from "moment";

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
},  { timestamps: true });

// Override the `save` method to set `createdAt` with Moment.js
urlSchema.pre('save', function (next) {

    this.createdAt = moment().toDate(); // Set `createdAt` using Moment.js if not already set
  
  next();
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
