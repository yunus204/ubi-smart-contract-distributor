import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
function Home() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => scrollToSection("home")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-icon">U</span>
          <span>UBI Distributor</span>
        </div>

        <div className="nav-links">
          <button
            className="nav-link-btn"
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>

          <button
            className="nav-link-btn"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <button
            className="nav-link-btn"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </button>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="badge">🔗 Blockchain Powered</div>

            <h1>
              Universal Basic Income
              <span> Made Transparent</span>
            </h1>

            <p>
              A secure and automated blockchain-based platform designed to
              distribute Universal Basic Income to eligible users
              transparently and efficiently.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn" onClick={handleRegister}>
                Register Now
              </button>

              <button
                className="secondary-btn"
                onClick={() => scrollToSection("how-it-works")}
              >
                Learn More
              </button>
            </div>

            {/* TRUST INFORMATION */}
            <div className="trust-info">
              <div>
                <strong>100%</strong>
                <span>Transparent</span>
              </div>

              <div>
                <strong>Secure</strong>
                <span>Blockchain</span>
              </div>

              <div>
                <strong>Automated</strong>
                <span>Distribution</span>
              </div>
            </div>
          </div>

          {/* ================= HERO CARD ================= */}
          <div className="hero-card">
            <div className="card-header">
              <span>UBI Distribution</span>

              <span className="status">
                <span className="status-dot">●</span> Active
              </span>
            </div>

            <div className="amount">0.01 ETH</div>

            <p>Predefined UBI Amount</p>

            <div className="card-row">
              <span>Network</span>
              <strong>Ethereum</strong>
            </div>

            <div className="card-row">
              <span>Status</span>
              <strong className="success">Verified</strong>
            </div>

            <div className="card-row">
              <span>Distribution</span>
              <strong>Automated</strong>
            </div>

            <div className="blockchain-line">
              ✓ Secured by Smart Contract
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="features" id="about">
          <div className="section-heading">
            <span>WHY UBI DISTRIBUTOR</span>

            <h2>Simple. Secure. Transparent.</h2>

            <p>
              Blockchain technology enables a reliable and verifiable way to
              distribute financial assistance.
            </p>
          </div>

          <div className="feature-grid">
            {/* SECURE */}
            <div className="feature-card">
              <div className="feature-icon">🔐</div>

              <h3>Secure</h3>

              <p>
                Smart contracts provide secure and tamper-resistant fund
                distribution.
              </p>
            </div>

            {/* TRANSPARENT */}
            <div className="feature-card">
              <div className="feature-icon">⛓️</div>

              <h3>Transparent</h3>

              <p>
                Every transaction is recorded on the blockchain and can be
                independently verified.
              </p>
            </div>

            {/* AUTOMATED */}
            <div className="feature-card">
              <div className="feature-icon">⚡</div>

              <h3>Automated</h3>

              <p>
                Eligible users receive predefined UBI payments without manual
                transfers.
              </p>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="how-it-works" id="how-it-works">
          <div className="section-heading">
            <span>HOW IT WORKS</span>

            <h2>From Registration to Distribution</h2>
          </div>

          <div className="steps">
            {/* STEP 1 */}
            <div className="step">
              <div className="step-number">01</div>

              <h3>Register</h3>

              <p>
                Create an account and connect your blockchain wallet.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="step">
              <div className="step-number">02</div>

              <h3>Verification</h3>

              <p>
                An administrator reviews and verifies your submitted
                information.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="step">
              <div className="step-number">03</div>

              <h3>Eligibility</h3>

              <p>
                Approved users become eligible for UBI distribution.
              </p>
            </div>

            {/* STEP 4 */}
            <div className="step">
              <div className="step-number">04</div>

              <h3>Receive UBI</h3>

              <p>
                The smart contract automatically distributes the predefined
                amount.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="logo">
          <span className="logo-icon">U</span>
          <span>UBI Distributor</span>
        </div>

        <p>
          Secure and transparent income distribution powered by blockchain
          technology.
        </p>

        <span className="copyright">
          © 2026 UBI Smart Contract Distributor
        </span>
      </footer>
    </div>
  );
}
function ProtectedRoute({ children, allowedRole }) {
  const token = sessionStorage.getItem("token");
  const storedUser = sessionStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
/* ================= APP ROUTER ================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* USER REGISTRATION */}
        <Route path="/register" element={<Register />} />

        {/* USER LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;