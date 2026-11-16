import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BrandFilter from "../components/BrandFilter";
import{ useContext } from "react";
import { CartContext } from "../context/CartContext";
import Deals from "../components/Deals";
import BestSellers from "../components/BestSellers";
import AIRecommendations from "../components/AIRecommendations";

function Home() {
   const { cart, addToCart } = useContext(CartContext);
   const [search, setSearch] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("All");
   const [sortOption, setSortOption] = useState("default");
   const [selectedBrand, setSelectedBrand] = useState("All");
   const [backendProducts, setBackendProducts] = useState([]);
   
useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((response) => response.json())
    .then((data) => {
      setBackendProducts(data);
      console.log("Products from backend:", data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}, []);

const filteredProducts = backendProducts
  .filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesBrand =
      selectedBrand === "All" ||
      product.brand === selectedBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  })
  .sort((a, b) => {
    switch (sortOption) {
      case "low":
        return a.price - b.price;
      case "high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
    
  return (
    <>
      
  <Navbar
   cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
   search={search}
   setSearch={setSearch}
  />

      <Hero />

    <Categories
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
    />

    <Deals />

    <BestSellers />

    <AIRecommendations />

    <BrandFilter
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
    />
      
      <h2 style={{ padding: "20px" }}>
          Cart Items: {cart.length}
      </h2>
         
      
      <div style={{ padding: "20px" }}>

        <div className="max-w-7xl mx-auto px-6 py-10">
  
  <div className="flex justify-end mb-6">
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2 shadow"
  >
    <option value="default">Default</option>
    <option value="low">Price: Low to High</option>
    <option value="high">Price: High to Low</option>
    <option value="rating">Highest Rating</option>
    <option value="name">Name: A-Z</option>
  </select>
  </div>

  <h2 className="text-4xl font-bold mb-8">
    🔥 Featured Products
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

    {filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
        <ProductCard
  key={product.id}
  id={product.id}
  image={product.image}
  name={product.name}
  price={product.price}
  oldPrice={product.old_price}
  rating={product.rating}
  reviews={product.reviews}
  description={product.description}
  onAddToCart={() => addToCart(product)}
/>
      ))
    ) : (
      <h2>No products found.</h2>
    )}

  </div>

</div>
      </div>
    </>
  );
}

export default Home;