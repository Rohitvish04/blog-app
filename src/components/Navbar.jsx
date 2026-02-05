import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    // Navigate to Home with query param
    navigate(`/?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
      {/* Brand */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        BlogsApp
      </Link>

      {/* Search + Links */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 w-full md:w-auto space-y-2 md:space-y-0">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex w-full md:w-64 border rounded-lg overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
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
      </div>
    </nav>
  );
}

export default Navbar;
