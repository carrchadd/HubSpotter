const Location = require('../models/locationModel');
const User = require('../models/userModel');
exports.deleteLocationByPlaceId = async (req, res) => {
    
    try {
      const placeId = req.params.placeId;
      console.log("Deleting location with placeId:", placeId);
  
      if (!placeId) {
        return res.status(400).json({ message: "Place ID is required" });
      }
  
      // Find the location by `placeId`
      const location = await Location.findOne({ placeId });
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
  
      // Remove location from the user's savedLocations array
      await User.updateMany(
        { savedLocations: location._id },
        { $pull: { savedLocations: location._id } }
      );
  
      // Delete the location from the database
      await Location.findByIdAndDelete(location._id);
  
      res.status(200).json({ message: "Location removed successfully" });
    } catch (error) {
      console.error("Error deleting location by placeId:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

exports.deleteLocation = async (req, res) => {
    try {
      const locationId = req.params.id;
      console.log("Deleting location with ID:", locationId);
  
      if (!locationId) {
        return res.status(400).json({ message: "Location ID is required" });
      }
  
      // Remove the location from the database
      const location = await Location.findByIdAndDelete(locationId);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
  
      // Remove location from the user's savedLocations array
      await User.updateMany(
        { savedLocations: locationId },
        { $pull: { savedLocations: locationId } }
      );
  
      res.status(200).json({ message: "Location removed successfully" });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

exports.saveLocation = async (req, res) => {
  try {
    const loc = new Location(req.body);
    await loc.save();

    const userId = req.user.id; // Ensure JWT auth provides req.user.id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedLocations.push(loc._id);
    await user.save();

    res.status(201).json({ message: "Location saved and added to user" });
  } catch (err) {
    console.error("Error saving location:", err);
    res.status(400).json({ message: err.message });
  }
};
