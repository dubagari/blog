import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-white font-bold text-2xl hover:text-blue-200"
          >
            📝 BlogHub
          </Link>

          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="text-white hover:text-blue-200 transition">
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/create"
                  className="text-white hover:text-blue-200 transition"
                >
                  Write Post
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-blue-200 transition"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="text-white flex items-center space-x-4">
                  <span className="text-sm">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-white hover:text-blue-200 py-2">
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/create"
                  className="block text-white hover:text-blue-200 py-2"
                >
                  Write Post
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block text-white hover:text-blue-200 py-2"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-white hover:text-blue-200 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
