import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PencilIcon,
  XMarkIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useLoading } from "../context/LoadingContext";
import ProfileLoader from "./ProfileLoaderComponent";
const ProfileSlider = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [premiumSub, setPremiumSub] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null); // To store the new image
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  // const { loading, showLoading, hideLoading } = useLoading();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setName(userData.name || "No Data Available");
      setEmail(userData.email || "No Data Available");
      setUserStatus(
        userData.isActive ? "Active" : "Not Active" || "No Data Available"
      );
      setProfilePic(userData.profileLink || null);
      setPremiumSub(userData.premiumSubscription ? "Active " : "Not Active");
    }
  }, []);

  const navigate = useNavigate();

  function handleActiveClick() {
    navigate("/paymentform");
  }

  const cloudName = "dyys5bv25"; // Cloudinary cloud name
  const uploadPreset = "my_unsigned_preset"; // Cloudinary upload preset

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show the selected file as a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = async () => {
    if (newProfilePic) {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", newProfilePic);
        formData.append("upload_preset", uploadPreset);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        const imageUrl = response.data.secure_url;
        SaveLinkBackend(imageUrl);
        setProfilePic(imageUrl);
        setNewProfilePic(null); // Clear the new profile pic
        setIsEditingPic(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const SaveLinkBackend = async (link) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userData = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/profile/saveProfile`,
        { profileLink: link },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = {
        ...userData,
        profileLink: link,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      console.log(response.data);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };
  const handleSaveInfo = async () => {
    const currentUserData = JSON.parse(localStorage.getItem("user"));

    const updates = {};
    if (name !== currentUserData.name) updates.name = name;
    if (email !== currentUserData.email) updates.email = email;
    if (userStatus !== (currentUserData.isActive ? "Active" : "Not Active"))
      updates.isActive = userStatus === "Active";

    if (Object.keys(updates).length === 0) {
      alert("No updates detected");
      setIsEditingInfo(false);
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/profile/editProfile`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile information saved!");
    } catch (error) {
      console.error("Error saving profile information:", error);
    }

    // Update local storage
    const updatedUser = {
      ...currentUserData,
      ...updates,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setIsEditingInfo(false);
  };

  return (
    <>
      <motion.div
        initial={{ x: "100%", width: "20%" }}
        animate={{ x: isOpen ? "0%" : "100%", width: isOpen ? "70%" : "20%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full bg-gradient-to-r from-blue-200 to-blue-900 dark:from-gray-700 dark:to-gray-900 shadow-lg z-50 overflow-y-auto flex flex-col max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        <div className="p-4 flex flex-col gap-4">
          {/* Profile Picture Card */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-600 shadow-lg">
                  {isUploading ? (
                    <ProfileLoader />
                  ) : newProfilePic ? (
                    <img
                      src={newProfilePic}
                      alt="New Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 dark:text-gray-300">
                      No Image
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 flex gap-2">
                  {isEditingPic ? (
                    <>
                      <label
                        htmlFor="file-upload"
                        className="p-1 bg-blue-600 text-white rounded-full cursor-pointer shadow-md"
                      >
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <PlusIcon className="w-5 h-5" />
                      </label>
                      <button
                        onClick={() => setIsEditingPic(false)}
                        className="p-1 bg-red-600 text-white rounded-full shadow-md"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleConfirmUpload}
                        className="p-1 bg-green-600 text-white rounded-full shadow-md"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingPic(true)}
                      className="p-1 bg-blue-600 text-white rounded-full shadow-md"
                    >
                      {profilePic ? (
                        <PencilIcon className="w-5 h-5" />
                      ) : (
                        <PlusIcon className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Information Card */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            {isEditingInfo ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 dark:text-gray-200 text-sm font-medium">
                    Email:
                  </label>
                  <input
                    readOnly
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={handleSaveInfo}
                    className="py-2 px-3 bg-green-600 text-white rounded-md flex items-center gap-1 shadow-md"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingInfo(false)}
                    className="py-2 px-3 bg-red-600 text-white rounded-md flex items-center gap-1 shadow-md"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    User Information
                  </div>
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="p-2 bg-blue-600 text-white rounded-md shadow-md"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-2">
                  <strong className="text-gray-800 dark:text-gray-200">
                    Name:
                  </strong>{" "}
                  <span className="text-gray-600 dark:text-gray-300">
                    {name}
                  </span>
                </div>
                <div className="mb-2">
                  <strong className="text-gray-800 dark:text-gray-200">
                    Email:
                  </strong>{" "}
                  <span className="text-gray-600 dark:text-gray-300">
                    {email}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-800 dark:text-gray-200">
                    Status:
                  </strong>{" "}
                  <span className="text-gray-600 dark:text-gray-300">
                    {userStatus}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Subscription Status
              </div>
              {premiumSub === "Not Active" && (
                <button
                  onClick={handleActiveClick}
                  className="py-2 px-3 bg-green-600 text-white rounded-md shadow-md"
                >
                  Activate Now
                </button>
              )}
            </div>
            <div className="mt-4">
              <strong className="text-gray-800 dark:text-gray-200">
                Subscription:
              </strong>{" "}
              <span className="text-gray-600 dark:text-gray-300">
                {premiumSub}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-3 bg-red-600 text-white rounded-md shadow-md"
          >
            Close
          </button>
        </div>
      </motion.div>
      {/* {loading && <Loader />} */}
    </>
  );
};

export default ProfileSlider;
