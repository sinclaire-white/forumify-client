import { useEffect, useState } from "react";
import Select from "react-select";

import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddPost = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [postCount, setPostCount] = useState(0);
  const [selectedTag, setSelectedTag] = useState(null);

  const options = [
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
  ];

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/posts/count?email=${user.email}`)
        .then((res) => setPostCount(res.data.count))
        .catch(() => setPostCount(0));
    }
  }, [user?.email, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;

    const postData = {
      authorName: user.displayName,
      authorEmail: user.email,
      authorPhoto: user.photoURL,
      title,
      description,
      tag: selectedTag?.value,
      upVote: 0,
      downVote: 0,
    };

    try {
      const res = await axiosSecure.post("/posts", postData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Post Added!", "success");
        form.reset();
        setSelectedTag(null);
      }
    } catch (error) {
      Swal.fire("Error", "Could not add post", "error");
    }
  };

  if (postCount >= 5) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Post Limit Reached (5/5)</h2>
        <p className="mb-4 text-gray-500">
          You need to become a member to add more posts.
        </p>
        <button
          onClick={() => navigate("/membership")}
          className="btn btn-accent"
        >
          Become a Member
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-xl p-6 w-full max-w-2xl mx-auto mt-8"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Add New Post</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          value={user?.displayName}
          disabled
          className="input input-bordered"
        />
        <input
          type="email"
          value={user?.email}
          disabled
          className="input input-bordered"
        />
        <input
          type="text"
          value={user?.photoURL}
          disabled
          className="input input-bordered"
        />
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          className="input input-bordered"
          required
        />
        <textarea
          name="description"
          placeholder="Post Description"
          className="textarea textarea-bordered"
          required
        />
        <Select
          options={options}
          value={selectedTag}
          onChange={setSelectedTag}
          placeholder="Select a tag"
          className="text-black"
        />
        <input
          type="number"
          value={0}
          readOnly
          className="input input-bordered"
          placeholder="Upvote"
        />
        <input
          type="number"
          value={0}
          readOnly
          className="input input-bordered"
          placeholder="Downvote"
        />
        <button type="submit" className="btn btn-primary">
          Submit Post
        </button>
      </form>
    </motion.div>
  );
};

export default AddPost;
