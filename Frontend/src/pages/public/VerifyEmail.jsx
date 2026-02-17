import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const { data } = await API.get(`/auth/verify/${token}`);

        if (data.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
          
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Verification failed."
        );
      }
    };

    if (token) {
      verifyAccount();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft text-center max-w-md w-full">
        
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Verifying your account...
            </h1>
            <p className="text-gray-500">
              Please wait while we verify your email.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Email Verified 🎉
            </h1>
            <p className="text-gray-500">{message}</p>
            <p className="mt-4 text-sm text-gray-400">
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Verification Failed ❌
            </h1>
            <p className="text-gray-500">{message}</p>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
