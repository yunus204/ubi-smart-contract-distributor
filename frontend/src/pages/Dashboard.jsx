import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get the authenticated user's latest information
      const userResponse = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok || !userData.success) {
        throw new Error(userData.message || "Failed to load user data");
      }

      setUser(userData.user);

      // Keep localStorage synchronized with the backend
      localStorage.setItem("user", JSON.stringify(userData.user));

      // Get user's transactions
      const transactionResponse = await fetch(
        `${API_URL}/users/transactions/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const transactionData = await transactionResponse.json();

      if (transactionResponse.ok && transactionData.success) {
        setTransactions(transactionData.transactions || []);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            <span className="logo-icon">U</span>
            <span>UBI Distributor</span>
          </div>
        </nav>

        <main className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <span className="dashboard-label">USER DASHBOARD</span>
              <h1>Loading...</h1>
              <p>Loading your account information.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            <span className="logo-icon">U</span>
            <span>UBI Distributor</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        <main className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <span className="dashboard-label">USER DASHBOARD</span>
              <h1>Unable to load dashboard</h1>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isEligible = Boolean(user?.eligible);

  const hasReceived =
    Boolean(user?.hasReceived) ||
    transactions.some(
      (transaction) =>
        transaction?.status === "completed" ||
        transaction?.status === "success" ||
        transaction?.status === "confirmed"
    );

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          <span className="logo-icon">U</span>
          <span>UBI Distributor</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <span className="dashboard-label">USER DASHBOARD</span>

            <h1>Welcome, {user?.name || "User"}</h1>

            <p>
              Manage your account and track your Universal Basic Income
              distribution.
            </p>
          </div>

          <div className="verified-badge">
            ● Account Active
          </div>
        </div>

        {/* Error-free account information */}
        <div className="dashboard-grid">
          {/* UBI Amount */}
          <div className="dashboard-card">
            <span className="card-label">UBI AMOUNT</span>

            <h2>0.01 ETH</h2>

            <p>Predefined distribution amount</p>
          </div>

          {/* Eligibility */}
          <div className="dashboard-card">
            <span className="card-label">ELIGIBILITY</span>

            <h2 className={isEligible ? "eligible" : ""}>
              {isEligible ? "Eligible" : "Not Eligible"}
            </h2>

            <p>
              {isEligible
                ? "Your account is approved for UBI."
                : "Your account is not currently eligible for UBI."}
            </p>
          </div>

          {/* Distribution */}
          <div className="dashboard-card">
            <span className="card-label">DISTRIBUTION</span>

            <h2>{hasReceived ? "Received" : "Pending"}</h2>

            <p>
              {hasReceived
                ? "Your UBI distribution has been recorded."
                : "Your next distribution status."}
            </p>
          </div>

          {/* Network */}
          <div className="dashboard-card">
            <span className="card-label">NETWORK</span>

            <h2>Ethereum</h2>

            <p>Blockchain network</p>
          </div>
        </div>

        {/* Wallet */}
        <section className="wallet-section">
          <div>
            <span className="card-label">CONNECTED WALLET</span>

            <h3>Your Ethereum Wallet</h3>
          </div>
        </section>

        <div className="wallet-address">
          {user?.walletAddress || "Wallet not connected"}
        </div>

        {/* Account Information */}
        <section className="info-section">
          <h2>Account Information</h2>

          <div className="dashboard-steps">
            <div>
              <span>01</span>

              <h3>Full Name</h3>

              <p>{user?.name || "Not available"}</p>
            </div>

            <div>
              <span>02</span>

              <h3>Email Address</h3>

              <p>{user?.email || "Not available"}</p>
            </div>

            <div>
              <span>03</span>

              <h3>Transactions</h3>

              <p>
                {transactions.length} transaction
                {transactions.length === 1 ? "" : "s"} recorded
              </p>
            </div>
          </div>
        </section>

        {/* How UBI Works */}
        <section className="info-section">
          <h2>How UBI Distribution Works</h2>

          <div className="dashboard-steps">
            <div>
              <span>01</span>

              <h3>Registration</h3>

              <p>
                Your account information is submitted for verification.
              </p>
            </div>

            <div>
              <span>02</span>

              <h3>Verification</h3>

              <p>
                An administrator reviews and verifies your information.
              </p>
            </div>

            <div>
              <span>03</span>

              <h3>Distribution</h3>

              <p>
                Eligible users receive UBI through the smart contract.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;