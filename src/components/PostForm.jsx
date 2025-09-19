import React, { useState } from "react";
import api from "../api/api";

function PostForm({ setPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitPost = async (e) => {
    e.preventDefault();
    const res = await api.post("api/posts", { title, content });
    setPosts((prev) => [res.data, ...prev]);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={submitPost} className="space-y-3">
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border px-3 py-2 rounded"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Create Post
      </button>
    </form>
  );
}

export default PostForm;
