import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaHome,
} from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard statistics and recent orders from the backend
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in with your admin account.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsResponse, ordersResponse] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats", { headers }),
        fetch("http://localhost:5000/api/orders", { headers }),
      ]);

      const statsData = await statsResponse.json();
      const ordersData = await ordersResponse.json();

      if (!statsResponse.ok) {
        throw new Error(
          statsData.message || "Failed to load dashboard statistics."
        );
      }

      if (!ordersResponse.ok) {
        throw new Error(
          ordersData.message || "Failed to load recent orders."
        );
      }

      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
        <Link
          to="/admin"
          className="text-2xl font-bold text-blue-600"
        >
          🛍️ AI SmartCart Admin
        </Link>

        <Link
          to="/home"
          className="text-gray-600 hover:text-blue-600"
        >
          <FaHome className="mr-2 inline" />
          Back to Store
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-[calc(100vh-72px)] w-64 bg-gray-900 p-6 text-white">
          <h2 className="mb-8 text-xl font-bold">Admin Panel</h2>

          <nav className="space-y-3">
            <div className="rounded-xl bg-blue-600 px-4 py-3">
              📊 Dashboard
            </div>

            <Link
              to="/admin/products"
              className="block cursor-pointer rounded-xl px-4 py-3 hover:bg-gray-800"
            >
              📦 Products
            </Link>

            <Link
              to="/admin/orders"
              className="block cursor-pointer rounded-xl px-4 py-3 hover:bg-gray-800"
            >
              🛒 Orders
            </Link>

            <Link
              to="/admin/users"
              className="block cursor-pointer rounded-xl px-4 py-3 hover:bg-gray-800"
            >
              👥 Users
            </Link>

            <Link
              to="/admin/analytics"
              className="block cursor-pointer rounded-xl px-4 py-3 hover:bg-gray-800"
            >
              💰 Sales
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dashboard Overview
              </h1>

              <p className="mt-2 text-gray-500">
                Welcome back, Admin 👋
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh Dashboard"}
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              <p>{error}</p>

              <button
                onClick={fetchDashboardData}
                className="mt-2 font-semibold underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Products */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Products</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {loading ? "..." : stats.totalProducts}
                  </h2>
                </div>

                <FaBox className="text-3xl text-blue-600" />
              </div>
            </div>

            {/* Orders */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Orders</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {loading ? "..." : stats.totalOrders}
                  </h2>
                </div>

                <FaShoppingCart className="text-3xl text-green-600" />
              </div>
            </div>

            {/* Users */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Users</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {loading ? "..." : stats.totalUsers}
                  </h2>
                </div>

                <FaUsers className="text-3xl text-purple-600" />
              </div>
            </div>

            {/* Revenue */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {loading
                      ? "..."
                      : `₹${Number(stats.totalSales).toLocaleString(
                          "en-IN",
                          { maximumFractionDigits: 2 }
                        )}`}
                  </h2>
                </div>

                <FaChartLine className="text-3xl text-orange-500" />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">📋 Recent Orders</h2>

              <Link
                to="/admin/orders"
                className="font-medium text-blue-600 hover:underline"
              >
                View All Orders →
              </Link>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading recent orders...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-gray-500">
                No orders found. Customer orders will appear here after
                checkout.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-500">
                      <th className="px-3 py-3">Order ID</th>
                      <th className="px-3 py-3">Customer</th>
                      <th className="px-3 py-3">Amount</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="px-3 py-4 font-medium">
                          #{order.id}
                        </td>

                        <td className="px-3 py-4">
                          {order.customer_name || order.shipping_name}
                        </td>

                        <td className="px-3 py-4">
                          ₹
                          {Number(order.total_amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-500">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;