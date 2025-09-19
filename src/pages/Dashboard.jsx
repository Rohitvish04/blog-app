import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // axios instance

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "DRAFT",
    isPublished: false,
    thumbnail: null, // file
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch posts (only this user's posts)
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        navigate("/login");
        return;
      }

      const res = await api.get("api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Filter only logged-in user posts
      const myPosts = res.data.filter((post) => post.authorId === user?.id);
      setPosts(myPosts);
    } catch (err) {
      console.error("Error fetching posts", err);

      // ✅ If Unauthorized → logout + redirect
      if (err.response?.status === 401) {
        logout(); // clear localStorage
        navigate("/login");
      }
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
    setForm((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
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
    setEditingId(post.id);
  };

  const handleDelete = async (id) => {
    try {
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
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="content"
            placeholder="Post Content"
            value={form.content}
            onChange={handleChange}
            rows="4"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <div className="flex items-center gap-4">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
              />
              Published
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {editingId ? "Update Post" : "Create Post"}
          </button>
        </form>
      </div>

      <h3 className="text-xl font-semibold mb-4">My Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts created yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <h4 className="text-lg font-bold text-blue-600">{post.title}</h4>
                <p className="text-gray-700 mt-1">{post.content}</p>
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt="thumbnail"
                    className="w-32 h-20 object-cover mt-2 rounded-lg"
                  />
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Status: {post.status} | Published:{" "}
                  {post.isPublished ? "✅ Yes" : "❌ No"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
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
