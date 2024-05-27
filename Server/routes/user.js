const router = require("express").Router();
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");

/* GET TRIP LIST */
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId");
    res.status(202).json(trips);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Failed to find trips.", error: err.message });
  }
});

/* ADD LISTING TO WISHLIST */
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId).populate("creator");

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId);

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId);
      await user.save();
      res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList });
    } else {
      user.wishList.push(listing);
      await user.save();
      res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList });
    }
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
});

/* GET PROPERTY LIST */
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params;
    const properties = await Listing.find({ creator: userId }).populate("creator");
    res.status(202).json(properties);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Failed to find properties.", error: err.message });
  }
});

/* DELETE PROPERTY */
router.delete("/:userId/properties/:propertyId", async (req, res) => {
  try {
    const { userId, propertyId } = req.params;
    // Check if the property belongs to the user
    const property = await Listing.findOne({ _id: propertyId, creator: userId });
    if (!property) {
      return res.status(403).json({ message: "You are not authorized to delete this property." });
    }
    // Delete the property
    await Listing.findByIdAndDelete(propertyId);
    res.status(200).json({ message: "Property deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete property.", error: err.message });
  }
});

/* EDIT PROPERTY */
router.put("/:userId/properties/:propertyId", async (req, res) => {
  try {
    const { userId, propertyId } = req.params;
    const { category, type, streetAddress, aptSuite, city, province, country, guestCount, bedroomCount, bedCount, bathroomCount, amenities, title, description, highlight, highlightDesc, price } = req.body;

    // Check if the property belongs to the user
    const property = await Listing.findOne({ _id: propertyId, creator: userId });
    if (!property) {
      return res.status(403).json({ message: "You are not authorized to edit this property." });
    }
    
    // Update the property
    await Listing.findByIdAndUpdate(propertyId, { category, type, streetAddress, aptSuite, city, province, country, guestCount, bedroomCount, bedCount, bathroomCount, amenities, title, description, highlight, highlightDesc, price });
    
    res.status(200).json({ message: "Property updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update property.", error: err.message });
  }
});

/* GET RESERVATION LIST */
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId");
    res.status(202).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Failed to find reservations.", error: err.message });
  }
});

module.exports = router;
