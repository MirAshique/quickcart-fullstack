import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/my");
        setOrders(data.orders || []);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-pulse text-gray-500">
          Loading orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 text-red-500">
        {error}
      </div>
    );
  }

  // ================= EMPTY STATE =================
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">

        <div className="w-20 h-20 flex items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <FiPackage size={36} />
        </div>

        <h1 className="text-3xl font-bold">
          No Orders Yet
        </h1>

        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          You haven’t placed any orders yet. Once you complete a purchase,
          your order history will appear here.
        </p>

        <Link
          to="/products"
          className="px-8 py-3 rounded-2xl bg-primary text-white hover:shadow-soft transition-all duration-300"
        >
          Start Shopping
        </Link>

      </div>
    );
  }

  // ================= ORDERS LIST =================
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

              <div>
                <p className="text-sm text-gray-500">
                  Order ID
                </p>
                <p className="font-medium break-all">
                  {order._id}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-left md:text-right space-y-1">
                <p className="text-lg font-bold">
                  ${order.totalPrice.toFixed(2)}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    order.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div>
                <Link
                  to={`/orders/${order._id}`}
                  className="text-primary font-medium hover:underline"
                >
                  View Details →
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
