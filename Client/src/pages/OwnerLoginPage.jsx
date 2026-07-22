import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import toast from "react-hot-toast";

function OwnerLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = () => {
    fetch("https://pg-manager-backend-mryl.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: form.username,
        password: form.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          login();
          toast.success("Welcome back, Owner!");
          navigate("/dashboard");
        } else {
          toast.error(data.error || "Invalid owner credentials");
          setError(data.error || "Invalid owner credentials");
        }
      })
      .catch((err) => {
        console.error("Login failed:", err);
        toast.error("Login failed - server error");
        setError("Login failed - server error");
      });
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--bg-tertiary)" }}
    >
      <div
        className="hidden md:flex w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <h1
          className="text-2xl font-bold tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
          style={{ color: "var(--accent)" }}
        >
          Social Co-Living PG
        </h1>
        <div>
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            OWNER PORTAL
          </p>
          <h2
            className="text-4xl font-bold leading-tight mb-4"
            style={{ color: "var(--text-light)" }}
          >
            Manage your PG <br /> with ease.
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Track tenants, rooms, rent — all in one place.
          </p>
        </div>
        <p className="text-xs" style={{ color: "var(--bg-secondary)" }}>
          © 2026 Social Co-Living PG
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-8 py-12">
        <div className="md:hidden mb-8 text-center">
          <h1
            className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
            style={{ color: "var(--text-primary)" }}
          >
            Social Co-Living PG
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Owner Portal
          </p>
        </div>

        <div
          className="w-full max-w-md rounded-2xl p-6 md:p-10 shadow-sm"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <span
            className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--accent)",
            }}
          >
            OWNER ACCESS
          </span>

          <h2
            className="text-2xl font-bold mb-1 mt-3"
            style={{ color: "var(--text-primary)" }}
          >
            Owner Login
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to manage your PG
          </p>

          <div className="mb-5">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin"
              className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="mb-3">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {error && (
            <p
              className="text-sm mb-4 font-medium"
              style={{ color: "#dc2626" }}
            >
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg font-bold text-lg hover:opacity-90 transition mt-5"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--accent)",
              border: "2px solid var(--border-color)",
            }}
          >
            Sign In as Owner
          </button>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Not an owner?{" "}
            <span
              className="font-semibold cursor-pointer hover:opacity-80"
              style={{ color: "var(--text-primary)" }}
              onClick={() => navigate("/")}
            >
              Back to home
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OwnerLoginPage;
