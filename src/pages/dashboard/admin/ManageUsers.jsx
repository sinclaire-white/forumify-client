import React, { useState } from "react";

const dummyUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", isAdmin: false, membership: "Free" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", isAdmin: true, membership: "Gold" },
  // More dummy users
];

const ManageUsers = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const makeAdmin = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, isAdmin: true } : user));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by username"
        className="input input-bordered w-full max-w-md"
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
            {filteredUsers.length ? (
              filteredUsers.map(({ id, name, email, isAdmin, membership }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{isAdmin ? "Admin" : "User"}</td>
                  <td>{membership}</td>
                  <td>
                    {!isAdmin && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => makeAdmin(id)}
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
    </div>
  );
};

export default ManageUsers;
