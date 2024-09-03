import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the backend to create a Payment Intent
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/create-payment-intent`,
        {
          userId: userId,
          priceId: priceId,
        }
      );
      const clientSecret = response.data.clientSecret;

      // Confirm the payment with Stripe
      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setPaymentStatus("failed");
      } else {
        // Payment succeeded

        setPaymentStatus("success");
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/payment/update-subscription`,
          {
            userId: userId,
            premiumSubscription: true,
          }
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            premiumSubscription: true,
          })
        );

        setFormDisabled(true);
        navigate("/progressvisualization");
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="inline-block mr-2 text-blue-500 dark:text-blue-300"
            />
            Complete Your Payment
          </h1>

          {/* Promotional Message */}
          {!user.premiumSubscription && (
            <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded text-center">
              <p className="font-semibold text-lg">
                Enjoy all the premium features! Complete your payment to unlock
                advanced features and get the most out of our app.
              </p>
              <p className=" font-semibold text-lg">Amount is:$5</p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
              Payment was successful!
            </div>
          )}
          {paymentStatus === "failed" && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              Payment failed. Please try again.
            </div>
          )}
          {error && paymentStatus !== "success" && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="relative">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!stripe || loading || formDisabled}
              className={`w-full py-2 px-4 rounded-lg text-white ${
                stripe && !loading && !formDisabled
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400"
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const priceId = process.env.REACT_APP_STRIPE_PRICE_ID;

const Payment = ({ userId, priceId }) => (
  <Elements stripe={stripePromise}>
    <PaymentForm userId={userId} priceId={priceId} />
  </Elements>
);

export default Payment;
