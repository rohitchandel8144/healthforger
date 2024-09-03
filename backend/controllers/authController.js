const axios = require('axios');
const User = require("../db/models/user");
const Jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Verifier = require("email-verifier");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.signup = async (req, res) => {
  try {
    const RECAPTCHA_SECRET_KEY = "6Lct7S8qAAAAAGer0Bzx-urId1y-ekQP-vky2z37";
    const recaptchaToken = req.body;
    if (!recaptchaToken) {
      return res.status(400).json({ message: "reCAPTCHA token is missing." });
    }

    try {
      // Verify the reCAPTCHA token
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
          },
        }
      );

      const { success, score } = response.data;

      if (!success || (score && score < 0.5)) {
        return res
          .status(400)
          .json({ message: "reCAPTCHA verification failed." });
      }
    } catch (error) {
      console.log(error);
    }
    let user = new User(req.body);
    let hashPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashPassword;
    await user.save();

    // Check if user is active before proceeding
    if (user.isActive === false) {
      return res.status(403).send({ result: "Your account is not activated" });
    }

    Jwt.sign(
      { user },
      process.env.JWT_SECRET,
      { expiresIn: "31d" },
      (err, token) => {
        if (err) {
          return res.status(500).send({ result: "Something went wrong" });
        }
        res.send({ result, auth: token });
      }
    );
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email or Name already in use" });
    }
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.login = async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp
        .status(400)
        .send({ result: "Email and password are required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return resp.status(404).send({ result: "Invalid email" });
    }

    let isResult = await bcrypt.compare(password, user.password);
    if (!isResult) {
      return resp.status(404).send({ result: "Invalid password" });
    }
    if (!user.isActive) {
      return resp.status(403).send({ result: "Your account is not activated" });
    }

    Jwt.sign(
      { user },
      process.env.JWT_SECRET,
      { expiresIn: "31d" },
      (err, token) => {
        if (err) {
          console.error("JWT Error:", err);
          return resp.status(500).send({
            result: "Error generating token. Please try again later.",
          });
        }

        return resp.status(200).send({ user, auth: token });
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return resp.status(500).send({ result: "Internal server error" });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    let otp = Math.floor(100000 + Math.random() * 900000);
    let { email } = req.params;
    const user = await User.findOneAndUpdate(
      { email },
      { otp },
      { new: true, upsert: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: "oflo ynqb laol ipdk", // Your email password or app password
      },
    });

    const mailOptions = {
      from: "rohitchandel8580@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.params; // Assuming OTP and email are sent in the request body
    if (!otp || !email) {
      return res
        .status(400)
        .json({ status: "error", message: "OTP and email are required" });
    }

    let user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ status: "error", message: "Invalid OTP" });
    }

    user.otp = null;
    user.isActive = true;
    await user.save();
    return res
      .status(200)
      .json({ status: "success", message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.params;
  try {
    let otp = Math.floor(100000 + Math.random() * 900000);
    const user = await User.findOneAndUpdate(
      { email },
      { otp },
      { new: true, upsert: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: "oflo ynqb laol ipdk", // Your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.verifyForgotPassword = async (req, res) => {
  try {
    let { otp, email } = req.params;
    let user = await User.findOne({ email });
    if (user.otp == otp) {
      user.otp = null;
      await user.save();
      return res
        .status(200)
        .json({ status: "success", message: "OTP verified successfully" });
    }
    res.status(404).json({ status: "error", message: "cannot verify otp" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    console.log(password, email);

    // Validate input
    if (!password) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res
      .status(200)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

// async function emailVerifier(email) {
//   const verifier = new Verifier('at_tDJEpxDflRHpTKVsymIP66iYHhZSO'); // Use the API key correctly

//   verifier.verify(email, { hardRefresh: true }, (err, data) => {
//     if (err) {
//       console.error('Error verifying email:', err);
//       return;
//     }
//     console.log('Verification result:', data);
//   });
// }
