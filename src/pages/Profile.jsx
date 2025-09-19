import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

function Profile() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user?._id) {
      api.get(`api/users/${user._id}/posts`).then(res => setPosts(res.data));
    }
  }, [user]);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <h3 className="mt-6 text-xl font-semibold">My Posts</h3>
      <div className="mt-2">
        {posts.length === 0 ? (
          <p>You have no posts yet.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="border p-2 mb-2 rounded">
              {post.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
