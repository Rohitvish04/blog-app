import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger (mobile only) + Logo */}
      <div className="flex items-center space-x-6">
        {/* Hamburger button - visible only on mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Open menu"
          className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-serif font-semibold text-gray-900 whitespace-nowrap"
        >
          Medium
        </Link>
      </div>

      {/* Center: Search bar */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-12">
        <input
          type="search"
          placeholder="Search"
          className="w-full px-5 py-3 rounded-full border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          aria-label="Search"
        />
      </div>

      {/* Right side: Write, Notifications, Profile */}
      <div className="flex items-center space-x-8">
        {/* Write button */}
        <Link
          to="/dashboard"
          className="hidden md:flex items-center text-gray-700 font-semibold hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5h6m-2 2l-7 7-3 1 1-3 7-7z"
            />
          </svg>
          Write
        </Link>

        {/* Notification bell */}
        <button
          className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Profile avatar or Sign in */}
        {user ? (
          <Link
            to="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200"
            aria-label={`Profile of ${user.name}`}
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </Link>
        ) : (
          <Link
            to="/signin"
            className="text-gray-700 font-semibold hover:text-gray-900"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
