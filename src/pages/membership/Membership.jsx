// src/pages/membership/Membership.jsx
import { useNavigate } from "react-router";

const Membership = () => {
  const navigate = useNavigate();

  // Dummy handler — replace with backend request later
  const handleUpgrade = () => {
    // TODO: Send request to backend to update user's membership status
    // Show toast or alert if needed
    console.log("Membership upgraded!");
    navigate("/dashboard/add-post");
  };

  return (
    <div className="max-w-4xl px-4 py-12 mx-auto">
      <div className="p-8 space-y-6 text-center rounded-lg shadow-md bg-base-200">
        <h2 className="text-3xl font-bold">Upgrade to Gold Membership</h2>
        <p className="text-lg text-gray-600">
          You've reached your posting limit as a Bronze user. Become a member to unlock unlimited posting and earn the Gold Badge!
        </p>

        <div className="flex justify-center">
          <img
            src="" // Optional badge image
            alt="Gold Badge"
            className="w-32 h-32"
          />
        </div>

        <button
          onClick={handleUpgrade}
          className="px-8 text-lg text-white btn btn-primary"
        >
          Become a Member
        </button>
      </div>
    </div>
  );
};

export default Membership;
