import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaBox,
} from "react-icons/fa";

function AdminAnalytics() {

  // Sample monthly sales data
  const monthlySales = [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 62000 },
    { month: "Mar", sales: 58000 },
    { month: "Apr", sales: 75000 },
    { month: "May", sales: 92000 },
    { month: "Jun", sales: 85000 },
    { month: "Jul", sales: 110000 },
    { month: "Aug", sales: 125000 },
  ];

  // Best-selling products
  const bestSelling = [
    {
      name: "Apple iPhone 15",
      sold: 42,
      revenue: 2935800,
    },
    {
      name: "Dell Inspiron 15",
      sold: 28,
      revenue: 1540000,
    },
    {
      name: "Apple MacBook Air M3",
      sold: 18,
      revenue: 1978200,
    },
    {
      name: "Sony WH-CH520",
      sold: 35,
      revenue: 157465,
    },
  ];

  // Calculate total sales
  const totalSales = monthlySales.reduce(
    (total, item) => total + item.sales,
    0
  );

  // Find highest monthly sale
  const highestSale = Math.max(
    ...monthlySales.map((item) => item.sales)
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">

        <Link
          to="/admin"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <FaArrowLeft />
          Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-blue-600">
          🛍️ AI SmartCart
        </h1>

      </header>


      {/* Main Content */}

      <main className="max-w-7xl mx-auto p-8">

        {/* Heading */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaChartLine className="text-orange-500" />
            Sales & Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Track your store performance
          </p>

        </div>


        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Revenue */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <p className="text-gray-500">
              Total Revenue
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{totalSales.toLocaleString("en-IN")}
            </h2>

          </div>


          {/* Orders */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              156
            </h2>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <FaShoppingCart />
              Orders this year
            </div>

          </div>


          {/* Customers */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <p className="text-gray-500">
              Customers
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              89
            </h2>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <FaUsers />
              Registered users
            </div>

          </div>


          {/* Products */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <p className="text-gray-500">
              Products Sold
            </p>

            <h2 className="text-3xl font-bold text-orange-500 mt-2">
              284
            </h2>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <FaBox />
              Items sold
            </div>

          </div>

        </div>


        {/* Monthly Sales */}

        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            📈 Monthly Sales
          </h2>

          <div className="space-y-5">

            {monthlySales.map((item) => {

              const percentage =
                (item.sales / highestSale) * 100;

              return (
                <div key={item.month}>

                  <div className="flex justify-between mb-2">

                    <span className="font-semibold">
                      {item.month}
                    </span>

                    <span className="text-gray-600">
                      ₹{item.sales.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </div>


        {/* Best Selling Products */}

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-2xl font-bold mb-6">
            🏆 Best-Selling Products
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-900 text-white">

                <tr>

                  <th className="text-left p-4">
                    Product
                  </th>

                  <th className="text-left p-4">
                    Units Sold
                  </th>

                  <th className="text-left p-4">
                    Revenue
                  </th>

                </tr>

              </thead>

              <tbody>

                {bestSelling.map((product) => (

                  <tr
                    key={product.name}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-semibold">
                      {product.name}
                    </td>

                    <td className="p-4">
                      {product.sold}
                    </td>

                    <td className="p-4 font-semibold text-green-600">
                      ₹{product.revenue.toLocaleString("en-IN")}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminAnalytics;