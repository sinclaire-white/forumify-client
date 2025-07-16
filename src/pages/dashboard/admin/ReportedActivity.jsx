import React from "react";

const dummyReports = [
  {
    id: 1,
    user: "User1",
    comment: "This comment is offensive",
    postTitle: "How to learn React?",
  },
  {
    id: 2,
    user: "User2",
    comment: "Spam comment here",
    postTitle: "Volunteer opportunities",
  },
];

const ReportedActivity = () => {
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyReports.map(({ id, user, comment, postTitle }) => (
              <tr key={id}>
                <td>{user}</td>
                <td>{comment}</td>
                <td>{postTitle}</td>
                <td>
                  <button className="btn btn-sm btn-success mr-2">Approve</button>
                  <button className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            ))}
            {dummyReports.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
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
