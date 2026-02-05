import React, { useState } from "react";
import api from "../api/api";

function PostForm({ setPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("api/posts", { title, content });
      setPosts((prev) => [res.data, ...prev]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
      // Optionally show user feedback here
    }
  };

  return (
    <form
      onSubmit={submitPost}
      className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4 bg-white rounded shadow-md"
    >
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-4 py-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border border-gray-300 rounded px-4 py-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition min-h-[150px] resize-y"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700 transition"
      >
        Create Post
      </button>
    </form>
  );
}

export default PostForm;
