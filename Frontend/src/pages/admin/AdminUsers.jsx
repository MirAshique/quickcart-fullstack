import { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data.users || []);
    } catch (error) {
      console.log("Fetch Users Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role });
      fetchUsers();
    } catch (error) {
      console.log("Update Role Error:", error.response?.data);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.log("Delete User Error:", error.response?.data);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading Users...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Users</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t dark:border-gray-700"
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(user._id, e.target.value)
                    }
                    className="px-3 py-1 rounded-lg border dark:bg-gray-700"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
