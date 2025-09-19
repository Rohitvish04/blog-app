import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Brand */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        BlogsApp
      </Link>

      {/* Links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>

            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
