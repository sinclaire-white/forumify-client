
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyPost = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: myPosts = [], isLoading, isError, error } = useQuery({
    queryKey: ["myPosts", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("No user email available");
      const res = await axiosSecure.get(`/my-posts?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email && !authLoading,
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: async (postId) => {
      const res = await axiosSecure.delete(`/posts/${postId}`);
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: data.message,
        confirmButtonColor: "#3B82F6",
      });
      queryClient.invalidateQueries(["myPosts"]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to delete post: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleDeletePost = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the post and all its comments.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(postId);
      }
    });
  };

  if (authLoading || isLoading) {
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

  if (isError) {
    return (
      <motion.div
        className="mt-8 text-center text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Error loading posts: {error.message}
        <button onClick={() => queryClient.refetchQueries(["myPosts"])} className="mt-4 btn btn-primary">Retry</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-6 py-8 space-y-6 shadow-xl bg-gradient-to-br from-base-200 to-base-300 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        My Posts
      </h2>
      {myPosts.length === 0 ? (
        <motion.p
          className="text-lg text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          You have not created any posts yet.
        </motion.p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Votes</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myPosts.map((post, index) => (
                <motion.tr
                  key={post._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <td>{index + 1}</td>
                  <td className="max-w-xs truncate">{post.title}</td>
                  <td className="text-center">{post.upVote - post.downVote}</td>
                  <td className="text-center">
                    <button
                      onClick={() => navigate(`/dashboard/comments/${post._id}`)}
                      className="btn btn-sm btn-info"
                    >
                      Comments ({post.commentCount || 0})
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default MyPost;