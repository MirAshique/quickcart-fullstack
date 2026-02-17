import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/product/ProductCard";
import { FiShield, FiShoppingCart, FiBarChart2 } from "react-icons/fi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products?limit=4`
      );
      setProducts(data.products || data);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-24">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Animated Background Shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse"></div>

        {/* LEFT CONTENT */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Modern Shopping,
            <span className="text-primary"> Simplified.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            QuickCart is a premium SaaS-style eCommerce platform with secure
            Stripe payments, real-time cart management, and a powerful admin dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="px-6 py-3 bg-primary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse Products
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 backdrop-blur-md bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 rounded-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative z-10 hidden md:flex justify-center items-center">

          {/* Glass Card */}
          <div className="relative backdrop-blur-2xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-3xl p-10 shadow-2xl">

            {/* Laptop Image */}
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
              alt="Laptop"
              className="w-72 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500"
            />

            {/* Floating iPhone */}
            <img
              src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop"
              alt="iPhone"
              className="absolute -bottom-6 -right-6 w-32 rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-500"
            />

          </div>

        </div>
      </section>


      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Link to="/products" className="text-primary hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 h-72 rounded-2xl"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>


      {/* ================= TRUST SECTION ================= */}
      <section className="bg-gray-50 dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <FiShield size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Secure Payments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Powered by Stripe with industry-level encryption and payment security.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <FiShoppingCart size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Fast Checkout
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time cart updates and seamless checkout experience.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <FiBarChart2 size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Admin Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced dashboard with revenue insights and order management.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
