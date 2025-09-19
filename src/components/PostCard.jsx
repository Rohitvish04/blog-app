import React from "react";

function PostCard({ post }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mt-2">By {post.author?.name}</p>
    </div>
  );
}

export default PostCard;
