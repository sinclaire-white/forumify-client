import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQuery, useMutation, useQueryClient
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient(); // Initialize queryClient

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Requirement: 10 users per page

  // Fetch users with search and pagination using Tanstack Query
  const {
    data: usersData = { users: [], totalUsers: 0 }, // Default to empty array and 0
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", searchTerm, currentPage], // Query key includes search and page
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?search=${searchTerm}&page=${currentPage}&limit=${usersPerPage}` // Backend endpoint
      );
      return res.data;
    },
    keepPreviousData: true, // Optional: keeps previous data while fetching new page
  });

  const users = usersData.users;
  const totalUsers = usersData.totalUsers;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Mutation for making a user admin
  const { mutate: makeAdminMutation } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.patch(`/users/${userId}/make-admin`); // Your backend endpoint
      return res.data;
    },
    onSuccess: () => {
      alert("User successfully made admin!");
      // Invalidate the 'users' query to refetch the updated user list
      queryClient.invalidateQueries(["users"]);
    },
    onError: (err) => {
      console.error("Failed to make admin:", err);
      alert("Failed to make admin. Please try again.");
    },
  });

  const handleMakeAdmin = (id) => {
    makeAdminMutation(id);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by username"
        className="w-full max-w-md input input-bordered"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
              users.map(({ _id, name, email, role, membershipStatus }) => ( // Adjust keys based on your backend
                <tr key={_id}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{role === "admin" ? "Admin" : "User"}</td> {/* Use 'role' from backend */}
                  <td>{membershipStatus || "Free"}</td>{" "}
                  {/* Adjust key based on backend */}
                  <td>
                    {role !== "admin" && ( // Only show button if not already admin
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleMakeAdmin(_id)}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
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
        </div>
      )}
    </div>
  );
};

export default ManageUsers;