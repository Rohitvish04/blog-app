import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Brand */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        BlogsApp
      </Link>

      {/* Hamburger for mobile */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="hover:text-blue-600 transition-colors duration-200">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors duration-200">
              Dashboard
            </Link>

            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
              aria-label={`Profile of ${user.name}`}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              aria-label="Logout from your account"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 transition-colors duration-200">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 space-y-3 z-10">
          <Link to="/" className="w-full hover:text-blue-600 transition-colors duration-200" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="w-full hover:text-blue-600 transition-colors duration-200" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
                aria-label={`Profile of ${user.name}`}
                onClick={() => setIsOpen(false)}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </Link>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                aria-label="Logout from your account"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="w-full hover:text-blue-600 transition-colors duration-200" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
