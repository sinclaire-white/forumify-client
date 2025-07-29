
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const CommentsPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCommentText, setModalCommentText] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState({});
  const [reportedComments, setReportedComments] = useState({});

  const feedbackOptions = [
    { value: "spam", label: "Spam Content" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "hate_speech", label: "Hate Speech / Harassment" },
  ];

  const { data: comments = [], isLoading, isError, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      if (!postId) throw new Error("No post ID provided");
      const res = await axiosSecure.get(`/comments/${postId}`);
      return res.data;
    },
    enabled: !!postId && !authLoading,
  });

  const { mutate: reportComment } = useMutation({
    mutationFn: async ({ commentId, feedback }) => {
      const reportData = {
        commentId,
        reporterEmail: user.email,
        feedback,
        reportedAt: new Date(),
      };
      const res = await axiosSecure.post("/reports", reportData);
      return res.data;
    },
    onSuccess: (data, { commentId }) => {
      Swal.fire({
        icon: "success",
        title: "Reported!",
        text: "Comment has been reported successfully.",
        confirmButtonColor: "#3B82F6",
      });
      setReportedComments(prev => ({ ...prev, [commentId]: true }));
      setSelectedFeedback(prev => {
        const newState = { ...prev };
        delete newState[commentId];
        return newState;
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to report comment: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleReportComment = (commentId, feedback) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to be logged in to report comments.",
        confirmButtonColor: "#3B82F6",
      });
      navigate("/login");
      return;
    }
    if (!feedback) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select a feedback option before reporting.",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    if (reportedComments[commentId]) {
      Swal.fire({
        icon: "info",
        title: "Already Reported",
        text: "This comment has already been reported by you.",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    Swal.fire({
      title: "Confirm Report?",
      text: "Do you want to report this comment to the administrators?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Report It!",
    }).then((result) => {
      if (result.isConfirmed) {
        reportComment({ commentId, feedback });
      }
    });
  };

  const handleFeedbackChange = (commentId, value) => {
    setSelectedFeedback(prev => ({ ...prev, [commentId]: value }));
  };

  const handleReadMore = (text) => {
    setModalCommentText(text);
    setModalOpen(true);
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
        Error loading comments: {error.message}
        <button onClick={() => navigate(-1)} className="mt-4 btn btn-primary">Go Back</button>
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
        Comments for Post
      </h2>
      {comments.length === 0 ? (
        <motion.p
          className="text-lg text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          No comments found for this post yet.
        </motion.p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Commenter Email</th>
                <th>Comment</th>
                <th>Feedback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, index) => {
                const displayCommentText = comment.commentText.length > 20
                  ? `${comment.commentText.substring(0, 20)}...`
                  : comment.commentText;
                const showReadMore = comment.commentText.length > 20;
                const isReportButtonDisabled = !user || !selectedFeedback[comment._id] || reportedComments[comment._id];

                return (
                  <motion.tr
                    key={comment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                  >
                    <td>{index + 1}</td>
                    <td className="max-w-xs break-words">{comment.authorEmail}</td>
                    <td className="max-w-xs break-words">
                      {displayCommentText}
                      {showReadMore && (
                        <button
                          onClick={() => handleReadMore(comment.commentText)}
                          className="ml-1 btn btn-link btn-xs"
                        >
                          Read More
                        </button>
                      )}
                    </td>
                    <td>
                      <select
                        className="w-full max-w-xs select select-sm select-bordered"
                        value={selectedFeedback[comment._id] || ""}
                        onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                        disabled={reportedComments[comment._id] || !user}
                      >
                        <option value="" disabled>Select feedback</option>
                        {feedbackOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleReportComment(comment._id, selectedFeedback[comment._id])}
                        className="btn btn-sm btn-error"
                        disabled={isReportButtonDisabled}
                      >
                        Report
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {modalOpen && (
        <motion.dialog
          id="comment_modal"
          className="modal modal-open"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="modal-box bg-base-100/50 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-bold">Full Comment</h3>
            <p className="py-4 whitespace-pre-line">{modalCommentText}</p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </motion.dialog>
      )}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-info">
          Back to My Posts
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CommentsPage;