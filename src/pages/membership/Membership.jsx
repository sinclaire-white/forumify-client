import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Membership = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  // Fetch user data to check membership status
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const handleUpgrade = async () => {
    if (!user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to upgrade your membership.",
        confirmButtonColor: "#3B82F6",
      });
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post("/create-checkout-session", {
        email: user.email,
      });
      const { id: sessionId, url } = res.data;
      if (sessionId && url) {
        const stripe = window.Stripe(
          "pk_test_51RgbWcPPbKjs7cYJCDXQrvWL6jbGFLeBFgl1M5KtgrZtGWGw6EX0aHtvhkAGL8ryO6wroseWwNk6gyYj29RRdBNm00w8Apnqgk"
        );
        await stripe.redirectToCheckout({ sessionId });
      } else {
        throw new Error("Invalid response from server: Missing session ID or URL.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: error.message || "Could not initiate payment. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const isGoldMember = userData?.badge === "gold";

  return (
    <motion.div
      className="min-h-screen py-10 bg-gradient-to-br from-base-200 to-base-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-lg p-8 mx-auto space-y-6 text-center rounded-lg shadow-xl lg:max-w-2xl bg-base-100/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {isGoldMember ? "Your Gold Membership" : "Upgrade to Gold Membership"}
        </h2>
        {isUserLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : isGoldMember ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              🎉 You are already a Gold Member! Enjoy unlimited posting and your exclusive Gold Badge.
            </p>
            {/* Fix: Added flexbox to align buttons horizontally with space-x for spacing */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                className="px-8 text-lg btn btn-neutral btn-lg"
                disabled
              >
                Already a Member
              </button>
              <button
                onClick={() => navigate("/dashboard/add-post")}
                className="px-8 text-lg btn btn-success btn-lg"
              >
                Create a New Post
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              You've reached your posting limit as a Bronze user. Become a Gold Member to unlock unlimited posting and earn the Gold Badge!
            </p>
            <button
              onClick={handleUpgrade}
              className="px-8 text-lg btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Become a Member"
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Membership;