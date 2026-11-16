import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

function Wishlist() {

  const { wishlist, removeFromWishlist } =
    useContext(WishlistContext);

  return (

    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-4xl font-bold mb-8">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (

        <h2>Your Wishlist is Empty</h2>

      ) : (

        <div className="grid grid-cols-3 gap-6">

          {wishlist.map((product) => (

            <div
              key={product.id}
              className="shadow-lg rounded-xl p-5"
            >

              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />

              <h2 className="font-bold mt-4">
                {product.name}
              </h2>

              <p>₹{product.price}</p>

              <button
                onClick={() =>
                  removeFromWishlist(product.id)
                }
                className="bg-red-600 text-white px-4 py-2 rounded mt-4"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default Wishlist;