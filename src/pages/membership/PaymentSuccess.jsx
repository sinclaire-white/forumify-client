import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useQueryClient, useQuery } from '@tanstack/react-query';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing your membership upgrade...");

  const queryClient = useQueryClient();

  const { data: userData, isLoading: isUserLoading, refetch: refetchUserData } = useQuery({
    queryKey: ['currentUser', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    const userEmail = queryParams.get("email");

    const handleMembershipUpgrade = async () => {
      if (!sessionId || !userEmail || !user?.email || isUserLoading) {
        setMessage("Missing payment information or user not loaded. Please try again.");
        setLoading(false);
        return;
      }

      if (userEmail !== user.email) {
        setMessage("Security warning: Email mismatch. Please log in with the correct account.");
        setLoading(false);
        navigate("/login");
        return;
      }

      if (userData?.membership === true && userData?.badge === "gold") {
        setMessage("🎉 You are already a Gold Member!");
        Swal.fire({
          icon: "info",
          title: "Already Gold Member!",
          text: "Your membership is already active.",
          showConfirmButton: false,
          timer: 3000,
        });
        setLoading(false);
        setTimeout(() => navigate("/dashboard"), 5000);
        return;
      }

      try {
        const paymentAmount = 1000;
        const paymentCurrency = "usd";

        const res = await axiosSecure.patch("/users/membership", {
          email: userEmail,
          transactionId: sessionId,
          amount: paymentAmount,
          currency: paymentCurrency,
        });

        if (res.data.success) {
          setMessage("Upgrade successful, congratulations!");
          Swal.fire({
            icon: "success",
            title: "Membership Activated!",
            html: `
              <p>Upgrade successful, congratulations!</p>
              <p className="mt-2 font-bold">Transaction ID: <code>${sessionId}</code></p>
              <p>Start posting now!</p>
            `,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          await queryClient.invalidateQueries(['currentUser', user.email]);
          await refetchUserData();
          setTimeout(() => navigate("/dashboard"), 5000);
        } else {
          setMessage(`Membership upgrade failed: ${res.data.message || "Unknown error."}`);
          Swal.fire({
            icon: "error",
            title: "Upgrade Failed!",
            text: res.data.message || "Payment succeeded but membership update failed. Please contact support.",
            confirmButtonColor: "#EF4444",
          });
          setTimeout(() => navigate("/membership"), 5000);
        }
      } catch (error) {
        console.error("Error upgrading membership:", error);
        setMessage("There was an error processing your membership. Please contact support.");
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "An unexpected error occurred. Please contact support.",
          confirmButtonColor: "#EF4444",
        });
        setTimeout(() => navigate("/membership"), 5000);
      } finally {
        setLoading(false);
      }
    };

    if (user && !isUserLoading) {
      handleMembershipUpgrade();
    }
  }, [location.search, navigate, axiosSecure, user, queryClient, isUserLoading, userData, refetchUserData]);

  const displayLoading = loading || isUserLoading;

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-br from-base-200 to-base-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-lg p-8 text-center rounded-lg shadow-xl lg:max-w-2xl bg-base-100/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {displayLoading ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <FadeLoader color="oklch(var(--p))" />
            <p className="text-lg font-semibold text-gray-700">{message}</p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Payment Status
            </h2>
            <p className="text-xl text-gray-800">{message}</p>
            {message.includes("congratulations") && (
              <>
                <p className="text-lg text-gray-600">
                  Start creating posts now with your Gold Membership!
                </p>
                <button
                  onClick={() => navigate("/add-post")}
                  className="mt-6 btn btn-success btn-lg"
                >
                  Create a New Post
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-4 btn btn-primary btn-lg"
                >
                  Go to Dashboard
                </button>
              </>
            )}
            {!message.includes("congratulations") && (
              <button
                onClick={() => navigate("/membership")}
                className="mt-6 btn btn-primary btn-lg"
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;