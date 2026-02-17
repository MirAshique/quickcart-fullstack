import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setShowResend(false);

      await login(email, password);

      toast.success("Welcome back 🎉");
      navigate("/products");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";

      toast.error(message);

      if (message.toLowerCase().includes("verify")) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      setResendLoading(true);

      await API.post("/auth/resend-verification", { email });

      toast.success("Verification email sent 📩");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend email"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">
          Welcome Back
        </h1>

        {/* Email */}
        <div>
          <label className="block text-sm mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none dark:bg-gray-700"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none dark:bg-gray-700"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-white hover:shadow-soft transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Resend Verification */}
        {showResend && (
          <div className="text-center">
            <button
              type="button"
              onClick={resendVerification}
              disabled={resendLoading}
              className="text-sm text-primary hover:underline"
            >
              {resendLoading
                ? "Sending..."
                : "Resend verification email"}
            </button>
          </div>
        )}

        {/* Register */}
        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
