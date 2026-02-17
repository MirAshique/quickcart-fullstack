import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // Use first image from images array
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : null;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl shadow-soft hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">

      {/* PRODUCT IMAGE */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </Link>

      {/* CONTENT */}
      <div className="p-5 space-y-3">

        <p className="text-xs uppercase tracking-wide text-gray-400">
          {product.mainCategory}
        </p>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-2">

          <p className="text-xl font-bold text-primary">
            ${product.price}
          </p>

          {product.stock > 0 ? (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
              In Stock
            </span>
          ) : (
            <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
              Out of Stock
            </span>
          )}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="block text-center mt-4 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
        >
          View Details
        </Link>

      </div>
    </div>
  );
};

export default ProductCard;
