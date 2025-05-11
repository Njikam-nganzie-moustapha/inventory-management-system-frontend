import { Link } from 'react-router-dom';
import { MdHome, MdInventory } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <MdHome className="-ml-1 mr-2 h-5 w-5" />
              Go Home
            </Link>
            <Link
              to="/inventory"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <MdInventory className="-ml-1 mr-2 h-5 w-5" />
              View Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
