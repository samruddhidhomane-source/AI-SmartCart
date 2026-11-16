import { useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "300px" }}
      />

      <h1>{product.name}</h1>

      <h2>₹{product.price}</h2>

      <p>{product.description}</p>

      <button>Add to Cart</button>
    </div>
  );
}

export default ProductDetails;