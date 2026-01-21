import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { token, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!token) return null; // Hide navbar if not logged in

  return (
    <nav className="bg-purple-600 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Content Scheduler
        </Link>

        <div className="flex space-x-4 items-center">
          <Link
            to="/"
            className="hover:bg-purple-700 px-3 py-2 rounded transition"
          >
            Dashboard
          </Link>
          <Link
            to="/posts"
            className="hover:bg-purple-700 px-3 py-2 rounded transition"
          >
            Posts
          </Link>
          <Link
            to="/posts/create"
            className="hover:bg-purple-700 px-3 py-2 rounded transition"
          >
            Create Post
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 px-3 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
