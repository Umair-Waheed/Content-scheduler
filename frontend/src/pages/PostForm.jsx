import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api";

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const allPlatforms = ["twitter", "facebook", "instagram"];

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        const post = res.data.post;

        setContent(post.content);
        setPlatforms(post.platforms);
        setScheduledAt(new Date(post.scheduledAt).toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm
        setImageUrl(post.imageUrl || "");
      } catch (err) {
        console.error(err);
        alert("Error fetching post");
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content || platforms.length === 0 || !scheduledAt) {
      alert("Please fill all required fields and select at least 1 platform");
      return;
    }

    const scheduledAtUTC = new Date(scheduledAt).toISOString();

    if (new Date(scheduledAtUTC) <= new Date()) {
      alert("Scheduled time must be in the future");
      return;
    }

    const payload = {
      content,
      platforms,
      scheduledAt: scheduledAtUTC,
      imageUrl
    };

    try {
  setLoading(true);

  let res;
  if (id) {
    res = await API.put(`/posts/${id}`, payload);
  } else {
    res = await API.post("/posts", payload);
  }

  if (!res.data.success) {
    alert(res.data.message || "Operation failed");
    return;
  }

  alert(res.data.message);
  navigate("/posts");

} catch (err) {
  console.error(err);
  alert(
    err.response?.data?.message || "Something went wrong"
  );
} finally {
  setLoading(false);
}

  };

  const handlePlatformChange = (platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit Post" : "Create Post"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2"
            maxLength={500}
            rows={4}
            placeholder="Enter post content"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Platforms</label>
          <div className="flex space-x-4">
            {allPlatforms.map((platform) => (
              <label key={platform} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={platforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                />
                <span className="capitalize">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Scheduled Date & Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL (Optional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
        >
          {loading ? "Submitting..." : id ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
