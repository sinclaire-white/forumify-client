import React from "react";
import { Pie } from "react-chartjs-2"; // You need to install react-chartjs-2 and chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfile = () => {
  // Dummy stats (replace with API data)
  const stats = {
    posts: 150,
    comments: 340,
    users: 120,
  };

  const data = {
    labels: ["Posts", "Comments", "Users"],
    datasets: [
      {
        label: "Site Stats",
        data: [stats.posts, stats.comments, stats.users],
        backgroundColor: ["#3b82f6", "#10b981", "#fbbf24"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Admin Profile</h2>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Profile Info */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md w-full md:w-1/3 text-center">
          <img
            src="/admin-profile.jpg" // Replace with admin image URL
            alt="Admin"
            className="mx-auto rounded-full w-32 h-32 object-cover mb-4"
          />
          <h3 className="text-xl font-semibold mb-1">Admin Name</h3>
          <p className="text-gray-600 mb-4">admin@example.com</p>
          <div className="space-y-2 text-left">
            <p>
              <strong>Posts:</strong> {stats.posts}
            </p>
            <p>
              <strong>Comments:</strong> {stats.comments}
            </p>
            <p>
              <strong>Users:</strong> {stats.users}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md w-full md:w-2/3">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Site Activity Overview
          </h3>
          <Pie data={data} />
        </div>
      </div>

      {/* Add Tag Form */}
      <div className="bg-base-200 p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Add New Tag</h3>
        <form>
          <input
            type="text"
            placeholder="Enter new tag"
            className="input input-bordered w-full mb-4"
            // onChange and onSubmit handlers go here
          />
          <button type="submit" className="btn btn-primary w-full">
            Add Tag
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
