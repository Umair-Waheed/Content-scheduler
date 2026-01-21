import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import {formatDateTime} from "../utils/timeFormat.js"

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/posts?page=${page}&limit=10`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      alert("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleEdit = (id) => {
    navigate(`/posts/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`);
      alert("Post deleted");
      fetchPosts(page);
    } catch (err) {
      console.error(err);
      alert("Error deleting post");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>

      {loading ? (
        <div>Loading...</div>
      ) : posts.length === 0 ? (
        <div>No posts found</div>
      ) : (
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Content</th>
              <th className="py-2 px-4 border">Platforms</th>
              <th className="py-2 px-4 border">Scheduled At</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="text-center">
                <td className="py-2 px-4 border">{post.content}</td>
                <td className="py-2 px-4 border">{post.platforms.join(", ")}</td>
                <td className="py-2 px-4 border">{formatDateTime(post.scheduledAt)}</td>
                <td className="py-2 px-4 border capitalize">{post.status}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    className="bg-gray-200 text-balck px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
                    onClick={() => handleEdit(post._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 cursor-pointer"
                    onClick={() => handleDelete(post._id)} 
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-center space-x-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          className="px-3 py-1 border rounded bg-gray-100 cursor-pointer"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostsList;
