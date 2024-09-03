const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { startCronJob } = require("./cronJobs/cronJob");
const scheduleCronJobs = require("./modules/cronsummary");
const passport = require("./strategy/passport");
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const habitRoutes = require("./routes/habitRoutes");
const progressRoutes = require("./routes/progressRoutes");
const profileRoutes = require("./routes/profileRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes= require("./routes/adminRoutes")
const { startCronJobNotification } = require("./cronJobs/notification");

require('dotenv').config();
const app = express();


app.use(express.json());

app.use(cors({
  origin: [process.env.FRONT_END_URL, "https://yourdomain.com"],
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true, 
}));

app.use(passport.initialize());

// Route setup
app.use("/api/auth", authRoutes);

app.use(
  "/api/goals",
  passport.authenticate("jwt", { session: false }),
  goalRoutes
);
app.use(
  "/api/habits",
  passport.authenticate("jwt", { session: false }),
  habitRoutes
);

app.use(
  "/api/progress",
  passport.authenticate("jwt", { session: false }),
  progressRoutes
);

app.use(
  "/api/profile",
  passport.authenticate("jwt", { session: false }),
  profileRoutes
);

app.use(
  "/api/admin",
  passport.authenticate("jwt", { session: false }),
  adminRoutes
);

app.use("/api/payment", paymentRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000, // Adjust as needed
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Start the cron job
startCronJobNotification();
startCronJob();
scheduleCronJobs(); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
