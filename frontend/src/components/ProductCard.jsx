import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import {
  FaHeart,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

import { WishlistContext } from "../context/WishlistContext";

function ProductCard({
  id,
  image,
  name,
  price,
  oldPrice,
  rating,
  reviews,
  description,
  onAddToCart,
}) {
  const { addToWishlist } = useContext(WishlistContext);
  const [showToast, setShowToast] = useState(false);
  
  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
   <div className="fade-up group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2">

      {/* Discount Badge */}

      {discount > 0 && (
        <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          🔥 {discount}% OFF
        </span>
      )}

      {/* Wishlist */}

      <button
        onClick={() =>
          addToWishlist({
            id,
            image,
            name,
            price,
          })
        }
        className="absolute top-4 right-4 z-10 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:scale-125 active:scale-90 transition"
      >
        <FaHeart />
      </button>


      {/* Product Image */}

      <div className="h-56 bg-gray-50 flex items-center justify-center p-5 overflow-hidden">

        <img
          src={image}
          alt={name}
          className="max-h-48 max-w-full object-contain group-hover:scale-110 transition duration-500"
        />

      </div>


      {/* Product Information */}

      <div className="p-5">

        <p className="text-sm text-blue-600 font-semibold mb-1">
          SmartCart Pick
        </p>

        <h2 className="text-xl font-bold line-clamp-1">
          {name}
        </h2>


        {/* Rating */}

        <div className="flex items-center gap-2 mt-2">

          <div className="flex text-yellow-500">

            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={
                  star <= Math.round(rating || 0)
                    ? ""
                    : "text-gray-300"
                }
              />
            ))}

          </div>

          <span className="text-sm text-gray-500">
            {rating || 4.5}
          </span>

          {reviews && (
            <span className="text-sm text-gray-400">
              ({reviews})
            </span>
          )}

        </div>


        {/* Price */}

        <div className="flex items-center gap-3 mt-4">

          <span className="text-2xl font-bold text-green-600">
            ₹{price}
          </span>

          {oldPrice && (
            <span className="text-gray-400 line-through">
              ₹{oldPrice}
            </span>
          )}

        </div>


        {/* Stock */}

        <p className="text-green-600 text-sm font-medium mt-2">
          ● In Stock
        </p>


        {/* Buttons */}

        <div className="flex gap-3 mt-5">

          <Link to={`/product/${id}`} className="flex-1">

            <button className="w-full border-2 border-blue-600 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition">
              View
            </button>

          </Link>


          <button
            onClick={() => {
          onAddToCart();
          setShowToast(true);

          setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }}
       className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition"
       >
            <FaShoppingCart />
            Add
          </button>

        </div>

      </div>
    {showToast && (
  <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
    <span className="text-green-400 text-xl">✓</span>

    <div>
      <p className="font-bold">Added to Cart!</p>
      <p className="text-sm text-gray-300">
        {name}
      </p>
    </div>
  </div>
)}
    </div>
  );
}

export default ProductCard;