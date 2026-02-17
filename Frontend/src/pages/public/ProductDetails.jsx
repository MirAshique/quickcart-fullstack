import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  if (!product) return null;

  /* ================= IMAGE HANDLING (UPDATED) ================= */

  let imageUrl = "https://via.placeholder.com/600x400?text=Product+Image";

  // ✅ If new structure (images array)
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];

    imageUrl = firstImage.startsWith("http")
      ? firstImage
      : `${import.meta.env.VITE_API_URL}/${firstImage}`;
  }

  // ✅ If old structure (single image field)
  else if (product.image) {
    imageUrl = product.image.startsWith("http")
      ? product.image
      : `${import.meta.env.VITE_API_URL}/${product.image}`;
  }

  /* ============================================================= */

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">

      {/* LEFT - Product Image */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft p-6">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-96 object-cover rounded-2xl"
        />
      </div>

      {/* RIGHT - Product Info */}
      <div className="space-y-6">

        {/* Category (support both old + new schema) */}
        <p className="text-sm uppercase tracking-wide text-gray-400">
          {product.mainCategory || product.category}
        </p>

        {/* Name */}
        <h1 className="text-4xl font-bold">
          {product.name}
        </h1>

        {/* Price */}
        <p className="text-2xl font-semibold text-primary">
          ${product.price}
        </p>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <span className="inline-block text-sm px-4 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
            In Stock
          </span>
        ) : (
          <span className="inline-block text-sm px-4 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
            Out of Stock
          </span>
        )}

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {product.description}
        </p>

        {/* Add To Cart Button */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={`px-8 py-3 rounded-2xl text-white font-medium transition-all duration-300
            ${
              product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:shadow-lg"
            }`}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

      </div>
    </div>
  );
};

export default ProductDetails;
