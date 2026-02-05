import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get search query from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  // Local state for filtering (so we can filter instantly)
  const [search, setSearch] = useState(searchQuery);

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

  // Update search when query param changes
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
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
