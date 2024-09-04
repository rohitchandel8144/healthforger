const express = require("express");
const passport  = require('passport')

 // Adjust the path as needed
const {
  signup,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  verifyForgotPassword,
  changePassword,
} = require("../controllers/authController");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: `${process.env.FRONT_END_URL}/login`,
    session: false,
}), (req, res) => {
    const token = req.user.generateJwt(); // Generate JWT for the user
    const user = req.user;
    const userStr = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${process.env.FRONT_END_URL}/google/callback?token=${token}&user=${userStr}`); // Redirect 
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/sendOtp/:email", sendOtp);
router.post("/verifyOtp/:otp/:email", verifyOtp);
router.get("/forgotPassword/:email", forgotPassword);
router.post("/verifyforgotPassword/:otp/:email", verifyForgotPassword);
router.post("/changePassword", changePassword);
module.exports = router;
