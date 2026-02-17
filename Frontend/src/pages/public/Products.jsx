import { useEffect, useState } from "react";
import API from "../../api/axios";
import ProductCard from "../../components/product/ProductCard";

const MAIN_CATEGORIES = {
  Electronics: {
    Laptops: ["Apple", "Dell", "HP", "Lenovo"],
    "Mobile Phones": ["Apple", "Samsung", "Xiaomi", "OnePlus"],
    Accessories: ["Logitech", "Anker", "Sony"]
  }
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data } = await API.get(
          `/products?page=${page}&limit=6&search=${search}&sort=${sort}&mainCategory=${mainCategory}&subCategory=${subCategory}&brand=${brand}&minPrice=${minPrice}&maxPrice=${maxPrice}&inStock=${inStock}`
        );

        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    search,
    sort,
    mainCategory,
    subCategory,
    brand,
    minPrice,
    maxPrice,
    inStock
  ]);

  const subCategories =
    MAIN_CATEGORIES[mainCategory] || {};

  const brands =
    subCategories[subCategory] || [];

  return (
    <div className="grid lg:grid-cols-4 gap-10">

      {/* ================= SIDEBAR FILTERS ================= */}
      <div className="lg:col-span-1 space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft h-fit">

        <h2 className="text-xl font-semibold">Filters</h2>

        {/* Main Category */}
        <div>
          <label className="block text-sm mb-2">Main Category</label>
          <select
            value={mainCategory}
            onChange={(e) => {
              setPage(1);
              setMainCategory(e.target.value);
              setSubCategory("");
              setBrand("");
            }}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-800"
          >
            <option value="">All</option>
            {Object.keys(MAIN_CATEGORIES).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className="block text-sm mb-2">Sub Category</label>
          <select
            value={subCategory}
            onChange={(e) => {
              setPage(1);
              setSubCategory(e.target.value);
              setBrand("");
            }}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-800"
          >
            <option value="">All</option>
            {Object.keys(subCategories).map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm mb-2">Brand</label>
          <select
            value={brand}
            onChange={(e) => {
              setPage(1);
              setBrand(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-800"
          >
            <option value="">All</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm mb-2">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setPage(1);
              setMinPrice(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setPage(1);
              setMaxPrice(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-800"
          />
        </div>

        {/* In Stock */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => {
              setPage(1);
              setInStock(!inStock);
            }}
          />
          <label className="text-sm">In Stock Only</label>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setSearch("");
            setSort("");
            setMainCategory("");
            setSubCategory("");
            setBrand("");
            setMinPrice("");
            setMaxPrice("");
            setInStock(false);
            setPage(1);
          }}
          className="w-full py-2 rounded-xl bg-gray-200 dark:bg-gray-800"
        >
          Reset Filters
        </button>
      </div>

      {/* ================= PRODUCTS SECTION ================= */}
      <div className="lg:col-span-3 space-y-8">

        <div className="flex flex-col md:flex-row gap-4 justify-between">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="px-4 py-2 rounded-xl border dark:bg-gray-900"
          />

          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="px-4 py-2 rounded-xl border dark:bg-gray-900"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
          </select>

        </div>

        {loading && (
          <div className="text-center py-10">Loading...</div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        )}

        {!loading && (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
