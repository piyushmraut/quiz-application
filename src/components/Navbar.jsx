import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
                QuizApp
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-quiz"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Create Quiz
                </Link>
                <Link
                  to="/quizzes"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Quizzes
                </Link>
              </div>
            )}
          </div>
          {user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeftOnRectangleIcon className="-ml-1 mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;