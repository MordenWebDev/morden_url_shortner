import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({

  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

const User = mongoose.model('User', userSchema);

export default User;
