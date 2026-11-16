import products from "../data/products";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";


function Deals() {

  const { addToCart } = useContext(CartContext);

  const deals = products
    .map((product) => ({
      ...product,
      discount: Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      ),
    }))
    .filter((product) => product.discount >= 10)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold">
            🔥 Today's Deals
          </h2>

          <p className="text-gray-500 mt-2">
            Grab the best discounts before they're gone!
          </p>
        </div>

        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold">
          Limited Offers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {deals.map((product) => (

          <div
            key={product.id}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden"
          >

            {/* Discount Badge */}

            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
              {product.discount}% OFF
            </div>

            {/* Product Image */}

            <div className="h-56 flex items-center justify-center bg-gray-100 p-4">

              <img
                src={product.image}
                alt={product.name}
                className="max-h-48 max-w-full object-contain"
              />

            </div>

            {/* Product Information */}

            <div className="p-5">

              <h3 className="text-xl font-bold">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mt-2 text-yellow-500">
                <FaStar />

                <span className="text-gray-700">
                  {product.rating}
                </span>

                <span className="text-gray-400">
                  ({product.reviews})
                </span>
              </div>

              <div className="mt-4">

                <span className="text-2xl font-bold text-green-600">
                  ₹{product.price}
                </span>

                <span className="ml-3 text-gray-400 line-through">
                  ₹{product.oldPrice}
                </span>

              </div>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
             <FaShoppingCart />
               Grab Deal
            </button>
            
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Deals;