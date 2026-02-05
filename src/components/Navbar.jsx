import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200">
      {/* Logo */}
      <Link to="/" className="text-2xl font-serif font-semibold text-gray-900">
        Medium
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-6">
        <input
          type="search"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-label="Search"
        />
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center space-x-6">
        <Link
          to="/write"
          className="text-gray-700 font-semibold hover:text-gray-900"
        >
          Write
        </Link>

        {!user ? (
          <>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Sign up
            </Link>
            <Link
              to="/signin"
              className="text-gray-700 font-semibold hover:text-gray-900"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200"
              aria-label={`Profile of ${user.name}`}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </Link>

            <button
              onClick={logout}
              className="text-gray-700 font-semibold hover:text-gray-900"
              aria-label="Logout from your account"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
