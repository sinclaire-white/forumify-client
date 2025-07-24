import { useState } from "react"; // Keep useState for newCommentText
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { Fade, Slide } from "react-awesome-reveal";
import Swal from "sweetalert2";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQuery and useQueryClient

const SinglePostPage = () => {
  const { id } = useParams();
  const [newCommentText, setNewCommentText] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Initialize queryClient

  const shareUrl = `${window.location.origin}/post/${id}`;

  // --- TanStack Query for Post Details ---
  const {
    data: post, // Rename data to 'post' for convenience
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useQuery({
    queryKey: ["post", id], // Unique key for this query
    queryFn: async () => {
      if (!id) return null; // Prevent fetching if ID is not available
      const res = await axiosSecure.get(`/posts/${id}`);
      return res.data;
    },
    enabled: !!id, // Only run query if 'id' exists
    // You can add refetchOnWindowFocus: false if you don't want it to refetch automatically on focus
  });

  // --- TanStack Query for Comments ---
  const {
    data: comments, // Rename data to 'comments'
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", id], // Unique key for comments related to this post
    queryFn: async () => {
      if (!id) return []; // Prevent fetching if ID is not available
      const res = await axiosSecure.get(`/comments/${id}`);
      return res.data;
    },
    enabled: !!id, // Only run query if 'id' exists
    initialData: [], // Provide initial empty array to prevent issues before data loads
  });

  // --- Comment Submission ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire('Login Required', 'You need to be logged in to comment.', 'warning');
      navigate('/login');
      return;
    }
    if (!newCommentText.trim()) {
      Swal.fire('Empty Comment', 'Comment cannot be empty.', 'warning');
      return;
    }

    try {
      const commentData = {
        postId: id,
        postTitle: post?.title,
        commentText: newCommentText,
        authorEmail: user.email,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
      };
      const res = await axiosSecure.post("/comments", commentData);
      if (res.data.insertedId) {
        Swal.fire('Success', 'Comment added!', 'success');
        setNewCommentText(""); // Clear input

        // Invalidate the 'comments' query cache to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["comments", id] });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire('Error', 'Failed to add comment. Please try again.', 'error');
    }
  };

  // --- Voting ---
  const handleVote = async (type) => {
    if (!user) {
      Swal.fire('Login Required', 'You need to be logged in to vote.', 'warning');
      navigate('/login');
      return;
    }

    try {
      const res = await axiosSecure.patch(`/posts/vote/${id}`, { type });

      if (res.data.success) {
        Swal.fire('Voted!', res.data.message, 'success');
        // Invalidate the 'post' query cache to trigger a refetch of post details
        queryClient.invalidateQueries({ queryKey: ["post", id] });
      } else {
        Swal.fire('Error', 'Vote operation failed on server.', 'error');
      }
    } catch (error) {
      console.error(`Error ${type}ing post:`, error);
      const errorMessage = error.response?.data?.message || `Failed to ${type} this post.`;
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  // --- Loading and Error States ---
  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isPostError) {
    console.error("Post fetch error:", postError); // Log the actual error
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-200">
        <p className="mb-4 text-xl font-semibold text-red-600">Failed to load post details: {postError?.message || "Unknown error"}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Home
        </button>
      </div>
    );
  }

  // Handle case where post is null (e.g., 404 from backend after loading)
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-200">
        <p className="mb-4 text-xl font-semibold text-gray-600">Post not found.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Home
        </button>
      </div>
    );
  }

  // isCommentsError is generally less critical to block the whole page,
  // you might display a message within the comments section instead.
  if (isCommentsError) {
    console.error("Comments fetch error:", commentsError);
    // You could render a message inside the comments section instead of blocking the whole page
    // return <p>Error loading comments: {commentsError?.message}</p>;
  }


  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'N/A';

  return (
    <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-base-200">
      <Fade triggerOnce>
        <div className="w-full max-w-4xl p-8 mx-auto border border-gray-300 shadow-2xl card bg-base-100 rounded-xl">
          {/* Post Details Section */}
          <Slide direction="down" triggerOnce>
            <h1 className="mb-8 text-4xl font-extrabold leading-tight text-center md:text-5xl text-primary-focus">
              {post.title}
            </h1>
          </Slide>

          <div className="flex flex-col items-center justify-center mb-6 text-center sm:flex-row sm:text-left">
            <div className="mb-4 avatar sm:mb-0 sm:mr-6">
              <div className="w-24 h-24 overflow-hidden rounded-full ring ring-accent ring-offset-base-100 ring-offset-2">
                <img
                  src={post.authorPhoto || "https://via.placeholder.com/150"}
                  alt={post.authorName}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-neutral-content">{post.authorName}</h3>
              <p className="text-base text-gray-500">{postDate}</p>
              <span className="mt-2 font-medium text-white badge badge-lg badge-secondary">{post.tag}</span>
            </div>
          </div>

          <Fade delay={300} triggerOnce>
            <p className="mb-8 text-lg leading-relaxed text-gray-800 whitespace-pre-line">{post.description}</p>
          </Fade>

          {/* Voting and Share Buttons */}
          <div className="flex flex-col items-center justify-between gap-6 pt-6 mt-6 border-t border-gray-200 border-dashed sm:flex-row">
            <div className="flex space-x-6 text-lg font-medium">
              {/* Upvote Button */}
              <button
                onClick={() => handleVote('upvote')}
                className="text-green-600 transition-colors duration-200 btn btn-ghost hover:text-green-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M7 11V13C7 14.11 7.27 15.17 7.78 16.14L6.15 17.77C5.56 16.89 5 15.93 5 14.93V11H7M15 4V10L12 7L9 10V4C9 3.45 9.45 3 10 3H14C14.55 3 15 3.45 15 4M21 12V10L18 7L15 10V12H21Z" /></svg>
                {post.upVote} Upvotes
              </button>
              {/* Downvote Button */}
              <button
                onClick={() => handleVote('downvote')}
                className="text-red-600 transition-colors duration-200 btn btn-ghost hover:text-red-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M7 13V11C7 9.89 7.27 8.83 7.78 7.86L6.15 6.23C5.56 7.11 5 8.07 5 9.07V13H7M15 20V14L12 17L9 14V20C9 20.55 9.45 21 10 21H14C14.55 21 15 20.55 15 20M21 12V14L18 17L15 14V12H21Z" /></svg>
                {post.downVote} Downvotes
              </button>
            </div>
            {/* Share and Back Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {user && ( // Only show share buttons if logged in
                <div className="flex gap-2">
                  <FacebookShareButton url={shareUrl} quote={post.title} hashtag={`#${post.tag}`}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <WhatsappShareButton url={shareUrl} title={post.title}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  {/* Add more share buttons as needed */}
                </div>
              )}
              <button onClick={() => navigate(-1)} className="btn btn-outline btn-info">
                Back to Posts
              </button>
            </div>
          </div>

          {/* Comment Section */}
          <div className="pt-8 mt-12 border-t border-gray-200">
            <h2 className="mb-6 text-3xl font-bold text-center text-secondary">Comments ({comments.length})</h2>

            {/* Comment Input Form */}
            <Fade delay={100} triggerOnce>
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-4 form-control">
                  <textarea
                    className="w-full h-24 p-4 text-lg textarea textarea-bordered"
                    placeholder={user ? "Write your comment here..." : "Login to comment..."}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    disabled={!user} // Disable if not logged in
                  ></textarea>
                </div>
                <button type="submit" className="w-full text-lg btn btn-primary" disabled={!user}>
                  Post Comment
                </button>
              </form>
            </Fade>

            {/* Display Comments */}
            {comments.length === 0 ? (
              <Fade delay={200} triggerOnce>
                <p className="text-lg text-center text-gray-600">No comments yet. Be the first to comment!</p>
              </Fade>
            ) : (
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <Fade key={comment._id || index} delay={index * 50} direction="left" triggerOnce>
                    <div className="flex items-start p-4 border border-gray-200 rounded-lg shadow-sm bg-base-200">
                      <div className="mr-4 avatar">
                        <div className="w-12 h-12 overflow-hidden rounded-full ring ring-neutral ring-offset-base-200 ring-offset-1">
                          <img
                            src={comment.authorPhoto || "https://via.placeholder.com/150"}
                            alt={comment.authorName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-neutral-content">{comment.authorName}</p>
                        <p className="mb-2 text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="leading-relaxed text-gray-800 whitespace-pre-line">{comment.commentText}</p>
                      </div>
                    </div>
                  </Fade>
                ))}
              </div>
            )}
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default SinglePostPage;