const User = require("../db/models/user");

exports.saveProfile = async (req, res) => {
  try {
    const { profileLink } = req.body; // Extract profilePic from the request body
    const userId = req.user._id; // Get the user's ID from the authenticated request

    // Update the user's profile picture in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileLink }, // Update the profilePic field
      { new: true } // Return the updated document
    );

    // If the user is not found, return an error
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Import your user model

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user ID from JWT or session
    const updates = req.body; // Get the updates from the request body

    // Use findByIdAndUpdate to update the user directly
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates }, // Use $set to update only the fields present in updates
      { new: true, runValidators: true } // Return the updated user and validate fields
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
