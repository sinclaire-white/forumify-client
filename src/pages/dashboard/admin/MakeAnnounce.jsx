import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query"; 
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const MakeAnnounce = () => {
  const axiosSecure = useAxiosSecure(); // Initialize axiosSecure

  const [formData, setFormData] = useState({
    authorImage: "",
    authorName: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mutation for adding a new announcement
  const { mutate: createAnnouncement, isLoading, isError, error } = useMutation({
    mutationFn: async (announcementData) => {
      const res = await axiosSecure.post("/announcements", announcementData); // Your backend endpoint
      return res.data;
    },
    onSuccess: () => {
      alert("Announcement submitted successfully!");
      setFormData({
        authorImage: "",
        authorName: "",
        title: "",
        description: "",
      });
      // Optionally, invalidate announcements query to refresh home page
      // queryClient.invalidateQueries(["announcements"]);
    },
    onError: (err) => {
      console.error("Failed to make announcement:", err);
      alert(`Failed to make announcement: ${err.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAnnouncement(formData); // Trigger the mutation
  };

  return (
    <div className="max-w-3xl p-6 mx-auto rounded-lg shadow-md bg-base-200">
      <h2 className="mb-6 text-3xl font-bold">Make Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="authorImage"
          placeholder="Author Image URL"
          value={formData.authorImage}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <input
          type="text"
          name="authorName"
          placeholder="Author Name"
          value={formData.authorName}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Announcement Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <textarea
          name="description"
          placeholder="Announcement Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full textarea textarea-bordered"
          rows={5}
          required
        />
        <button type="submit" className="w-full btn btn-primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Announcement"}
        </button>
        {isError && <p className="mt-2 text-red-500">Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default MakeAnnounce;