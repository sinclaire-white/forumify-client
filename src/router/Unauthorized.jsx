
import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="mb-6 text-lg text-gray-700">
        You do not have permission to view this page.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Homepage
      </Link>
    </div>
  );
};

export default Unauthorized;
