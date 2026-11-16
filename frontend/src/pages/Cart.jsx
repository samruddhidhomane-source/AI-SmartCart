import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const grandTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">🛒 Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 mb-5"
        >
          <div className="flex items-center gap-4">

            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 object-contain"
            />

            <div>
              <h2 className="text-xl font-bold">{item.name}</h2>

              <p className="text-green-600 font-semibold">
                ₹{item.price}
              </p>

              <p>
                Subtotal: ₹{item.price * item.quantity}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => decreaseQuantity(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              -
            </button>

            <span className="text-xl">
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQuantity(item.id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              +
            </button>

            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Remove
            </button>

          </div>

        </div>
      ))}

      <div className="text-right mt-8">

        <h2 className="text-3xl font-bold">
          Total: ₹{grandTotal}
        </h2>

        <Link to="/checkout">
          <button className="mt-5 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700">
            Proceed to Checkout
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Cart;