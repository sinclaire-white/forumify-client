import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth"; // Import useAuth
import { Fade, Slide } from "react-awesome-reveal";
import Swal from "sweetalert2";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share"; 

const SinglePostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // State for comments
  const [newCommentText, setNewCommentText] = useState(""); // State for new comment input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Get user from auth context
  const navigate = useNavigate();

  // URL for sharing (will be dynamic based on current page)
  const shareUrl = `${window.location.origin}/post/${id}`; // Dynamic share URL

  // --- Fetch Post Details and Comments ---
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const postResponse = await axiosSecure.get(`/posts/${id}`);
        setPost(postResponse.data);

        // Fetch comments for this post
        const commentsResponse = await axiosSecure.get(`/comments/${id}`);
        setComments(commentsResponse.data);

      } catch (err) {
        console.error("Failed to fetch post details or comments:", err);
        setError("Failed to load post details. It might not exist or there was a server error.");
        Swal.fire('Error', 'Failed to load post.', 'error');
        setPost(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id, axiosSecure]);

  // --- Comment Submission ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire('Login Required', 'You need to be logged in to comment.', 'warning');
      navigate('/login'); // Redirect to login
      return;
    }
    if (!newCommentText.trim()) {
      Swal.fire('Empty Comment', 'Comment cannot be empty.', 'warning');
      return;
    }

    try {
      const commentData = {
        postId: id,
        postTitle: post?.title, // Get post title from fetched post data
        commentText: newCommentText,
        authorEmail: user.email,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
      };
      const res = await axiosSecure.post("/comments", commentData);
      if (res.data.insertedId) {
        Swal.fire('Success', 'Comment added!', 'success');
        setNewCommentText(""); // Clear input
        // Re-fetch comments to show the new one immediately
        const commentsResponse = await axiosSecure.get(`/comments/${id}`);
        setComments(commentsResponse.data);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire('Error', 'Failed to add comment. Please try again.', 'error');
    }
  };

  // --- Voting ---
  const handleVote = async (type) => { // 'upvote' or 'downvote'
    if (!user) {
      Swal.fire('Login Required', 'You need to be logged in to vote.', 'warning');
      navigate('/login');
      return;
    }

    try {
      const res = await axiosSecure.patch(`/posts/vote/${id}`, { type });
      if (res.data.modifiedCount > 0) {
        Swal.fire('Voted!', `You ${type}d this post.`, 'success');
        // Optimistically update UI or re-fetch post to show new vote count
        setPost(prevPost => ({
          ...prevPost,
          [type === 'upvote' ? 'upVote' : 'downVote']: prevPost[type === 'upvote' ? 'upVote' : 'downVote'] + 1
        }));
      }
    } catch (error) {
      console.error(`Error ${type}ing post:`, error);
      Swal.fire('Error', `Failed to ${type} this post.`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-200">
        <p className="mb-4 text-xl font-semibold text-red-600">{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Home
        </button>
      </div>
    );
  }

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