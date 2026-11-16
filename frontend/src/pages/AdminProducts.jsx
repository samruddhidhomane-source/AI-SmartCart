
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";

const API = "http://localhost:5000/api/products";

const emptyProduct = {
  name: "",
  category: "",
  brand: "",
  price: "",
  old_price: "",
  stock: "5",
  description: "",
  image: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Load products from MySQL through the backend
  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load products.");
      }

      setProducts(data);
    } catch (error) {
      alert(error.message || "Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name.trim() ||
      !newProduct.category ||
      !newProduct.brand.trim() ||
      newProduct.price === "" ||
      Number(newProduct.price) <= 0
    ) {
      alert("Enter a product name, category, brand and valid price.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(API, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          ...newProduct,
          name: newProduct.name.trim(),
          brand: newProduct.brand.trim(),
          price: Number(newProduct.price),
          old_price: Number(newProduct.old_price) || Number(newProduct.price),
          stock: Math.max(0, Number(newProduct.stock) || 0),
          rating: 4.5,
          reviews: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product.");
      }

      alert("Product added successfully!");
      setNewProduct(emptyProduct);
      setShowForm(false);
      await loadProducts();
    } catch (error) {
      alert(error.message || "Could not add product.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setShowForm(false);

    setEditingProduct({
      ...product,
      price: String(product.price ?? ""),
      old_price: String(product.old_price ?? ""),
      stock: String(product.stock ?? 0),
      image: product.image || "",
      description: product.description || "",
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (
      !editingProduct.name?.trim() ||
      !editingProduct.category ||
      !editingProduct.brand?.trim() ||
      Number(editingProduct.price) <= 0
    ) {
      alert("Enter a valid name, category, brand and price.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API}/${editingProduct.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          name: editingProduct.name.trim(),
          category: editingProduct.category,
          brand: editingProduct.brand.trim(),
          price: Number(editingProduct.price),
          old_price:
            Number(editingProduct.old_price) ||
            Number(editingProduct.price),
          stock: Math.max(0, Number(editingProduct.stock) || 0),
          description: editingProduct.description || "",
          image: editingProduct.image || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product.");
      }

      alert("Product updated successfully!");
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      alert(error.message || "Could not update product.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product.");
      }

      alert("Product deleted successfully!");
      await loadProducts();
    } catch (error) {
      alert(error.message || "Could not delete product.");
    }
  };

  const ProductFields = ({ product, onChange, isEditing = false }) => (
    <>
      <div>
        <label className="block font-semibold mb-2">Product Name *</label>
        <input
          required
          name="name"
          value={product.name}
          onChange={onChange}
          placeholder="Example: Samsung Galaxy S25"
          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Category *</label>
        <select
          required
          name="category"
          value={product.category}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-3"
        >
          <option value="">Select Category</option>
          <option value="Laptop">Laptop</option>
          <option value="Mobile">Mobile</option>
          <option value="Audio">Audio</option>
          <option value="Watch">Watch</option>
          <option value="Accessory">Accessory</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-2">Brand *</label>
        <input
          required
          name="brand"
          value={product.brand}
          onChange={onChange}
          placeholder="Example: Dell"
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Price (₹) *</label>
        <input
          required
          min="0.01"
          type="number"
          name="price"
          value={product.price}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Old Price (₹)</label>
        <input
          min="0"
          type="number"
          name="old_price"
          value={product.old_price}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Stock Quantity</label>
        <input
          min="0"
          type="number"
          name="stock"
          value={product.stock}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold mb-2">
          Image Path (optional)
        </label>
        <input
          name="image"
          value={product.image || ""}
          onChange={onChange}
          placeholder="/products/laptops/dell.jpg"
          className="w-full border rounded-xl px-4 py-3"
        />

        {product.image && (
          <img
            src={product.image}
            alt="Product preview"
            className="mt-3 w-24 h-24 object-contain border rounded-lg p-2"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={product.description || ""}
          onChange={onChange}
          rows="3"
          placeholder="Enter product description..."
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <FaArrowLeft /> Dashboard
        </Link>

        <h1 className="text-xl md:text-2xl font-bold text-blue-600">
          🛍️ AI SmartCart
        </h1>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              📦 Product Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your store products
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingProduct(null);
            }}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700"
          >
            {showForm ? <FaTimes /> : <FaPlus />}
            {showForm ? "Close" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">➕ Add New Product</h2>

            <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ProductFields product={newProduct} onChange={handleChange} />

              <div className="md:col-span-2 flex justify-end">
                <button
                  disabled={saving}
                  type="submit"
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "✅ Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {editingProduct && (
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">✏️ Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={updateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ProductFields
                product={editingProduct}
                onChange={handleEditChange}
                isEditing
              />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-center p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-gray-500">
                      No products found. Add your first product.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4 min-w-52">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-contain bg-gray-100 rounded-lg p-2"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              📦
                            </div>
                          )}

                          <div>
                            <p className="font-bold">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">{product.category}</td>
                      <td className="p-4 font-semibold text-green-600">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      <td className="p-4">
                        {Number(product.stock) > 0 ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {product.stock} in stock
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => startEdit(product)}
                            className="bg-blue-100 text-blue-600 p-3 rounded-lg hover:bg-blue-200"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="bg-red-100 text-red-600 p-3 rounded-lg hover:bg-red-200"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-gray-500 mt-4">
          Showing {products.length} products
        </p>
      </main>
    </div>
  );
}

export default AdminProducts;
