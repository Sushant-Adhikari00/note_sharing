import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/authContext.jsx";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);             // clear context
    localStorage.removeItem("token"); // remove JWT
    localStorage.removeItem("user");  // remove user info
    navigate("/login");        // redirect to login page
  };

  return (
    <nav className="bg-base-100 shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">NotesApp</Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link to="/create" className="btn btn-sm btn-primary">Create Note</Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">Logout</button>
          </>
        ) : (
          <>
        <Link to="/login" className="btn btn-sm btn-primary py-2 px-4">
          Login
        </Link>
        <Link to="/signup" className="btn btn-sm btn-secondary py-2 px-4">
          Sign Up
        </Link>
      </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
