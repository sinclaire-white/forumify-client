
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const [tagInput, setTagInput] = useState("");

  // Fetch admin stats
  const {
    data: stats = { totalPosts: 0, totalComments: 0, totalUsers: 0 },
    isLoading: isStatsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  // Fetch admin profile info
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("No user email available");
      const res = await axiosSecure.get("/users/check-email", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Mutation for adding tags
  const { mutate: addTags, isLoading: isTagsLoading } = useMutation({
    mutationFn: async (tags) => {
      const res = await axiosSecure.post("/tags", { names: tags });
      return res.data;
    },
    onSuccess: (data) => {
      const successTags = data.results.filter((result) => result.tagId).map((result) => result.name);
      const failedTags = data.results.filter((result) => result.message).map((result) => result.name);
      if (successTags.length > 0) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Tags ${successTags.join(", ")} added successfully!`,
          confirmButtonColor: "#3B82F6",
        });
      }
      if (failedTags.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: `Tags ${failedTags.join(", ")} already exist.`,
          confirmButtonColor: "#FBBF24",
        });
      }
      setTagInput("");
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to add tags: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleAddTagSubmit = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter at least one tag.",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag !== "");
    if (tags.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No valid tags provided.",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    addTags(tags);
  };

  const data = {
    labels: ["Posts", "Comments", "Users"],
    datasets: [
      {
        label: "Site Stats",
        data: [stats.totalPosts, stats.totalComments, stats.totalUsers],
        backgroundColor: ["#3b82f6", "#10b981", "#fbbf24"],
        hoverOffset: 4,
      },
    ],
  };

  if (loading || isStatsLoading || isUserLoading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </motion.div>
    );
  }

  if (userError || !userData?.exists || userData?.user?.role !== "admin") {
    return (
      <motion.div
        className="mt-8 text-center text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Error: {userError?.message || "User not found or not an admin."}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-6 py-8 space-y-8 shadow-xl bg-gradient-to-br from-base-200 to-base-300 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Admin Profile
      </h2>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        {/* Profile Info */}
        <motion.div
          className="w-full p-6 text-center rounded-lg shadow-md bg-base-100/50 backdrop-blur-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <img
            src={userData.user.photo || "/default-profile.jpg"}
            alt={userData.user.name}
            className="object-cover w-32 h-32 mx-auto mb-4 rounded-full ring ring-neutral ring-offset-base-200 ring-offset-1"
          />
          <h3 className="mb-1 text-xl font-semibold">{userData.user.name}</h3>
          <p className="mb-4 text-gray-600">{userData.user.email}</p>
          <div className="space-y-2 text-left">
            <p>
              <strong>Posts:</strong> {stats.totalPosts}
            </p>
            <p>
              <strong>Comments:</strong> {stats.totalComments}
            </p>
            <p>
              <strong>Users:</strong> {stats.totalUsers}
            </p>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="w-full p-6 rounded-lg shadow-md bg-base-100/50 backdrop-blur-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h3 className="mb-4 text-xl font-semibold text-center">
            Site Activity Overview
          </h3>
          <Pie data={data} />
        </motion.div>
      </div>

      {/* Add Tag Form */}
      <motion.div
        className="max-w-xl p-6 mx-auto rounded-lg shadow-md bg-base-100/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h3 className="mb-4 text-xl font-semibold">Add New Tags</h3>
        <form onSubmit={handleAddTagSubmit}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder=" "
              className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              required
            />
            <label
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Add tags (comma-separated, e.g., javascript, react)
            </label>
          </div>
          <button
            type="submit"
            className="w-full mt-4 btn btn-primary"
            disabled={isTagsLoading}
          >
            {isTagsLoading ? "Adding Tags..." : "Add Tags"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;