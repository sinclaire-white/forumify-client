
import  { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const MakeAnnounce = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    description: "",
  });
  const [tagInput, setTagInput] = useState("");

  // Fetch user data from backend
  const { data: userData, isLoading: isUserLoading, isError: isUserError, error: userError } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("No user email available");
      const res = await axiosSecure.get("/users/check-email", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email, // Only run if user.email exists
  });

  // Handle announcement form changes
  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle tag input change
  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  // Mutation for adding a new announcement
  const { mutate: createAnnouncement, isLoading, isError, error } = useMutation({
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
      console.error("Failed to make announcement:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to make announcement: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  // Mutation for adding multiple tags
  const { mutate: addTags, isLoading: isTagsLoading, isError: isTagsError, error: tagsError } = useMutation({
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
      queryClient.invalidateQueries(["tags"]);
    },
    onError: (err) => {
      console.error("Failed to add tags:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to add tags: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  // Handle announcement form submission
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
      authorName: userData.user.name,
      authorImage: userData.user.photo || null,
      title: announcementForm.title,
      description: announcementForm.description,
    };
    createAnnouncement(announcementData);
  };

  // Handle tag form submission
  const handleTagSubmit = (e) => {
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

  // Handle loading states
  if (loading || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Handle user data errors or non-existent user
  if (isUserError || !userData?.exists) {
    return (
      <div className="mt-8 text-center text-red-500">
        Error: {isUserError ? userError.message : "User not found."}
      </div>
    );
  }

  // Ensure user is admin
  if (userData.user.role !== "admin") {
    return (
      <div className="mt-8 text-center text-red-500">
        Error: Only admins can access this page.
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-6 mx-auto rounded-lg shadow-md bg-base-200">
      {/* Announcement Form */}
      <h2 className="mb-6 text-3xl font-bold">Make Announcement</h2>
      <form onSubmit={handleAnnouncementSubmit} className="mb-8 space-y-6">
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
        {isError && (
          <p className="mt-1 text-sm text-red-500">
            Error: {error.response?.data?.message || error.message}
          </p>
        )}
      </form>

      {/* Tag Form */}
      <h2 className="mb-6 text-3xl font-bold">Add Tags</h2>
      <form onSubmit={handleTagSubmit} className="space-y-6">
        <div className="relative w-full">
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder=" "
            value={tagInput}
            onChange={handleTagChange}
            className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <label
            htmlFor="tags"
            className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
          >
            Add tags (comma-separated, e.g., javascript, react)
          </label>
        </div>
        <button
          type="submit"
          className="w-full mt-6 btn btn-primary"
          disabled={isTagsLoading}
        >
          {isTagsLoading ? "Adding Tags..." : "Add Tags"}
        </button>
        {isTagsError && (
          <p className="mt-1 text-sm text-red-500">
            Error: {tagsError.response?.data?.message || tagsError.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default MakeAnnounce;