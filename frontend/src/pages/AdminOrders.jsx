import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Access denied. Please log in with an admin account."
          );
        }

        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update an order's status in MySQL
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError("");

    try {
      const token = localStorage.getItem("token");

     const response = await fetch(
  `http://localhost:5000/api/orders/${orderId}/status`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  }
);

const responseText = await response.text();

let data;

try {
  data = JSON.parse(responseText);
} catch {
  console.error("Unexpected server response:", responseText);

  throw new Error(
    `Server returned HTML instead of JSON (HTTP ${response.status}). Check the API route and backend server.`
  );
}

if (!response.ok) {
  throw new Error(data.message || "Failed to update order status.");
}

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status.");
      }

      // Update the displayed order after the backend confirms success
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Orders
            </h1>
            <p className="mt-2 text-gray-600">
              View customer orders and manage their status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Refresh Orders
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-2 text-3xl font-bold">{orders.length}</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {orders.filter((order) => order.status === "Pending").length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Shipped</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {orders.filter((order) => order.status === "Shipped").length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Delivered</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {orders.filter((order) => order.status === "Delivered").length}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No orders found
            </h2>
            <p className="mt-2 text-gray-500">
              Customer orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl bg-white shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b p-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "Date unavailable"}
                    </p>

                    <p className="mt-2 text-sm text-gray-700">
                      Customer: {order.customer_name}
                    </p>

                    <p className="text-sm text-gray-600">
                      {order.customer_email}
                    </p>
                  </div>

                  <div className="min-w-48">
                    <label
                      htmlFor={`status-${order.id}`}
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Order Status
                    </label>

                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order.id && (
                      <p className="mt-1 text-xs text-blue-600">
                        Updating status...
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-semibold text-gray-800">
                      Products Ordered
                    </h3>

                    {order.items?.length > 0 ? (
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-4 border-b pb-3 text-sm last:border-b-0"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.product_name}
                              </p>
                              <p className="text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <p className="whitespace-nowrap font-medium">
                              ₹
                              {(
                                Number(item.price) * Number(item.quantity)
                              ).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No product details available.
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-gray-800">
                      Shipping Details
                    </h3>

                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {order.shipping_name}
                    </p>

                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {order.shipping_phone}
                    </p>

                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {order.shipping_address}
                    </p>

                    <p className="mt-5 border-t pt-4 text-xl font-bold text-gray-900">
                      Total: ₹{Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;