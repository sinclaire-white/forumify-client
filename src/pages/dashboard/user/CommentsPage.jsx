// src/pages/dashboard/comments-page/CommentsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // Use useParams to get postId, useNavigate for redirection


import Swal from "sweetalert2"; // For user feedback (alerts/confirmations)
import { Fade } from "react-awesome-reveal"; // For subtle animations
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const CommentsPage = () => {
  const { postId } = useParams(); // Extracts the postId from the URL (e.g., /dashboard/comments/12345)
  const navigate = useNavigate(); // Hook for programmatic navigation
  const axiosSecure = useAxiosSecure(); // Custom hook for authenticated Axios instance
  const { user, loading: authLoading } = useAuth(); // Get current user info and auth loading state

  const [comments, setComments] = useState([]); // State to store fetched comments
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state for data fetching
  // Stores the selected feedback for each comment, keyed by comment._id
  const [selectedFeedback, setSelectedFeedback] = useState({});
  // Stores a boolean for each comment._id if it has been reported by the current user
  const [reportedComments, setReportedComments] = useState({});

  // Static feedback options for the dropdown
  const feedbackOptions = [
    { value: "spam", label: "Spam Content" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "hate_speech", label: "Hate Speech / Harassment" },
    // You can add more relevant options here
  ];

  // Effect hook to fetch comments when postId or authLoading status changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) { // If no postId is present in the URL, set an error and stop loading
        setError("No post ID provided to fetch comments.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true); // Start loading
        setError(null); // Clear previous errors
        // Make an API call to your backend to get comments for the specific postId
        const res = await axiosSecure.get(`/comments/${postId}`);
        setComments(res.data); // Update comments state with fetched data
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments. Please try again."); // Set user-friendly error message
      } finally {
        setLoading(false); // End loading, regardless of success or failure
      }
    };

    // Only fetch comments if authentication state is resolved (not loading)
    if (!authLoading) {
      fetchComments();
    }
  }, [postId, authLoading, axiosSecure]); // Dependencies: re-run if these values change

  // Handler for reporting a comment
  const handleReportComment = async (commentId, feedback) => {
    // Client-side validation: Check if user is logged in
    if (!user) {
      Swal.fire('Login Required', 'You need to be logged in to report comments.', 'warning');
      navigate('/login'); // Redirect to login page
      return;
    }
    // Client-side validation: Check if feedback is selected
    if (!feedback) {
      Swal.fire('Selection Required', 'Please select a feedback option before reporting.', 'warning');
      return;
    }
    // Client-side prevention of multiple reports (optional, backend should also enforce)
    if (reportedComments[commentId]) {
      Swal.fire('Already Reported', 'This comment has already been reported by you.', 'info');
      return;
    }

    // Confirmation dialog before sending the report
    Swal.fire({
      title: "Confirm Report?",
      text: "Do you want to report this comment to the administrators?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for destructive action
      cancelButtonColor: "#3085d6", // Blue for cancel
      confirmButtonText: "Yes, Report It!"
    }).then(async (result) => {
      if (result.isConfirmed) { // If user confirms
        try {
          // Prepare report data to send to the backend
          const reportData = {
            commentId: commentId,
            reporterEmail: user.email, // Use authenticated user's email as reporter
            feedback: feedback,
            reportedAt: new Date(),
          };
          // Make an authenticated POST request to the new /reports endpoint
          const res = await axiosSecure.post("/reports", reportData);

          if (res.data.insertedId) { // If report was successfully inserted
            Swal.fire("Reported!", "Comment has been reported successfully.", "success");
            // Update state to disable the report button for this specific comment
            setReportedComments(prev => ({ ...prev, [commentId]: true }));
            // Optionally, clear the selected feedback for this comment after reporting
            setSelectedFeedback(prev => {
                const newState = { ...prev };
                delete newState[commentId]; // Remove the selected feedback for this comment
                return newState;
            });
          } else {
            Swal.fire("Error", "Failed to report comment. Please try again.", "error");
          }
        } catch (error) {
          console.error("Error reporting comment:", error);
          // Show error message from backend if available, otherwise a generic one
          Swal.fire("Error", error.response?.data?.message || "Could not report comment due to server error.", "error");
        }
      }
    });
  };

  // Handler for when a user selects a feedback option from the dropdown
  const handleFeedbackChange = (commentId, value) => {
    setSelectedFeedback(prev => ({ ...prev, [commentId]: value })); // Update state for the specific comment's feedback
  };

  // State and functions for the "Read More" modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCommentText, setModalCommentText] = useState("");

  // Function to open the modal with the full comment text
  const handleReadMore = (text) => {
    setModalCommentText(text);
    setModalOpen(true);
  };

  // Display loading state while fetching data
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Display error state if data fetching failed
  if (error) {
    return (
      <div className="mt-10 text-xl font-semibold text-center text-red-600">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 btn btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Fade direction="down" triggerOnce>
        {/* Displaying a truncated Post ID for readability */}
        <h2 className="mb-8 text-4xl font-bold text-center text-primary-focus">Comments for Post ID: {postId?.slice(0, 8)}...</h2>
      </Fade>

      {comments.length === 0 ? (
        <Fade delay={200} triggerOnce>
          <p className="mt-10 text-xl text-center text-gray-600">No comments found for this post yet.</p>
        </Fade>
      ) : (
        <Fade delay={200} triggerOnce>
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-xl">
            <table className="table table-zebra w-full min-w-[700px]"> 
                {/* min-width for better mobile experience */}
              <thead>
                <tr className="bg-base-200 text-neutral-content">
                  <th className="p-4">#</th>
                  <th className="p-4">Commenter Email</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Feedback</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => {
                  // Truncate comment text if longer than 20 characters
                  const displayCommentText = comment.commentText.length > 20
                    ? `${comment.commentText.substring(0, 20)}...`
                    : comment.commentText;
                  const showReadMore = comment.commentText.length > 20;

                  // Determine if report button should be disabled:
                  // 1. If user is not logged in (!user)
                  // 2. If no feedback is selected for this specific comment (!selectedFeedback[comment._id])
                  // 3. If this specific comment has already been reported by the current user (reportedComments[comment._id])
                  const isReportButtonDisabled = !user || !selectedFeedback[comment._id] || reportedComments[comment._id];

                  return (
                    <tr key={comment._id} className="transition-colors hover:bg-base-200">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-medium text-neutral-content break-words max-w-[200px]">
                        {comment.authorEmail}
                      </td>
                      <td className="p-4 max-w-[250px] break-words">
                        {displayCommentText}
                        {showReadMore && (
                          <button
                            onClick={() => handleReadMore(comment.commentText)}
                            className="h-auto min-h-0 p-0 ml-1 align-baseline btn btn-link btn-xs"
                          >
                            Read More
                          </button>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          className="w-full max-w-xs select select-sm select-bordered"
                          value={selectedFeedback[comment._id] || ""} // Controlled component value
                          onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                          disabled={reportedComments[comment._id] || !user} // Disable dropdown if already reported or not logged in
                        >
                          <option value="" disabled>Select feedback</option>
                          {feedbackOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleReportComment(comment._id, selectedFeedback[comment._id])}
                          className="text-white transition-all btn btn-sm btn-error hover:btn-active"
                          disabled={isReportButtonDisabled}
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Fade>
      )}

      {/* Modal for full comment text - DaisyUI modal component */}
      {modalOpen && (
        <dialog id="comment_modal" className="modal modal-open" open>
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">Full Comment</h3>
            <p className="py-4 whitespace-pre-line">{modalCommentText}</p>
            <div className="modal-action">
              <form method="dialog">
                {/* Close button for the modal */}
                <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
      <div className="mt-8 text-center">
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-info">
          Back to My Posts
        </button>
      </div>
    </div>
  );
};

export default CommentsPage;