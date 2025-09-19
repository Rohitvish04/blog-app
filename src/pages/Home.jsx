import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api"; // axios instance

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await api.get("api/posts");
      // only show published
      const published = res.data.filter((p) => p.isPublished === true);
      setPosts(published);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter by search
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center">No published posts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
            >
              {/* Thumbnail */}
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-700 line-clamp-3">{post.content}</p>

                {/* Link to Blog Detail */}
                <Link
                  to={`/posts/${post.id}`}
                  className="text-sm text-blue-500 hover:underline mt-3 inline-block"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
