import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import useAuth from "../../hooks/useAuth";
import { Fade, Slide } from "react-awesome-reveal";
import Swal from "sweetalert2";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const SinglePostPage = () => {
  const { id } = useParams();
  const [newCommentText, setNewCommentText] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const shareUrl = `${window.location.origin}/post/${id}`;

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosSecure.get(`/posts/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      if (!id) return [];
      const res = await axiosSecure.get(`/comments/${id}`);
      return res.data;
    },
    enabled: !!id,
    initialData: [],
  });

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
        setNewCommentText("");
        queryClient.invalidateQueries({ queryKey: ["comments", id] });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire('Error', 'Failed to add comment. Please try again.', 'error');
    }
  };

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

  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isPostError) {
    console.error("Post fetch error:", postError);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-200">
        <p className="mb-4 text-xl font-semibold text-red-600">Failed to load post details: {postError?.message || "Unknown error"}</p>
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

  if (isCommentsError) {
    console.error("Comments fetch error:", commentsError);
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
              <h3 className="text-2xl font-semibold text-base-content/90">{post.authorName}</h3>
              <p className="text-base text-base-content/60">{postDate}</p>
              <span className="mt-2 font-medium text-white badge badge-lg badge-secondary">{post.tag}</span>
            </div>
          </div>

          <Fade delay={300} triggerOnce>
            <p className="mb-8 text-lg leading-relaxed whitespace-pre-line text-base-content/90">{post.description}</p>
          </Fade>

          {/* Voting and Share Buttons */}
          <div className="flex flex-col items-center justify-between gap-6 pt-6 mt-6 border-t border-gray-200 border-dashed sm:flex-row">
            <div className="flex space-x-6 text-lg font-medium">
              {/* Upvote Button */}
              <button
                onClick={() => handleVote('upvote')}
                className="transition-colors duration-200 btn btn-ghost hover:text-green-800"
              >
                <IconArrowUp className="w-4 h-4 mr-2 sm:w-5 sm:h-5 text-success" />
                {post.upVote} Upvotes
              </button>
              {/* Downvote Button */}
              <button
                onClick={() => handleVote('downvote')}
                className="transition-colors duration-200 btn btn-ghost hover:text-red-800"
              >
                <IconArrowDown className="w-4 h-4 mr-2 sm:w-5 sm:h-5 text-error" />
                {post.downVote} Downvotes
              </button>
            </div>
            {/* Share and Back Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {user && (
                <div className="flex gap-2">
                  <FacebookShareButton url={shareUrl} quote={post.title} hashtag={`#${post.tag}`}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <WhatsappShareButton url={shareUrl} title={post.title}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
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
                    disabled={!user}
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
                <p className="text-lg text-center text-base-content/60">No comments yet. Be the first to comment!</p>
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
                        <p className="font-semibold text-base-content/90">{comment.authorName}</p>
                        <p className="mb-2 text-sm text-base-content/60">{new Date(comment.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="leading-relaxed whitespace-pre-line text-base-content/90">{comment.commentText}</p>
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