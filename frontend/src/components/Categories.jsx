const categories = [
  "All",
  "Laptop",
  "Mobile",
  "Audio",
  "Watch",
];

function Categories({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <section className="max-w-6xl mx-auto py-10 px-6">

      <h2 className="text-3xl font-bold mb-6">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        {categories.map((category) => (

          <div
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`p-6 rounded-xl text-center cursor-pointer transition
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-xl"
                  : "bg-white shadow-md hover:shadow-xl hover:scale-105"
              }
            `}
          >
            {category}
          </div>

        ))}

      </div>

    </section>
  );
}

export default Categories;