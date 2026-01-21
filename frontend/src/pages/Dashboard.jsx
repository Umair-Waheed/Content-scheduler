import { useState, useEffect } from "react";
import API from "../utils/api";
import {formatDateTime} from "../utils/timeFormat.js"

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const statsRes = await API.get("/dashboard/stats");
        const upcomingRes = await API.get("/dashboard/upcoming");

        setStats(statsRes.data);
        setUpcoming(upcomingRes.data.posts || []);
      } catch (err) {
        console.error(err);
        alert("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-600 text-white p-4 rounded shadow">
          <h2 className="font-bold">Total Posts</h2>
          <p className="text-2xl">{stats?.totalPosts}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Scheduled</h2>
          <p className="text-2xl">{stats?.scheduledPosts}</p>
        </div>
        <div className="bg-purple-400 text-white p-4 rounded shadow">
          <h2 className="font-bold">Published</h2>
          <p className="text-2xl">{stats.publishedPosts}</p>
        </div>
        <div className="bg-purple-300 text-white p-4 rounded shadow">
          <h2 className="font-bold">Posts by Platform</h2>
          <p>Twitter: {stats.platformStats.twitter || 0}</p>
          <p>Facebook: {stats.platformStats.facebook || 0}</p>
          <p>Instagram: {stats.platformStats.instagram || 0}</p>
        </div>
      </div>

      {/* Upcoming Posts */}
      <div>
        <h2 className="text-xl font-bold mb-2">Next 5 Upcoming Posts</h2>
        {upcoming.length === 0 ? (
          <p>No upcoming posts</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded">
              <thead className="bg-purple-200">
                <tr>
                  <th className="px-4 py-2 border">Content</th>
                  <th className="px-4 py-2 border">Platforms</th>
                  <th className="px-4 py-2 border">Scheduled At</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((post) => (
                  <tr key={post._id} className="text-center">
                    <td className="px-4 py-2 border">{post.content}</td>
                    <td className="px-4 py-2 border">{post.platforms.join(", ")}</td>
                    <td className="px-4 py-2 border">
                      {formatDateTime(post.scheduledAt)}
                    </td>
                    <td className="px-4 py-2 border capitalize">{post.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
