import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router"; 
import api from "../lib/axios";
import { AuthContext } from "../context/authContext.jsx";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { name, email, password });

      // Save user and token
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);

      toast.success("Account created successfully!");
      navigate("/"); // redirect home
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md p-6 bg-base-100 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-control mb-4">
            <label className="label">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
