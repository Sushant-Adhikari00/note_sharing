import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { AuthContext } from "../context/authContext.jsx";
import { ArrowLeftIcon } from "lucide-react";

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
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/"); 
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    toast("Returning to homepage!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-200 relative">
      {/* Top-left Back Button */}
      <button 
        onClick={goHome} 
        className="btn btn-ghost absolute top-4 left-4 flex items-center gap-2"
      >
        <ArrowLeftIcon className="size-5" /> Back to Home
      </button>

      <div className="flex items-center justify-center min-h-screen">
        <div className="card w-full max-w-md p-6 bg-base-100 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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

            <div className="form-control mb-2">
              <label className="label">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Forgot Password Link */}
            <p className="text-right mb-4">
              <Link to="/forgot-password" className="text-primary font-medium hover:underline">
                Forgot Password?
              </Link>
            </p>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
