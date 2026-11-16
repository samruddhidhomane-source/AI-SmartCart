const brands = [
  "All",
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "Acer",
  "Samsung",
  "Xiaomi",
  "Nothing",
  "Google",
  "OnePlus",
  "Sony",
  "JBL",
  "boAt",
  "Realme",
  "Noise",
  "Fire-Boltt",
];

function BrandFilter({
  selectedBrand,
  setSelectedBrand,
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        Filter by Brand
      </h2>

      <div className="flex flex-wrap gap-3">

        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-4 py-2 rounded-full transition ${
              selectedBrand === brand
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {brand}
          </button>
        ))}

      </div>

    </div>
  );
}

export default BrandFilter;