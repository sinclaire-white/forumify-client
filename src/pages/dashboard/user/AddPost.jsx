import { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
// No need for framer-motion if using react-awesome-reveal for simple fades
// import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal"; // Import Fade from React Awesome Reveal
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";

const AddPost = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [postCount, setPostCount] = useState(0);
  const [selectedTag, setSelectedTag] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // setValue // Not strictly needed for this Select setup
  } = useForm({
    defaultValues: {
      authorName: user?.displayName || "",
      authorEmail: user?.email || "",
      authorPhoto: user?.photoURL || "",
      title: "",
      description: "",
      upVote: 0,
      downVote: 0,
      tag: "",
    },
  });

  const options = [
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "finance", label: "Finance" }, 
    { value: "travel", label: "Travel" },
    { value: "art", label: "Art" },
    { value: "work", label: "Work" },
    { value: "sports", label: "Sports" },
      { value: "news", label: "News" },
  ];

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/posts/count?email=${user.email}`)
        .then((res) => setPostCount(res.data.count))
        .catch((error) => {
          console.error("Error fetching post count:", error);
          setPostCount(0);
        });
    }
  }, [user?.email, axiosSecure]);

  const onSubmit = async (data) => {
    if (!selectedTag) {
      Swal.fire("Validation Error", "Please select a tag.", "warning");
      return;
    }

    const postData = {
      authorName: user.displayName,
      authorEmail: user.email,
      authorPhoto: user.photoURL,
      title: data.title,
      description: data.description,
      tag: selectedTag.value,
      upVote: 0,
      downVote: 0,
      createdAt: new Date(), // Ensure timestamp is sent for sorting
    };

    try {
      const res = await axiosSecure.post("/posts", postData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Post Added!", "success");
        reset();
        setSelectedTag(null);
        setPostCount((prev) => prev + 1);
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      Swal.fire("Error", "Could not add post. Please try again.", "error");
    }
  };

  // Limit check
  if (postCount >= 5) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center bg-base-100 p-6 rounded-lg shadow-xl m-4">
        <h2 className="mb-4 text-3xl font-extrabold text-red-600">Post Limit Reached (5/5)</h2>
        <p className="max-w-md mb-6 text-lg text-gray-700">
          As a Bronze member, you can only create 5 posts.
          <br />Upgrade your membership to unlock unlimited posts!
        </p>
        <button
          onClick={() => navigate("/membership")}
          className="transition-transform duration-300 transform btn btn-primary btn-lg hover:scale-105"
        >
          Become a Member Now!
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-base-200">
      <Fade triggerOnce cascade> {/* Add Fade animation here */}
        <div className="w-full max-w-lg p-8 mx-auto border border-gray-200 shadow-xl card bg-base-100 rounded-xl">
          <h2 className="mb-8 text-4xl font-bold text-center text-primary-focus">
            Create New Post
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Author Name - Disabled */}
            <div className="relative w-full form-control">
              <label htmlFor="authorName" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary z-10">Author Name</label>
              <input
                type="text"
                id="authorName"
                placeholder=" "
                {...register("authorName")}
                disabled
                className="w-full cursor-not-allowed input input-bordered peer disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Author Email - Disabled */}
            <div className="relative w-full form-control">
              <label htmlFor="authorEmail" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary z-10">Author Email</label>
              <input
                type="email"
                id="authorEmail"
                placeholder=" "
                {...register("authorEmail")}
                disabled
                className="w-full cursor-not-allowed input input-bordered peer disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Author Photo - Disabled */}
            <div className="relative w-full form-control">
              <label htmlFor="authorPhoto" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary z-10">Author Photo URL</label>
              <input
                type="text"
                id="authorPhoto"
                placeholder=" "
                {...register("authorPhoto")}
                disabled
                className="w-full cursor-not-allowed input input-bordered peer disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Post Title Field */}
            <div className="relative w-full form-control">
              <label htmlFor="title" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary z-10">Post Title</label>
              <input
                type="text"
                id="title"
                placeholder=" "
                {...register("title", { required: "Post title is required" })}
                className="w-full input input-bordered peer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Post Description Field */}
            <div className="relative w-full form-control">
              <label htmlFor="description" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary z-10">Post Description</label>
              <textarea
                id="description"
                placeholder=" "
                {...register("description", { required: "Description is required" })}
                className="w-full h-24 textarea textarea-bordered peer"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Select Tag Field */}
            <div className="relative w-full form-control">
                <label htmlFor="tag-select" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all z-10">Select a Tag</label>
                <Select
                    id="tag-select"
                    options={options}
                    value={selectedTag}
                    onChange={setSelectedTag}
                    placeholder=" " // Use empty placeholder to let label float
                    className="w-full text-black basic-single"
                    classNamePrefix="select"
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: errors.tag ? 'red' : baseStyles.borderColor,
                            padding: '0.4rem 0', // Adjust padding to align with DaisyUI inputs
                            minHeight: '3rem', // Ensure consistent height
                            borderRadius: '0.5rem', // Match DaisyUI input border radius
                            boxShadow: state.isFocused ? '0 0 0 2px oklch(var(--p)/.2)' : baseStyles.boxShadow, // DaisyUI focus ring
                            '&:hover': {
                                borderColor: state.isFocused ? 'var(--fallback-bc,oklch(var(--p)))' : 'var(--fallback-bc,oklch(var(--bc)))',
                            },
                        }),
                        placeholder: (baseStyles) => ({
                            ...baseStyles,
                            color: 'transparent', // Make placeholder transparent for floating label to work
                            position: 'absolute',
                            left: '0.75rem', // Match input padding-left
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                        }),
                        singleValue: (baseStyles) => ({
                            ...baseStyles,
                            color: 'inherit',
                        }),
                        menu: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 9999,
                        }),
                        // Adjusting input/value container to better align with label
                        valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            paddingLeft: '0.75rem',
                        }),
                        input: (baseStyles) => ({
                            ...baseStyles,
                            padding: '0', // Remove default padding from internal input
                            margin: '0',
                        })
                    }}
                />
                {!selectedTag && errors.tag && (
                    <p className="mt-1 text-sm text-red-500">{errors.tag.message}</p>
                )}
            </div>


            {/* Upvote Field - Disabled */}
            <div className="relative w-full form-control">
              <label htmlFor="upVote" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary z-10">Upvotes (Default 0)</label>
              <input
                type="number"
                id="upVote"
                placeholder=" "
                {...register("upVote")}
                disabled
                className="w-full cursor-not-allowed input input-bordered peer disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {/* Downvote Field - Disabled */}
            <div className="relative w-full form-control">
              <label htmlFor="downVote" className="label absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-base-100 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary z-10">Downvotes (Default 0)</label>
              <input
                type="number"
                id="downVote"
                placeholder=" "
                {...register("downVote")}
                disabled
                className="w-full cursor-not-allowed input input-bordered peer disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <button type="submit" className="w-full py-3 mt-8 text-lg btn btn-primary">
              Submit Post
            </button>
          </form>
        </div>
      </Fade>
    </div>
  );
};

export default AddPost;