
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMutation, useQuery } from "@tanstack/react-query"; 
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";


ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure(); // Initialize axiosSecure

  // Fetch admin stats using Tanstack Query
  const {
    data: stats = { posts: 0, comments: 0, users: 0 }, // Default to 0 to prevent errors
    isLoading,
    error,
    refetch, // Good for refreshing data if needed
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats"); // Your backend endpoint
      return res.data;
    },
  });

  // Fetch admin profile info (name, email, image) - potentially from AuthContext or a dedicated endpoint
  // For now, let's assume it's available globally or from a separate fetch.
  const adminInfo = {
    name: "Admin Name", // Replace with actual data
    email: "admin@example.com", // Replace with actual data
    image: "/admin-profile.jpg", // Replace with actual data
  };

  const data = {
    labels: ["Posts", "Comments", "Users"],
    datasets: [
      {
        label: "Site Stats",
        data: [stats.totalPosts, stats.totalComments, stats.totalUsers], // Use actual keys from backend
        backgroundColor: ["#3b82f6", "#10b981", "#fbbf24"],
        hoverOffset: 4,
      },
    ],
  };

  // State for new tag form
  const [newTag, setNewTag] = useState("");

  // Mutation for adding a new tag
  const { mutate: addTag } = useMutation({
    mutationFn: async (tag) => {
      const res = await axiosSecure.post("/tags", { name: tag }); // Your backend endpoint for adding tags
      return res.data;
    },
    onSuccess: () => {
      alert("Tag added successfully!");
      setNewTag(""); // Clear the input field
      refetch(); // Refetch stats if needed, or refetch tags specifically
      // You might also need to invalidate queries for tags on the client side
      // queryClient.invalidateQueries(["tags"]);
    },
    onError: (err) => {
      console.error("Failed to add tag:", err);
      alert("Failed to add tag. Please try again.");
    },
  });

  const handleAddTagSubmit = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTag(newTag.trim());
    } else {
      alert("Tag name cannot be empty.");
    }
  };

  if (isLoading) return <div>Loading Admin Profile...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Admin Profile</h2>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        {/* Profile Info */}
        <div className="w-full p-6 text-center rounded-lg shadow-md bg-base-200 md:w-1/3">
          <img
            src={adminInfo.image}
            alt="Admin"
            className="object-cover w-32 h-32 mx-auto mb-4 rounded-full"
          />
          <h3 className="mb-1 text-xl font-semibold">{adminInfo.name}</h3>
          <p className="mb-4 text-gray-600">{adminInfo.email}</p>
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
        </div>

        {/* Pie Chart */}
        <div className="w-full p-6 rounded-lg shadow-md bg-base-200 md:w-2/3">
          <h3 className="mb-4 text-xl font-semibold text-center">
            Site Activity Overview
          </h3>
          <Pie data={data} />
        </div>
      </div>

      {/* Add Tag Form */}
      <div className="max-w-xl p-6 mx-auto rounded-lg shadow-md bg-base-200">
        <h3 className="mb-4 text-xl font-semibold">Add New Tag</h3>
        <form onSubmit={handleAddTagSubmit}>
          <input
            type="text"
            placeholder="Enter new tag"
            className="w-full mb-4 input input-bordered"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            required
          />
          <button type="submit" className="w-full btn btn-primary">
            Add Tag
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;