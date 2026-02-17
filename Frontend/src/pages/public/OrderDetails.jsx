 import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-8">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
        <h1 className="text-2xl font-bold mb-4">
          Order Details
        </h1>

        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Payment:</strong> {order.paymentStatus}</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
        <h2 className="text-xl font-semibold mb-4">
          Items
        </h2>

        {order.orderItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <p className="font-medium">
                {item.product.name}
              </p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p>${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}

        <div className="text-right mt-6 text-lg font-bold">
          Total: ${order.totalPrice.toFixed(2)}
        </div>
      </div>

    </div>
  );
};

export default OrderDetails;
