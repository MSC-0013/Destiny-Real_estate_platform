import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  wishlist: [{ type: String }] // property IDs
});

export default mongoose.model("Wishlist", wishlistSchema);
