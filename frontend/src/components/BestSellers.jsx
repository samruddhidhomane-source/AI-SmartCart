import products from "../data/products";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function BestSellers() {
  const { addToCart } = useContext(CartContext);

  const bestSellers = [...products]
    .sort((a, b) => {
      return b.reviews - a.reviews;
    })
    .slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-8">
        <h2 className="text-4xl font-bold">
          ⭐ Best Sellers
        </h2>

        <p className="text-gray-500 mt-2">
          Products loved by our customers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {bestSellers.map((product) => (

          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden"
          >

            {/* Product Image */}

            <div className="h-56 bg-gray-100 flex items-center justify-center p-4">

              <img
                src={product.image}
                alt={product.name}
                className="max-h-48 max-w-full object-contain"
              />

            </div>

            <div className="p-5">

              <h3 className="text-xl font-bold">
                {product.name}
              </h3>

              {/* Rating */}

              <div className="flex items-center gap-2 mt-2">

                <div className="flex text-yellow-500">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} />
                  ))}

                </div>

                <span className="text-gray-600">
                  {product.rating}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                {product.reviews} customer reviews
              </p>

              {/* Price */}

              <p className="text-2xl font-bold text-green-600 mt-4">
                ₹{product.price}
              </p>

              {/* Button */}

            <button
               onClick={() => addToCart(product)}
               className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition"
             >
              <FaShoppingCart />
                Add to Cart
            </button> 

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default BestSellers;