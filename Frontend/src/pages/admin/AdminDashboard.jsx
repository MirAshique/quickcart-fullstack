import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardRes = await API.get("/admin/dashboard");
        const ordersRes = await API.get("/orders");

        setStats(dashboardRes.data.stats);
        setOrders(ordersRes.data.orders || []);
      } catch (error) {
        console.log("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!stats) return null;

  // ===== Create Last 6 Months Structure =====
  const monthlyRevenue = {};

  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthlyRevenue[key] = 0;
  }

  // ===== Add Order Revenue =====
  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (monthlyRevenue[monthKey] !== undefined) {
      monthlyRevenue[monthKey] += order.totalPrice;
    }
  });

  const chartData = Object.keys(monthlyRevenue).map((month) => ({
    month,
    revenue: monthlyRevenue[month],
  }));

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">
            ${stats.totalRevenue?.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
        <h2 className="text-xl font-semibold mb-6">
          Monthly Revenue Overview (Last 6 Months)
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
