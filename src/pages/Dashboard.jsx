import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "DRAFT",
    isPublished: false,
    thumbnail: null, // file
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch posts (only this user's posts)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token || !user) {
        navigate("/login");
        return;
      }

      const res = await api.get("api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myPosts = res.data.filter((post) => post.authorId === user?.id);
      setPosts(myPosts);
    } catch (err) {
      console.error("Error fetching posts", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [user]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, thumbnail: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  // Submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("status", form.status);
      fd.append("isPublished", form.isPublished);
      fd.append("authorId", user?.id);
      if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

      if (editingId) {
        await api.put(`api/posts/${editingId}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("api/posts", fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setForm({
        title: "",
        content: "",
        status: "DRAFT",
        isPublished: false,
        thumbnail: null,
      });
      setThumbnailPreview(null);
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      content: post.content,
      status: post.status,
      isPublished: post.isPublished,
      thumbnail: null,
    });
    setThumbnailPreview(post.thumbnail || null);
    setEditingId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      await api.delete(`api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">
              Title
            </span>
            <input
              type="text"
              name="title"
              placeholder="Post Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">
              Content
            </span>
            <textarea
              name="content"
              placeholder="Post Content"
              value={form.content}
              onChange={handleChange}
              rows="5"
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">
              Thumbnail
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg cursor-pointer"
            />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="mt-3 w-48 h-32 object-cover rounded-lg shadow-md"
              />
            )}
          </label>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gray-700 font-semibold">Status</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700 font-semibold">Published</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {editingId ? "Update Post" : "Create Post"}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <h3 className="text-2xl font-semibold mb-6">My Posts</h3>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          You have not created any posts yet.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md p-6 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex-1">
                <h4 className="text-xl font-bold text-blue-600">{post.title}</h4>
                <p className="text-gray-700 mt-2 whitespace-pre-line">{post.content}</p>
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt="thumbnail"
                    className="w-40 h-24 object-cover mt-4 rounded-lg shadow-sm"
                  />
                )}
                <p className="text-sm text-gray-500 mt-3">
                  Status: <span className="font-semibold">{post.status}</span> | Published:{" "}
                  <span>{post.isPublished ? "✅ Yes" : "❌ No"}</span>
                </p>
              </div>

              <div className="flex space-x-3 mt-4 sm:mt-0">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  aria-label={`Edit post titled ${post.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    deletingId === post.id
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  aria-label={`Delete post titled ${post.title}`}
                >
                  {deletingId === post.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
