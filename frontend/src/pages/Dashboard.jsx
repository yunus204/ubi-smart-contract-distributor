import { useEffect, useState } from "react";
import "./Dashboard.css";
import { getBlockchainUserData } from "../services/contract";

const API_URL = "http://localhost:5000/api";
const HARDHAT_CHAIN_ID = "0x7a69";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [blockchainData, setBlockchainData] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState("");
  const [networkName, setNetworkName] = useState("");

  const [loading, setLoading] = useState(true);
  const [blockchainLoading, setBlockchainLoading] = useState(true);

  const [error, setError] = useState("");
  const [blockchainError, setBlockchainError] = useState("");

  /*
   * ============================================================
   * FETCH USER + TRANSACTIONS FROM BACKEND
   * ============================================================
   */

  const fetchDashboardData = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get authenticated user
      const userResponse = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok || !userData.success) {
        throw new Error(
          userData.message || "Failed to load user information."
        );
      }

      setUser(userData.user);

      // Keep localStorage synchronized with backend
      localStorage.setItem("user", JSON.stringify(userData.user));

      // Get user's transaction history
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
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.message || "Unable to load your dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * FETCH BLOCKCHAIN DATA
   * ============================================================
   */

  const fetchBlockchainData = async (walletAddress) => {
    if (!walletAddress) {
      setBlockchainLoading(false);
      return;
    }

    try {
      setBlockchainLoading(true);
      setBlockchainError("");

      if (!window.ethereum) {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to view blockchain information."
        );
      }

      // Get currently connected MetaMask account
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (!accounts || accounts.length === 0) {
        setConnectedWallet("");
        throw new Error(
          "No MetaMask wallet is connected. Please connect your wallet."
        );
      }

      const currentWallet = accounts[0];

      setConnectedWallet(currentWallet);

      // Check current network
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (chainId !== HARDHAT_CHAIN_ID) {
        setNetworkName("");

        throw new Error(
          "Please switch MetaMask to Hardhat Local before using the dashboard."
        );
      }

      setNetworkName("Hardhat Local");

      /*
       * IMPORTANT:
       *
       * Blockchain data is read for the user's REGISTERED wallet,
       * not necessarily the currently selected MetaMask account.
       */

      const walletMatches =
        currentWallet.toLowerCase() === walletAddress.toLowerCase();

      if (!walletMatches) {
        setBlockchainError(
          `Different MetaMask account detected. Your registered UBI wallet is ${formatWallet(
            walletAddress
          )}. Blockchain status below is shown for your registered wallet.`
        );
      }

      // Read actual smart contract state
      const data = await getBlockchainUserData(walletAddress);

      setBlockchainData(data);
    } catch (err) {
      console.error("Blockchain error:", err);

      setBlockchainData(null);

      setBlockchainError(
        err.message || "Unable to read blockchain information."
      );
    } finally {
      setBlockchainLoading(false);
    }
  };

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /*
   * ============================================================
   * LOAD BLOCKCHAIN DATA AFTER USER IS AVAILABLE
   * ============================================================
   */

  useEffect(() => {
    if (user?.walletAddress) {
      fetchBlockchainData(user.walletAddress);
    }
  }, [user]);

  /*
   * ============================================================
   * METAMASK ACCOUNT / NETWORK CHANGE LISTENERS
   * ============================================================
   */

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        setConnectedWallet("");
        setBlockchainData(null);
        setNetworkName("");
        setBlockchainError(
          "MetaMask wallet disconnected. Please connect your wallet."
        );

        return;
      }

      const newWallet = accounts[0];

      setConnectedWallet(newWallet);

      if (user?.walletAddress) {
        fetchBlockchainData(user.walletAddress);
      }
    };

    const handleChainChanged = () => {
      if (user?.walletAddress) {
        fetchBlockchainData(user.walletAddress);
      }
    };

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    window.ethereum.on(
      "chainChanged",
      handleChainChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );

      window.ethereum.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };
  }, [user]);

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  /*
   * ============================================================
   * FORMAT WALLET ADDRESS
   * ============================================================
   */

  const formatWallet = (wallet) => {
    if (!wallet) {
      return "Not available";
    }

    if (wallet.length <= 16) {
      return wallet;
    }

    return `${wallet.slice(0, 8)}...${wallet.slice(-6)}`;
  };

  /*
   * ============================================================
   * FORMAT TRANSACTION HASH
   * ============================================================
   */

  const formatTxHash = (hash) => {
    if (!hash) {
      return "Unavailable";
    }

    return `${hash.slice(0, 12)}...${hash.slice(-8)}`;
  };

  /*
   * ============================================================
   * FORMAT DATE
   * ============================================================
   */

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * ============================================================
   * TRANSACTION STATUS
   * ============================================================
   */

  const getTransactionStatus = (status) => {
    if (status === "confirmed") {
      return "Confirmed";
    }

    if (status === "failed") {
      return "Failed";
    }

    return "Unknown";
  };

  /*
   * ============================================================
   * LOADING SCREEN
   * ============================================================
   */

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
              <span className="dashboard-label">
                USER DASHBOARD
              </span>

              <h1>Loading...</h1>

              <p>
                Loading your account information.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ============================================================
   * BACKEND ERROR SCREEN
   * ============================================================
   */

  if (error) {
    return (
      <div className="dashboard-page">
        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            <span className="logo-icon">U</span>
            <span>UBI Distributor</span>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>

        <main className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <span className="dashboard-label">
                USER DASHBOARD
              </span>

              <h1>
                Unable to load dashboard
              </h1>

              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ============================================================
   * LIVE BLOCKCHAIN VALUES
   * ============================================================
   */

  const isBlockchainEligible =
    Boolean(blockchainData?.eligible);

  const hasReceivedOnBlockchain =
    Boolean(blockchainData?.hasReceived);

  const totalReceived =
    user?.totalReceived || "0";

  const registeredWallet =
    user?.walletAddress || "";

  const walletMatches =
    connectedWallet &&
    registeredWallet &&
    connectedWallet.toLowerCase() ===
      registeredWallet.toLowerCase();

  /*
   * ============================================================
   * USER DASHBOARD
   * ============================================================
   */

  return (
    <div className="dashboard-page">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          <span className="logo-icon">U</span>
          <span>UBI Distributor</span>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      <main className="dashboard-container">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">
              USER DASHBOARD
            </span>

            <h1>
              Welcome, {user?.name || "User"}
            </h1>

            <p>
              Manage your account and track your Universal
              Basic Income distribution.
            </p>

          </div>

          <div className="verified-badge">
            ● Account Active
          </div>

        </div>

        {/* ====================================================
            BLOCKCHAIN NOTICE
        ==================================================== */}

        {blockchainError && (
          <div className="blockchain-alert">

            <strong>
              Wallet notice
            </strong>

            <span>
              {blockchainError}
            </span>

          </div>
        )}

        {/* ====================================================
            DASHBOARD SUMMARY CARDS
        ==================================================== */}

        <div className="dashboard-grid">

          {/* UBI AMOUNT */}

          <div className="dashboard-card">

            <span className="card-label">
              UBI AMOUNT
            </span>

            <h2>
              {blockchainLoading
                ? "..."
                : blockchainData?.ubiAmount
                ? `${blockchainData.ubiAmount} ETH`
                : "Unavailable"}
            </h2>

            <p>
              Current smart contract distribution amount
            </p>

          </div>

          {/* ELIGIBILITY */}

          <div className="dashboard-card">

            <span className="card-label">
              ELIGIBILITY
            </span>

            <h2
              className={
                isBlockchainEligible
                  ? "eligible"
                  : "not-eligible"
              }
            >

              {blockchainLoading
                ? "Checking..."
                : isBlockchainEligible
                ? "Eligible"
                : "Not Eligible"}

            </h2>

            <p>

              {blockchainLoading
                ? "Checking blockchain status."
                : isBlockchainEligible
                ? "Your registered wallet is approved on-chain."
                : "Your registered wallet is not currently eligible."}

            </p>

          </div>

          {/* DISTRIBUTION */}

          <div className="dashboard-card">

            <span className="card-label">
              DISTRIBUTION
            </span>

            <h2
              className={
                hasReceivedOnBlockchain
                  ? "received"
                  : "pending"
              }
            >

              {blockchainLoading
                ? "Checking..."
                : hasReceivedOnBlockchain
                ? "Received"
                : "Pending"}

            </h2>

            <p>

              {blockchainLoading
                ? "Checking blockchain status."
                : hasReceivedOnBlockchain
                ? "Your UBI payment has been received."
                : isBlockchainEligible
                ? "You are eligible and awaiting distribution."
                : "Your wallet is not yet eligible for distribution."}

            </p>

          </div>

          {/* NETWORK */}

          <div className="dashboard-card">

            <span className="card-label">
              NETWORK
            </span>

            <h2>
              {networkName || "Unavailable"}
            </h2>

            <p>
              Chain ID 31337
            </p>

          </div>

        </div>

        {/* ====================================================
            WALLET
        ==================================================== */}

        <section className="wallet-section">

          <div>

            <span className="card-label">
              REGISTERED WALLET
            </span>

            <h3>
              Your Ethereum Wallet
            </h3>

            <p className="wallet-status">
              {walletMatches
                ? "✓ MetaMask connected to registered wallet"
                : connectedWallet
                ? "⚠ Different MetaMask account selected"
                : "MetaMask wallet not connected"}
            </p>

          </div>

          <div className="wallet-address">
            {registeredWallet
              ? formatWallet(registeredWallet)
              : "Wallet not available"}
          </div>

        </section>

        {/* ====================================================
            BLOCKCHAIN STATUS
        ==================================================== */}

        <section className="info-section">

          <h2>
            Blockchain Status
          </h2>

          <div className="dashboard-steps blockchain-details">

            {/* ELIGIBILITY */}

            <div>

              <span>
                01
              </span>

              <h3>
                Eligibility
              </h3>

              <p>

                {blockchainLoading
                  ? "Checking..."
                  : isBlockchainEligible
                  ? "Eligible on the smart contract."
                  : "Not eligible on the smart contract."}

              </p>

            </div>

            {/* DISTRIBUTION */}

            <div>

              <span>
                02
              </span>

              <h3>
                Distribution
              </h3>

              <p>

                {blockchainLoading
                  ? "Checking..."
                  : hasReceivedOnBlockchain
                  ? `${blockchainData.ubiAmount} ETH received.`
                  : "No UBI received yet."}

              </p>

            </div>

            {/* CONTRACT BALANCE */}

            <div>

              <span>
                03
              </span>

              <h3>
                Contract Balance
              </h3>

              <p>

                {blockchainLoading
                  ? "Checking..."
                  : blockchainData
                  ? `${blockchainData.contractBalance} ETH available.`
                  : "Unavailable."}

              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            ACCOUNT INFORMATION
        ==================================================== */}

        <section className="info-section">

          <h2>
            Account Information
          </h2>

          <div className="dashboard-steps">

            <div>

              <span>
                01
              </span>

              <h3>
                Full Name
              </h3>

              <p>
                {user?.name || "Not available"}
              </p>

            </div>

            <div>

              <span>
                02
              </span>

              <h3>
                Email Address
              </h3>

              <p>
                {user?.email || "Not available"}
              </p>

            </div>

            <div>

              <span>
                03
              </span>

              <h3>
                Total Received
              </h3>

              <p>
                {totalReceived} ETH
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            TRANSACTION HISTORY
        ==================================================== */}

        <section className="info-section">

          <div className="section-title-row">

            <div>

              <span className="dashboard-label">
                TRANSACTIONS
              </span>

              <h2>
                Transaction History
              </h2>

            </div>

            <span className="transaction-count">

              {transactions.length} transaction
              {transactions.length === 1
                ? ""
                : "s"}

            </span>

          </div>

          {transactions.length === 0 ? (

            <div className="empty-transactions">

              <div className="empty-icon">
                ↔
              </div>

              <h3>
                No transactions yet
              </h3>

              <p>
                Your UBI distribution transactions
                will appear here.
              </p>

            </div>

          ) : (

            <div className="transaction-list">

              {transactions.map((transaction) => (

                <div
                  className="transaction-card"
                  key={transaction._id}
                >

                  {/* TRANSACTION MAIN */}

                  <div className="transaction-main">

                    <div className="transaction-icon">
                      ✓
                    </div>

                    <div>

                      <h3>
                        UBI Distribution
                      </h3>

                      <p>
                        {formatDate(
                          transaction.createdAt
                        )}
                      </p>

                    </div>

                  </div>

                  {/* AMOUNT */}

                  <div className="transaction-amount">

                    <strong>
                      +{transaction.amountEth} ETH
                    </strong>

                    <span className="transaction-status">

                      {getTransactionStatus(
                        transaction.status
                      )}

                    </span>

                  </div>

                  {/* HASH */}

                  <div className="transaction-hash">

                    <span>
                      Transaction Hash
                    </span>

                    <code>
                      {formatTxHash(
                        transaction.txHash
                      )}
                    </code>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ====================================================
            HOW UBI WORKS
        ==================================================== */}

        <section className="info-section">

          <h2>
            How UBI Distribution Works
          </h2>

          <div className="dashboard-steps">

            <div>

              <span>
                01
              </span>

              <h3>
                Registration
              </h3>

              <p>
                Your account information is submitted
                for verification.
              </p>

            </div>

            <div>

              <span>
                02
              </span>

              <h3>
                Verification
              </h3>

              <p>
                An administrator reviews and verifies
                your information.
              </p>

            </div>

            <div>

              <span>
                03
              </span>

              <h3>
                Distribution
              </h3>

              <p>
                Eligible wallets receive UBI through
                the smart contract.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;