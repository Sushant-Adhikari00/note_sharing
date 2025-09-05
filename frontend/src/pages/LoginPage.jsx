import { useState, useContext } from "react";
import { useNavigate,Link } from "react-router";
import api from "../lib/axios";
import { AuthContext } from "../context/authContext.jsx";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) return toast.error("All fields are required");

  setLoading(true);
  try {
    const res = await api.post("/auth/login", { email, password });
    const loggedInUser = { ...res.data.user, token: res.data.token };
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    toast.success("Login successful!");
    navigate("/"); // redirect to homepage
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
   <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md p-6 bg-base-100 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-control mb-4">
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Email address"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
