import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiGrid, FiShoppingBag, FiUsers, FiLogOut } from "react-icons/fi";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">

        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-primary">
            QuickCart
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiGrid size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiShoppingBag size={18} />
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiShoppingBag size={18} />
            Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <FiUsers size={18} />
            Users
          </NavLink>

        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:opacity-90 transition"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
