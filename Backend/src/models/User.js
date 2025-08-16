import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  airtableId: { type: String }, // optional unless you plan to store Airtable userId
  airtableToken: { type: String, required: true },
  airtableRefreshToken: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
