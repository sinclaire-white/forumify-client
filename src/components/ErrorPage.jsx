
import { Link } from 'react-router'; 
import { FaExclamationTriangle } from 'react-icons/fa'; 



const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-base-200 font-inter">
      <div className="w-full max-w-lg p-8 text-center border shadow-xl card bg-base-100 rounded-box border-base-300">
        <div className="items-center card-body">
          {/* Error Icon */}
          <FaExclamationTriangle className="w-24 h-24 mb-6 text-error animate-pulse" />
          
          {/* Error Title */}
          <h2 className="mb-4 text-4xl font-bold card-title text-error">
            Oops!
          </h2>

          {/* Error Message */}
          <p className="mb-6 text-xl text-base-content">
            Something went wrong.
          </p>
          <p className="mb-8 text-md text-base-content/70">
            We're sorry for the inconvenience. Please try again later or go back to the home page.
          </p>

          {/* Go Back Home Button */}
          <div className="justify-center card-actions">
            <Link to="/" className="transition-all duration-300 transform rounded-full shadow-lg btn btn-primary btn-lg hover:shadow-xl hover:scale-105">
              Go Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
