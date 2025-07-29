
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const MakeAnnounce = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    description: "",
  });

  // Fetch user data
  const { data: userData, isLoading: isUserLoading } = useQuery({
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

  // Handle form changes
  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementForm((prev) => ({ ...prev, [name]: value }));
  };

  // Mutation for adding announcement
  const { mutate: createAnnouncement, isLoading } = useMutation({
    mutationFn: async (announcementData) => {
      const res = await axiosSecure.post("/announcements", announcementData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Announcement submitted successfully!",
        confirmButtonColor: "#3B82F6",
      });
      setAnnouncementForm({ title: "", description: "" });
      queryClient.invalidateQueries(["announcements"]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to make announcement: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  // Handle form submission
  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!userData?.user?.name) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User name not found. Please update your profile in the dashboard.",
        confirmButtonColor: "#EF4444",
      });
      return;
    }
    const announcementData = {
      title: announcementForm.title,
      description: announcementForm.description,
      authorImage: userData.user.photo || null,
    };
    createAnnouncement(announcementData);
  };

  if (loading || isUserLoading) {
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

  if (!userData?.exists || userData.user.role !== "admin") {
    return (
      <motion.div
        className="mt-8 text-center text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Error: Only admins can access this page.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl p-6 mx-auto rounded-lg shadow-xl bg-gradient-to-br from-base-200 to-base-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Make Announcement
      </h2>
      <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
        <div className="relative w-full">
          <input
            type="text"
            id="announcement-title"
            name="title"
            placeholder=" "
            value={announcementForm.title}
            onChange={handleAnnouncementChange}
            className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
          <label
            htmlFor="announcement-title"
            className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
          >
            Announcement Title
          </label>
        </div>
        <div className="relative w-full">
          <textarea
            id="announcement-description"
            name="description"
            placeholder=" "
            value={announcementForm.description}
            onChange={handleAnnouncementChange}
            className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer textarea textarea-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            rows={5}
            required
          />
          <label
            htmlFor="announcement-description"
            className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
          >
            Announcement Description
          </label>
        </div>
        <button
          type="submit"
          className="w-full mt-6 btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Announcement"}
        </button>
      </form>
    </motion.div>
  );
};

export default MakeAnnounce;