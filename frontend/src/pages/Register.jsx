import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { connectWallet, getConnectedWallet } from "../services/wallet";
import { useEffect } from "react";
function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
  });
  useEffect(() => {
  const loadWallet = async () => {
    const wallet = await getConnectedWallet();

    if (wallet) {
      setFormData((prev) => ({
        ...prev,
        walletAddress: wallet,
      }));
    }
  };

  loadWallet();

  if (window.ethereum) {
    const handleAccountsChanged = (accounts) => {
      const newWallet = accounts[0] || "";

      setFormData((prev) => ({
        ...prev,
        walletAddress: newWallet,
      }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }
}, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleConnectWallet = async () => {
  try {
    const wallet = await connectWallet();

    setFormData((prev) => ({
      ...prev,
      walletAddress: wallet,
    }));
  } catch (err) {
    setError(err.message);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      setError("Please enter a valid Ethereum wallet address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", formData);

      if (response.data.success) {
        setSuccess(
          "Registration submitted successfully. Please wait for admin verification."
        );

        setFormData({
          name: "",
          email: "",
          password: "",
          walletAddress: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="logo-icon">U</div>
          <span>UBI Distributor</span>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <h1>Create your account</h1>
            <p>
              Register to become eligible for Universal Basic Income
              distribution.
            </p>
          </div>

          {error && (
            <div className="alert error-alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert success-alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
  <label>Ethereum Wallet</label>

  <div className="wallet-box">
    <input
      type="text"
      name="walletAddress"
      value={formData.walletAddress}
      readOnly
      placeholder="Connect MetaMask"
    />

    <button
      type="button"
      className="wallet-btn"
      onClick={handleConnectWallet}
    >
      {formData.walletAddress
        ? "Connected"
        : "Connect MetaMask"}
    </button>
  </div>

  <small>
    Your UBI payment will be sent to this wallet after approval.
  </small>
</div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>
        </div>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Register;