
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ReportedActivity = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch reported comments
  const {
    data: reports = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reportedComments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return res.data;
    },
  });

  // Mutation for deleting a report
  const { mutate: deleteReport, isLoading: isDeleting } = useMutation({
    mutationFn: async (reportId) => {
      const res = await axiosSecure.delete(`/reports/${reportId}`);
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data.message,
        confirmButtonColor: "#3B82F6",
      });
      queryClient.invalidateQueries(["reportedComments"]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to delete report: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  // Mutation for dismissing a report
  const { mutate: dismissReport, isLoading: isDismissing } = useMutation({
    mutationFn: async (reportId) => {
      const res = await axiosSecure.patch(`/reports/${reportId}/dismiss`);
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data.message,
        confirmButtonColor: "#3B82F6",
      });
      queryClient.invalidateQueries(["reportedComments"]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to dismiss report: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the reported comment and its report.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReport(id);
      }
    });
  };

  const handleDismiss = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will mark the report as dismissed without deleting the comment.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, dismiss",
    }).then((result) => {
      if (result.isConfirmed) {
        dismissReport(id);
      }
    });
  };

  if (isLoading) {
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
        Error loading reports: {error.message}
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
        Reported Comments & Activities
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Commenter</th>
              <th>Comment</th>
              <th>Post Title</th>
              <th>Feedback</th>
              <th>Reported By</th>
              <th>Reported At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map(({ _id, commenterEmail, commentText, postTitle, feedback, reporterEmail, reportedAt, status }, i) => (
                <motion.tr
                  key={_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  <td>{commenterEmail}</td>
                  <td className="max-w-xs truncate">{commentText}</td>
                  <td>{postTitle}</td>
                  <td>{feedback}</td>
                  <td>{reporterEmail}</td>
                  <td>
                    {new Date(reportedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>{status}</td>
                  <td>
                    <button
                      className="mr-2 btn btn-sm btn-success"
                      onClick={() => handleDismiss(_id)}
                      disabled={isDismissing || status === "dismissed"}
                    >
                      Dismiss
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(_id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No reported comments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ReportedActivity;