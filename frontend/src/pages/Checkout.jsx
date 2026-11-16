
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setError("Please fill in all shipping details.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const items = cart.map((item) => ({
      product_id: Number(item.id),
      quantity: Number(item.quantity),
    }));

    setLoading(true);

    try {
      // Step 1: Load Razorpay
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay. Check your internet connection.");
      }

      // Step 2: Create payment order on backend
      const response = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items,
            shipping: {
              name: formData.name,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              pincode: formData.pincode,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create payment order.");
      }

      // Step 3: Configure Razorpay popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "AI SmartCart",
        description: "Shopping Payment",
        order_id: data.orderId,

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#2563eb",
        },

        // Step 4: Verify payment on backend
        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await fetch(
              "http://localhost:5000/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed. Please contact support."
              );
            }

            // Step 5: Clear cart only after verified payment
            clearCart();

            alert(
              `Payment successful!\nOrder ID: ${verifyData.orderId}\nTotal: ₹${verifyData.total}`
            );

            navigate("/home");
          } catch (err) {
            setError(
              `Payment may have been received, but order confirmation failed: ${err.message} Please contact support and share your payment ID: ${paymentResponse.razorpay_payment_id}`
            );
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment window closed. Your order has not been placed.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // Handle payment failure
      razorpay.on("payment.failed", function (paymentResponse) {
        setLoading(false);

        setError(
          paymentResponse.error?.description ||
            "Payment failed. Please try again."
        );
      });

      // Step 6: Open payment popup
      razorpay.open();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Checkout
      </h1>

      {error && (
        <p className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleOrder}>
        <div className="grid md:grid-cols-2 gap-8">

          {/* SHIPPING DETAILS */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Shipping Details
            </h2>

            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border p-3 rounded mb-4"
            />

            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-3 rounded mb-4"
            />

            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border p-3 rounded mb-4"
            />

            <textarea
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border p-3 rounded mb-4"
            />

            <input
              required
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border p-3 rounded mb-4"
            />

            <input
              required
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="w-full border p-3 rounded"
            />
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Order Summary
            </h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 mb-3"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </span>
              </div>
            ))}

            <hr className="my-4" />

            <h2 className="text-2xl font-bold">
              Total: ₹{total.toFixed(2)}
            </h2>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

            <p className="text-sm text-gray-500 mt-3 text-center">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
