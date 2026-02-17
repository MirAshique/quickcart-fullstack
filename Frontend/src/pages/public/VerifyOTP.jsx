import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/verify-otp", {
        email,
        otp
      });

      toast.success(data.message || "Verified successfully 🎉");
      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-sm text-center text-gray-500">
          Enter the 6-digit code sent to {email}
        </p>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border text-center text-xl tracking-widest dark:bg-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
