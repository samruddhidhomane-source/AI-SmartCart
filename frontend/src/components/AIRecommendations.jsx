
import { useEffect, useState } from "react";
import { FaRobot, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

function AIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        // Get the logged-in customer's token
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login to view personalized recommendations.");
        }

        // Fetch personalized recommendations from backend
        const response = await fetch(
          "http://localhost:5000/api/recommendations/personalized",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load recommendations."
          );
        }

        setRecommendations(data);
      } catch (err) {
        console.error("Recommendation error:", err);
        setError(err.message || "Could not load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">

        {/* Heading */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-white/20 p-4 rounded-full">
            <FaRobot className="text-3xl" />
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              AI Recommended For You
            </h2>

            <p className="text-indigo-100">
              Personalized suggestions based on your purchase history.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center py-8">
            Finding products for you...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center py-8 text-white" role="alert">
            {error}
          </p>
        )}

        {/* Recommendations */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {recommendations.length > 0 ? (
              recommendations.map((product) => (
                <div
                  key={product.id}
                  className="bg-white text-gray-900 rounded-2xl p-4 hover:scale-105 transition duration-300"
                >
                  <div className="h-44 bg-gray-100 rounded-xl flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-40 max-w-full object-contain"
                    />
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg mt-4 hover:text-blue-600">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mt-2">
                    <FaStar className="text-yellow-500" />

                    <span>
                      {Number(product.rating).toFixed(1)} / 5
                    </span>
                  </div>

                  <p className="text-xl font-bold text-green-600 mt-3">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    🤖 Recommended by SmartCart AI
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center py-8">
                No recommendations available.
              </p>
            )}

          </div>
        )}
      </div>
    </section>
  );
}

export default AIRecommendations;
