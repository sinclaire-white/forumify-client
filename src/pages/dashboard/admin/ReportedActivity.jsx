import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import necessary hooks
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const ReportedActivity = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch reported comments using Tanstack Query
  const {
    data: reports = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reportedComments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports"); // Your backend endpoint
      return res.data;
    },
  });

  // Mutation for deleting a reported comment/activity
  const { mutate: deleteReportedComment } = useMutation({
    mutationFn: async (reportId) => {
      const res = await axiosSecure.delete(`/reports/${reportId}`); // Your backend endpoint to delete a report
      return res.data;
    },
    onSuccess: () => {
      alert("Reported comment deleted!");
      queryClient.invalidateQueries(["reportedComments"]); // Invalidate to refetch the list
    },
    onError: (err) => {
      console.error("Failed to delete reported comment:", err);
      alert("Failed to delete reported comment. Please try again.");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reported comment?")) {
      deleteReportedComment(id);
    }
  };

  // You might also want a mutation for "approving" or dismissing a report without deleting the comment
  // For example:
  // const { mutate: dismissReport } = useMutation({
  //   mutationFn: async (reportId) => {
  //     const res = await axiosSecure.patch(`/reports/${reportId}/dismiss`);
  //     return res.data;
  //   },
  //   onSuccess: () => {
  //     alert("Report dismissed!");
  //     queryClient.invalidateQueries(["reportedComments"]);
  //   },
  // });
  // const handleDismiss = (id) => {
  //   if (window.confirm("Are you sure you want to dismiss this report?")) {
  //     dismissReport(id);
  //   }
  // };

  if (isLoading) return <div>Loading reported comments...</div>;
  if (isError) return <div>Error loading reports: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Reported Comments & Activities</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Comment</th>
              <th>Post Title</th>
              <th>Feedback</th> {/* Add Feedback column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map(({ _id, commenterEmail, commentText, postTitle, feedback }) => ( // Adjust keys based on your backend
                <tr key={_id}>
                  <td>{commenterEmail}</td>
                  <td>{commentText}</td>
                  <td>{postTitle}</td>
                  <td>{feedback}</td> {/* Display feedback */}
                  <td>
                    <button className="mr-2 btn btn-sm btn-success">
                      Approve/Dismiss {/* Reconsider this action */}
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No reported comments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportedActivity;