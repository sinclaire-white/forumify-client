
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddPost = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [postCount, setPostCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [userBadge, setUserBadge] = useState("bronze");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      authorName: user?.displayName || "",
      authorEmail: user?.email || "",
      authorPhoto: user?.photoURL || "",
      title: "",
      description: "",
      upVote: 0,
      downVote: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countRes, tagsRes, userRes] = await Promise.all([
          axiosSecure.get(`/posts/count?email=${user.email}`),
          axiosSecure.get("/tags"),
          axiosSecure.get("/users/check-email", { params: { email: user.email } }),
        ]);
        setPostCount(countRes.data.count);
        setTags(tagsRes.data.map(tag => ({ value: tag.name, label: tag.name })));
        setUserBadge(userRes.data.user.badge || "bronze");
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load data. Please try again.",
          confirmButtonColor: "#EF4444",
        });
      }
    };

    if (user?.email) {
      fetchData();
    }
  }, [user?.email, axiosSecure]);

  const onSubmit = async (data) => {
    if (!data.tag) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select a tag.",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    const postData = {
      authorName: user.displayName,
      authorEmail: user.email,
      authorPhoto: user.photoURL,
      title: data.title,
      description: data.description,
      tag: data.tag.value,
      upVote: 0,
      downVote: 0,
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/posts", postData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Post added successfully!",
          confirmButtonColor: "#3B82F6",
        });
        reset();
        setPostCount(prev => prev + 1);
        navigate("/dashboard/my-posts");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Could not add post.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  if (postCount >= 5 && userBadge !== "gold") {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-base-200 to-base-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-lg p-6 text-center rounded-lg shadow-md bg-base-100/50 backdrop-blur-sm lg:max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="mb-4 text-3xl font-extrabold text-red-600">Post Limit Reached (5/5)</h2>
          <p className="max-w-md mb-6 text-lg text-gray-700">
            As a Bronze member, you can only create 5 posts. Upgrade to Gold for unlimited posts!
          </p>
          <button
            onClick={() => navigate("/membership")}
            className="btn btn-primary btn-lg"
          >
            Become a Member Now!
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen py-10 bg-gradient-to-br from-base-200 to-base-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-lg p-8 mx-auto rounded-lg shadow-xl lg:max-w-2xl bg-base-100/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="mb-8 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Create New Post
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative w-full">
            <input
              type="text"
              id="authorName"
              placeholder=" "
              {...register("authorName")}
              disabled
              className="w-full placeholder-transparent transition-all duration-200 ease-in-out cursor-not-allowed peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
            />
            <label
              htmlFor="authorName"
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Author Name
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="email"
              id="authorEmail"
              placeholder=" "
              {...register("authorEmail")}
              disabled
              className="w-full placeholder-transparent transition-all duration-200 ease-in-out cursor-not-allowed peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
            />
            <label
              htmlFor="authorEmail"
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Author Email
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              id="authorPhoto"
              placeholder=" "
              {...register("authorPhoto")}
              disabled
              className="w-full placeholder-transparent transition-all duration-200 ease-in-out cursor-not-allowed peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
            />
            <label
              htmlFor="authorPhoto"
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Author Photo URL
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              id="title"
              placeholder=" "
              {...register("title", { required: "Post title is required" })}
              className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <label
              htmlFor="title"
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Post Title
            </label>
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="relative w-full">
            <textarea
              id="description"
              placeholder=" "
              {...register("description", { required: "Description is required" })}
              className="w-full h-24 placeholder-transparent transition-all duration-200 ease-in-out peer textarea textarea-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <label
              htmlFor="description"
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Post Description
            </label>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="relative w-full">
            <Controller
              name="tag"
              control={control}
              rules={{ required: "Tag is required" }}
              render={({ field }) => (
                <>
                  <Select
                    id="tag-select"
                    options={tags}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder=" "
                    className="w-full text-black basic-single"
                    classNamePrefix="select"
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: errors.tag ? "red" : baseStyles.borderColor,
                        padding: "0.4rem 0",
                        minHeight: "3rem",
                        borderRadius: "0.5rem",
                        boxShadow: state.isFocused ? "0 0 0 2px oklch(var(--p)/.2)" : baseStyles.boxShadow,
                        "&:hover": {
                          borderColor: state.isFocused ? "var(--fallback-bc,oklch(var(--p)))" : "var(--fallback-bc,oklch(var(--bc)))",
                        },
                      }),
                      placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: "transparent",
                        position: "absolute",
                        left: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }),
                      singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: "inherit",
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        zIndex: 9999,
                      }),
                      valueContainer: (baseStyles) => ({
                        ...baseStyles,
                        paddingLeft: "0.75rem",
                      }),
                      input: (baseStyles) => ({
                        ...baseStyles,
                        padding: "0",
                        margin: "0",
                      }),
                    }}
                  />
                  <label
                    htmlFor="tag-select"
                    className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
                  >
                    Select a Tag
                  </label>
                </>
              )}
            />
            {errors.tag && (
              <p className="mt-1 text-sm text-red-500">{errors.tag.message}</p>
            )}
          </div>
          <div className="relative w-full">
            <input
              type="number"
              id="upVote"
              placeholder=" "
              {...register("upVote")}
              disabled
              className="w-full placeholder-transparent transition-all duration-200 ease-in-out cursor-not-allowed peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
            />
            <label
              htmlFor="upVote"
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Upvotes (Default 0)
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="number"
              id="downVote"
              placeholder=" "
              {...register("downVote")}
              disabled
              className="w-full placeholder-transparent transition-all duration-200 ease-in-out cursor-not-allowed peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
            />
            <label
              htmlFor="downVote"
              className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
            >
              Downvotes (Default 0)
            </label>
          </div>
          <button type="submit" className="w-full mt-6 btn btn-primary">
            Submit Post
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddPost;