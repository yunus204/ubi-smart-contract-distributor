import { useEffect, useState } from "react";
import api from "../services/api";
import { getBlockchainUserData } from "../services/contract";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    distributions: 0,
    contractBalanceEth: "0",
  });

  const [blockchainUsers, setBlockchainUsers] = useState({});

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [depositAmount, setDepositAmount] = useState("0.05");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const adminUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, statsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats"),
      ]);

      let loadedUsers = [];

      if (usersResponse.data.success) {
        loadedUsers = usersResponse.data.users;
        setUsers(loadedUsers);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      /* ================= BLOCKCHAIN STATUS ================= */

      const blockchainData = {};

      await Promise.all(
        loadedUsers.map(async (user) => {
          try {
            if (!user.walletAddress) return;

            const data = await getBlockchainUserData(
              user.walletAddress
            );

            blockchainData[user._id] = data;
          } catch (err) {
            console.error(
              `Blockchain lookup failed for ${user.name}:`,
              err
            );
          }
        })
      );

      setBlockchainUsers(blockchainData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= VERIFICATION ================= */

  const handleVerification = async (userId, status) => {
    try {
      setActionLoading(`verify-${userId}`);
      setError("");
      setMessage("");

      const response = await api.patch(
        `/admin/users/${userId}/verify`,
        { status }
      );

      if (response.data.success) {
        if (
          status === "approved" &&
          response.data.blockchainTx?.txHash
        ) {
          setMessage(
            `User approved successfully. Blockchain transaction: ${response.data.blockchainTx.txHash}`
          );
        } else {
          setMessage(
            `User ${status} successfully.`
          );
        }

        await loadData();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${status} user.`
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ================= DEPOSIT ================= */

  const handleDeposit = async () => {
    try {
      setActionLoading("deposit");
      setError("");
      setMessage("");

      if (!depositAmount || Number(depositAmount) <= 0) {
        setError("Enter a valid ETH amount.");
        return;
      }

      const response = await api.post(
        "/admin/contract/deposit",
        {
          amountEth: depositAmount,
        }
      );

      if (response.data.success) {
        setMessage(
          `Successfully deposited ${depositAmount} ETH into the smart contract.`
        );

        if (response.data.txHash) {
          setMessage(
            `Deposit successful. Transaction: ${response.data.txHash}`
          );
        }

        setDepositAmount("");
        await loadData();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to deposit funds."
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ================= DISTRIBUTE UBI ================= */

  const handleDistribution = async (userId) => {
    try {
      setActionLoading(`distribute-${userId}`);
      setError("");
      setMessage("");

      const blockchainData = blockchainUsers[userId];

      if (blockchainData?.hasReceived) {
        setError(
          "This user has already received their UBI."
        );
        return;
      }

      if (!blockchainData?.eligible) {
        setError(
          "This wallet is not eligible on the smart contract."
        );
        return;
      }

      const response = await api.post(
        `/admin/distribute/${userId}`
      );

      if (response.data.success) {
        setMessage(
          `UBI of ${response.data.amountEth} ETH distributed successfully.`
        );

        await loadData();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to distribute UBI."
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <h2>Loading Admin Dashboard</h2>
            <p>
              Fetching users and blockchain information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="admin-page">

      {/* ================= NAVBAR ================= */}

      <nav className="admin-navbar">

        <div className="admin-logo">
          <span className="admin-logo-icon">
            U
          </span>

          <span>UBI Distributor</span>
        </div>

        <div className="admin-navbar-right">

          <div className="admin-profile">
            <span className="admin-profile-dot"></span>

            <div>
              <strong>
                {adminUser.name || "Admin"}
              </strong>

              <small>
                Administrator
              </small>
            </div>
          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="admin-container">

        {/* HEADER */}

        <div className="admin-header">

          <div>
            <span className="admin-label">
              ADMINISTRATION
            </span>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage users, verify eligibility and distribute
              Universal Basic Income.
            </p>
          </div>

          <div className="admin-status">
            <span>●</span>
            System Active
          </div>

        </div>

        {/* ================= ALERTS ================= */}

        {error && (
          <div className="admin-alert error">
            <strong>⚠ Error</strong>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="admin-alert success">
            <strong>✓ Success</strong>
            <span>{message}</span>
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              TOTAL USERS
            </span>

            <strong>
              {stats.totalUsers}
            </strong>

            <p>
              Registered accounts
            </p>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              PENDING
            </span>

            <strong className="stat-pending">
              {stats.pendingUsers}
            </strong>

            <p>
              Awaiting verification
            </p>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              APPROVED
            </span>

            <strong className="stat-approved">
              {stats.approvedUsers}
            </strong>

            <p>
              Eligible users
            </p>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">
              DISTRIBUTIONS
            </span>

            <strong>
              {stats.distributions}
            </strong>

            <p>
              Completed payments
            </p>
          </div>

          <div className="admin-stat-card balance-card">

            <span className="admin-stat-label">
              CONTRACT BALANCE
            </span>

            <strong>
              {stats.contractBalanceEth} ETH
            </strong>

            <p>
              Available for distribution
            </p>

          </div>

        </section>

        {/* ================= FUND CONTRACT ================= */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <span className="admin-section-label">
                SMART CONTRACT
              </span>

              <h2>
                Fund UBI Contract
              </h2>

              <p>
                Deposit ETH into the smart contract so
                eligible users can receive their UBI.
              </p>
            </div>

            <div className="contract-balance-badge">
              {stats.contractBalanceEth} ETH available
            </div>

          </div>

          <div className="deposit-panel">

            <div className="deposit-input-wrapper">

              <label>
                Deposit Amount
              </label>

              <div className="eth-input">

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.05"
                  value={depositAmount}
                  onChange={(e) =>
                    setDepositAmount(e.target.value)
                  }
                />

                <span>ETH</span>

              </div>

            </div>

            <button
              className="deposit-btn"
              disabled={actionLoading === "deposit"}
              onClick={handleDeposit}
            >
              {actionLoading === "deposit"
                ? "Depositing..."
                : "Deposit Funds"}
            </button>

          </div>

        </section>

        {/* ================= USERS ================= */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <span className="admin-section-label">
                USER MANAGEMENT
              </span>

              <h2>
                Registered Users
              </h2>

              <p>
                Review verification status and manage UBI
                distribution.
              </p>
            </div>

            <div className="user-count">
              {users.length} users
            </div>

          </div>

          {users.length === 0 ? (

            <div className="admin-empty">
              <div className="empty-user-icon">
                👤
              </div>

              <h3>
                No users found
              </h3>

              <p>
                No registered users are available yet.
              </p>
            </div>

          ) : (

            <div className="admin-users-list">

              {users.map((user) => {

                const blockchain =
                  blockchainUsers[user._id];

                const isReceived =
                  blockchain?.hasReceived === true;

                const isEligible =
                  blockchain?.eligible === true;

                const isApproved =
                  user.verificationStatus === "approved";

                const isProcessing =
                  actionLoading === user._id ||
                  actionLoading ===
                    `verify-${user._id}` ||
                  actionLoading ===
                    `distribute-${user._id}`;

                return (
                  <div
                    className="admin-user-card"
                    key={user._id}
                  >

                    {/* USER DETAILS */}

                    <div className="admin-user-main">

                      <div className="user-avatar">
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div className="admin-user-info">

                        <h3>
                          {user.name}
                        </h3>

                        <p>
                          {user.email}
                        </p>

                        <div className="user-wallet">

                          <span>
                            Wallet
                          </span>

                          <code>
                            {user.walletAddress}
                          </code>

                        </div>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="admin-user-status">

                      <span className="status-label">
                        VERIFICATION
                      </span>

                      <span
                        className={`verification-badge ${
                          user.verificationStatus
                        }`}
                      >
                        {user.verificationStatus ===
                          "approved" && "✓ "}

                        {user.verificationStatus ===
                          "rejected" && "✕ "}

                        {user.verificationStatus
                          ?.charAt(0)
                          ?.toUpperCase() +
                          user.verificationStatus?.slice(
                            1
                          )}
                      </span>

                      <span className="status-label blockchain-status-label">
                        BLOCKCHAIN
                      </span>

                      {blockchain ? (
                        <span
                          className={
                            isEligible
                              ? "onchain-eligible"
                              : "onchain-not-eligible"
                          }
                        >
                          {isEligible
                            ? "✓ Eligible"
                            : "✕ Not Eligible"}
                        </span>
                      ) : (
                        <span className="checking-status">
                          Checking...
                        </span>
                      )}

                    </div>

                    {/* DISTRIBUTION STATUS */}

                    <div className="admin-distribution-status">

                      <span className="status-label">
                        DISTRIBUTION
                      </span>

                      {isReceived ? (

                        <div className="received-badge">
                          ✓ Received
                          <small>
                            UBI already distributed
                          </small>
                        </div>

                      ) : isApproved && isEligible ? (

                        <div className="ready-badge">
                          Ready
                        </div>

                      ) : (

                        <div className="not-ready-badge">
                          Not Ready
                        </div>

                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="admin-user-actions">

                      {/* PENDING */}

                      {user.verificationStatus ===
                        "pending" && (
                        <>

                          <button
                            className="approve-btn"
                            disabled={isProcessing}
                            onClick={() =>
                              handleVerification(
                                user._id,
                                "approved"
                              )
                            }
                          >
                            {actionLoading ===
                            `verify-${user._id}`
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            className="reject-btn"
                            disabled={isProcessing}
                            onClick={() =>
                              handleVerification(
                                user._id,
                                "rejected"
                              )
                            }
                          >
                            Reject
                          </button>

                        </>
                      )}

                      {/* REJECTED */}

                      {user.verificationStatus ===
                        "rejected" && (
                        <button
                          className="approve-btn"
                          disabled={isProcessing}
                          onClick={() =>
                            handleVerification(
                              user._id,
                              "approved"
                            )
                          }
                        >
                          {actionLoading ===
                          `verify-${user._id}`
                            ? "Processing..."
                            : "Approve"}
                        </button>
                      )}

                      {/* DISTRIBUTE */}

                      {isApproved &&
                        isEligible &&
                        !isReceived && (
                          <button
                            className="distribute-btn"
                            disabled={
                              isProcessing ||
                              !blockchain
                            }
                            onClick={() =>
                              handleDistribution(
                                user._id
                              )
                            }
                          >
                            {actionLoading ===
                            `distribute-${user._id}`
                              ? "Distributing..."
                              : "Distribute 0.01 ETH"}
                          </button>
                        )}

                      {/* ALREADY RECEIVED */}

                      {isReceived && (
                        <span className="already-received">
                          ✓ Payment Completed
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* ================= SYSTEM INFORMATION ================= */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <span className="admin-section-label">
                BLOCKCHAIN
              </span>

              <h2>
                System Information
              </h2>
            </div>

          </div>

          <div className="system-info-grid">

            <div className="system-info-card">

              <span>
                NETWORK
              </span>

              <strong>
                Hardhat Local
              </strong>

              <p>
                Chain ID 31337
              </p>

            </div>

            <div className="system-info-card">

              <span>
                UBI AMOUNT
              </span>

              <strong>
                0.01 ETH
              </strong>

              <p>
                Predefined distribution amount
              </p>

            </div>

            <div className="system-info-card">

              <span>
                CONTRACT OWNER
              </span>

              <strong>
                Admin Account
              </strong>

              <p>
                Authorized to manage eligibility
                and distributions
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;