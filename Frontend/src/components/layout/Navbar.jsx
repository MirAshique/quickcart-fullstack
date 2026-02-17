import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to={isAdmin ? "/admin/dashboard" : "/"}
          className="text-2xl font-bold text-primary tracking-tight"
        >
          QuickCart
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          {/* ================= USER NAVIGATION ================= */}
          {!isAdmin && (
            <>
              <Link
                to="/"
                className="hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="hover:text-primary transition-colors duration-200"
              >
                Products
              </Link>

              <Link
                to="/cart"
                className="relative hover:text-primary transition"
              >
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-4 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user && (
                <Link
                  to="/orders"
                  className="hover:text-primary transition"
                >
                  My Orders
                </Link>
              )}
            </>
          )}

          {/* ================= ADMIN NAVIGATION ================= */}
          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="hover:text-primary transition"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/orders"
                className="hover:text-primary transition"
              >
                Manage Orders
              </Link>

              <Link
                to="/admin/users"
                className="hover:text-primary transition"
              >
                Manage Users
              </Link>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:opacity-80 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-primary text-white hover:shadow-soft transition-all duration-300"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
