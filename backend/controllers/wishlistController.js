import Wishlist from "../models/Wishlist.js";

// Get wishlist by user
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, wishlist: [] });
      await wishlist.save();
    }
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add property to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { propertyId } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { wishlist: propertyId } },
      { new: true, upsert: true }
    );

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove property from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { propertyId } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { wishlist: propertyId } },
      { new: true }
    );

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
