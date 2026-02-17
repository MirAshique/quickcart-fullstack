import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import API from "../../api/axios";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { totalPrice, cartItems } = useCart();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create PaymentIntent
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await API.post(
          "/payment/create-payment-intent",
          {
            amount: totalPrice,
          }
        );

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError("Failed to initialize payment.");
      }
    };

    if (totalPrice > 0) {
      createPaymentIntent();
    }
  }, [totalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // Confirm payment on backend
      await API.post("/payment/confirm", {
        paymentIntentId: paymentIntent.id,
      });

      navigate("/order-success");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft">
      <h1 className="text-2xl font-bold mb-6">
        Checkout (${totalPrice.toFixed(2)})
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl">
          <CardElement />
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-3 rounded-xl bg-primary text-white hover:shadow-soft disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
