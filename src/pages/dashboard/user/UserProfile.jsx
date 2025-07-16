const UserProfile = () => {
  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="User"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm text-gray-500">johndoe@example.com</p>
            <div className="mt-2 flex gap-2">
              <div className="badge badge-warning">Bronze Badge</div>
              <div className="badge badge-success">Gold Badge</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Recent Posts</h3>
        <ul className="space-y-2">
          <li className="p-4 bg-base-200 rounded-lg shadow">
            <h4 className="font-bold">Post Title One</h4>
            <p className="text-sm text-gray-600">Short description...</p>
          </li>
          <li className="p-4 bg-base-200 rounded-lg shadow">
            <h4 className="font-bold">Post Title Two</h4>
            <p className="text-sm text-gray-600">Short description...</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
