import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/posts");
      const published = res.data.filter((p) => p.isPublished === true);
      setPosts(published);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search posts"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 11-10.61-10.61 7.5 7.5 0 0110.61 10.61z"
            />
          </svg>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center text-lg mt-12">
          No published posts found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col"
              tabIndex={0}
              aria-label={`View post titled ${post.title}`}
            >
              {/* Thumbnail or Placeholder */}
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={`Thumbnail for ${post.title}`}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-semibold">
                  No Image
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-blue-600 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-700 flex-grow line-clamp-3 whitespace-pre-line">
                  {post.content}
                </p>
                <Link
                  to={`/posts/${post.id}`}
                  className="mt-4 inline-block text-sm text-blue-600 font-semibold hover:underline self-start"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
