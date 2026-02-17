import { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/orders", {
        params: {
          page,
          limit: 5,
          status: statusFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          search: search || undefined,
        },
      });

      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log("Fetch Orders Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, startDate, endDate, search]);

  const confirmStatusChange = async () => {
    try {
      await API.put(`/orders/${confirmModal.id}`, {
        status: confirmModal.status,
      });

      setConfirmModal(null);
      fetchOrders();
    } catch (error) {
      console.log("Update Error:", error);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-soft">

        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setPage(1);
            setStartDate(e.target.value);
          }}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setPage(1);
            setEndDate(e.target.value);
          }}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t dark:border-gray-700">
                <td className="p-4">{order._id}</td>
                <td className="p-4">{order.user?.email}</td>
                <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                <td className="p-4 capitalize">{order.orderStatus}</td>
                <td className="p-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      setConfirmModal({
                        id: order._id,
                        status: e.target.value,
                      })
                    }
                    className="px-3 py-1 border rounded-lg dark:bg-gray-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
        >
          Previous
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-4 w-96">
            <h2 className="text-lg font-semibold">
              Confirm Status Change
            </h2>

            <p>
              Change order status to{" "}
              <strong>{confirmModal.status}</strong>?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
