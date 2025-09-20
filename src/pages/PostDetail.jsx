import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // parent comment ID

  // Fetch Post
  const fetchPost = async () => {
    try {
      const res = await api.get(`/api/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error fetching post", err);
    }
  };

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/comments?postId=${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  // Create Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    try {
      await api.post(
        `/api/comments`,
        {
          content: newComment,
          postId: id,
          parentId: replyTo, // null if top-level
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchComments(); // refresh comments
      setNewComment("");
      setReplyTo(null);
    } catch (err) {
      console.error("Error creating comment", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Delete Comment
  const handleDelete = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchComments(); // refresh comments
    } catch (err) {
      console.error("Error deleting comment", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // Build Nested Tree
  const buildTree = (list, parentId = null) =>
    list
      .filter((c) => c.parentId === parentId)
      .map((c) => ({ ...c, children: buildTree(list, c.id) }));

  const commentTree = buildTree(comments);

  // Recursive Comment Component
  const CommentItem = ({ comment }) => (
    <div className="ml-4 mt-3 border-l pl-4">
      <p className="font-semibold text-sm text-blue-600">
        {comment.author?.name || "Anonymous"}
      </p>
      <p className="text-gray-700">{comment.content}</p>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => setReplyTo(comment.id)}
          className="text-xs text-blue-500 hover:underline"
        >
          Reply
        </button>
        <button
          onClick={() => handleDelete(comment.id)}
          className="text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>

      {/* Render Nested Replies */}
      {comment.children?.map((child) => (
        <CommentItem key={child.id} comment={child} />
      ))}
    </div>
  );

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Post */}
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-blue-600 mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-6 whitespace-pre-line">{post.content}</p>

      {/* Like & Share */}
      <div className="flex gap-4 mb-8">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          👍 Like
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
          🔗 Share
        </button>
      </div>

      {/* Comments */}
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      {commentTree.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        commentTree.map((c) => <CommentItem key={c.id} comment={c} />)
      )}

      {/* Add Comment / Reply */}
      <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-6">
        <input
          type="text"
          placeholder={
            replyTo
              ? `Replying to ${
                  comments.find((c) => c.id === replyTo)?.author?.name ||
                  "Anonymous"
                }...`
              : "Write a comment..."
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {replyTo ? "Reply" : "Comment"}
        </button>
        {replyTo && (
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            className="px-3 py-2 bg-gray-400 text-white rounded-lg"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default BlogDetail;
