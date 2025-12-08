import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const Error404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <FaExclamationTriangle className="text-8xl text-warning" />
        </div>
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary btn-lg gap-2">
          <FaHome />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;
