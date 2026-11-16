
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

function Navbar({ cartCount, search, setSearch }) {
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 px-4 pt-2 bg-transparent">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 px-6 py-2.5">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to={token && user ? "/home" : "/login"}
            className="text-2xl font-bold text-blue-600 whitespace-nowrap hover:scale-105 transition"
          >
            🛍️ AI SmartCart
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <input
              type="text"
              placeholder="🔍 Search Products..."
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ThemeToggle />

          {/* Account and Logout */}
          {token && user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-gray-700 font-semibold whitespace-nowrap">
                <FaUser />
                {user.name || "My Account"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-blue-600 transition"
            >
              <FaUser />
              <span>Login</span>
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative text-pink-500 text-xl hover:scale-110 transition"
          >
            <FaHeart />

            {wishlist.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <button
              type="button"
              className="bg-green-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-green-700 hover:scale-105 transition shadow-md"
            >
              <FaShoppingCart />
              <span>{cartCount}</span>
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
