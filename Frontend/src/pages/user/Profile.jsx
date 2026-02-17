import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.put("/auth/profile", {
        name,
        password
      });

      toast.success(data.message || "Profile updated");

    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700"
          />

          <input
            type="email"
            value={user?.email}
            disabled
            className="w-full px-4 py-3 rounded-xl border bg-gray-100 dark:bg-gray-700"
          />

          <input
            type="password"
            placeholder="New Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
