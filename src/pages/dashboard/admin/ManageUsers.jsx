
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch users
  const {
    data: usersData = { users: [], totalUsers: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", debouncedSearch, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?search=${debouncedSearch}&page=${currentPage}&limit=${usersPerPage}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = usersData.users;
  const totalUsers = usersData.totalUsers;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Mutation for making admin
  const { mutate: makeAdminMutation, isLoading: isMakingAdmin } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.patch(`/users/${userId}/make-admin`);
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data.message,
        confirmButtonColor: "#3B82F6",
      });
      queryClient.invalidateQueries(["users"]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to make admin: ${err.response?.data?.message || err.message}`,
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleMakeAdmin = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be promoted to admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, make admin",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdminMutation(id);
      }
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev -1);
    }
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
        Error loading users: {error.message}
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
        Manage Users
      </h2>
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder=" "
          className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label
          className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
        >
          Search by username
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Admin Status</th>
              <th>Subscription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(({ _id, name, email, role, badge }) => (
                <motion.tr
                  key={_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * users.indexOf({ _id, name, email, role, badge }), duration: 0.4 }}
                >
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{role === "admin" ? "Admin" : "User"}</td>
                  <td>{badge === "gold" ? "Gold" : "Bronze"}</td>
                  <td>
                    {role !== "admin" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleMakeAdmin(_id)}
                        disabled={isMakingAdmin}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <button
            className="btn btn-outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageUsers;