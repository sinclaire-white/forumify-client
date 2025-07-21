
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router"; 
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyPost = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch posts, called on mount and after deletion
  const fetchMyPosts = async () => {
  if (!user?.email) {
    setLoading(false);
    return;
  }
  try {
    setLoading(true);
    setError(null);
    const res = await axiosSecure.get(`/my-posts?email=${user.email}`);
    setMyPosts(res.data);
   
    
  } catch (err) {
    console.error("Error fetching my posts:", err);
    setError("Failed to load your posts. Please try again.");
    setMyPosts([]); // Clear posts on error
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!authLoading) { // Fetch posts once user authentication is resolved
      fetchMyPosts();
    }
  }, [user?.email, authLoading, axiosSecure]); // Dependencies

  const handleDeletePost = async (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this! This will also delete all comments on this post.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send DELETE request to the backend for the specific post
          const res = await axiosSecure.delete(`/posts/${postId}`);
          if (res.data.deletedCount > 0) {
            Swal.fire(
              "Deleted!",
              "Your post has been deleted.",
              "success"
            );
            // Update UI by filtering out the deleted post
            setMyPosts(myPosts.filter(post => post._id !== postId));
          } else {
            Swal.fire("Error", "Failed to delete post.", "error");
          }
        } catch (error) {
          console.error("Error deleting post:", error);
          Swal.fire("Error", error.response?.data?.message || "Could not delete post. Server error.", "error");
        }
      }
    });
  };

  // Display loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="mt-10 text-xl font-semibold text-center text-red-600">
        <p>{error}</p>
        <button onClick={fetchMyPosts} className="mt-4 btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Fade direction="down" triggerOnce>
        <h2 className="mb-8 text-4xl font-bold text-center text-primary-focus">My Posts</h2>
      </Fade>
      {myPosts.length === 0 ? (
        <Fade delay={200} triggerOnce>
          <p className="mt-10 text-xl text-center text-gray-600">You have not created any posts yet.</p>
        </Fade>
      ) : (
        <Fade delay={200} triggerOnce>
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-xl">
            <table className="table table-zebra w-full min-w-[600px]">
              <thead>
                <tr className="bg-base-200 text-neutral-content">
                  <th className="p-4">#</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Votes</th>
                  <th className="p-4">Comments</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPosts.map((post, index) => (
                  <tr key={post._id} className="transition-colors hover:bg-base-200">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium text-neutral-content break-words max-w-[250px]">
                      {post.title}
                    </td>
                    <td className="p-4 text-center">
                      {post.upVote - post.downVote}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => navigate(`/dashboard/comments/${post._id}`)} // Redirect to comments page
                        className="text-white transition-all btn btn-sm btn-info hover:btn-active"
                      >
                        Comments ({post.commentCount || 0}) {/* Display comment count */}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-white transition-all btn btn-sm btn-error hover:btn-active"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default MyPost;