const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../db/models/user");

router.post("/create-payment-intent", async (req, res) => {
  const { userId, priceId } = req.body;

  try {
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount;
    const currency = price.currency;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: ["card"],
      metadata: { userId: userId },

    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100,
      currency: currency.toUpperCase(),
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/update-subscription", async (req, res) => {
  const { userId, premiumSubscription } = req.body;

  if (!userId || premiumSubscription === undefined) {
    return res
      .status(400)
      .json({ message: "User ID and subscription status are required" });
  }
  try {

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.premiumSubscription = premiumSubscription; 

    await user.save();

    res
      .status(200)
      .json({ message: "Subscription status updated successfully" });
  } catch (error) {
    console.error("Error updating subscription status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
