import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/authContext.jsx";
import { SearchIcon, LogOutIcon } from "lucide-react";

const Navbar = ({ onSearch }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-base-100 shadow-md p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      {/* Logo */}
      <Link to="/" className="font-bold text-3xl text-white">
        NotesApp
      </Link>

      {/* Search Bar */}
      {onSearch && (
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-base-800 border border-gray-600 rounded-full px-4 w-full max-w-md shadow-sm focus-within:ring-2 focus-within:ring-primary transition">
            <SearchIcon className="size-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search notes..."
              onChange={(e) => onSearch(e.target.value)}
              className="bg-transparent text-gray-200 placeholder-gray-400 outline-none w-full py-2 text-base rounded-full"
            />
          </div>
        </div>
      )}

      {/* Right-side buttons */}
      <div className="flex items-center space-x-3">
        {user ? (
          <>
            <span className="hidden sm:inline text-gray-200">Welcome, {user.name}</span>

            {/* Show Admin Dashboard link only for admin */}
            {user.role === "admin" && (
              <Link to="/admin" className="btn btn-accent btn-sm">
                Admin Dashboard
              </Link>
            )}

            <Link to="/create" className="btn btn-primary btn-sm">
              Create Note
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm flex items-center gap-1"
            >
              <LogOutIcon className="size-4" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary btn-sm px-9">Login</Link>
            <Link to="/signup" className="btn btn-secondary btn-sm px-8">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
