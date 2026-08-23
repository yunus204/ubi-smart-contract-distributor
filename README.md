# 💰 UBI Smart Contract Distributor

A blockchain-based Universal Basic Income (UBI) distribution platform that combines a React frontend, Node.js/Express backend, MongoDB, and an Ethereum smart contract.

The system allows administrators to verify users, manage blockchain eligibility, fund the UBI smart contract, and distribute UBI payments to eligible users. Users can view their eligibility, payment status, wallet information, and blockchain transaction history.

---

# 🚀 Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Separate User & Admin Dashboards
- ✅ User Verification System
- ✅ Blockchain Eligibility Management
- ✅ Smart Contract Funding
- ✅ Automated UBI Distribution
- ✅ Duplicate Payment Protection
- ✅ MongoDB Transaction Records
- ✅ Blockchain Transaction Hash Tracking
- ✅ Contract Balance Monitoring
- ✅ User Transaction History
- ✅ Admin Statistics Dashboard
- ✅ Ethereum / Hardhat Local Blockchain
- ✅ ethers.js Blockchain Integration
- ✅ Secure Environment Variable Configuration

---

# 🏗️ System Architecture

```text
                         User / Admin
                              │
                              ▼
                    ┌───────────────────┐
                    │   React Frontend  │
                    │                   │
                    │ User Dashboard    │
                    │ Admin Dashboard   │
                    │ Login / Register  │
                    └─────────┬─────────┘
                              │
                              │ REST API
                              ▼
                    ┌───────────────────┐
                    │ Node.js + Express │
                    │                   │
                    │ JWT Authentication│
                    │ User Management   │
                    │ Admin Operations  │
                    └──────┬──────┬─────┘
                           │      │
                 ┌─────────┘      └──────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌──────────────────┐
        │     MongoDB     │        │ Ethereum /       │
        │                 │        │ Hardhat Network  │
        │ Users           │        │                  │
        │ Transactions    │        │ UBI Smart        │
        │ Verification   │        │ Contract         │
        └─────────────────┘        └────────┬─────────┘
                                            │
                                            ▼
                                      User Wallet

🔄 UBI Distribution Workflow

                     User Registration
                            │
                            ▼
                       User Login
                            │
                            ▼
                    Admin Verification
                            │
                     ┌──────┴──────┐
                     │             │
                  Reject          Approve
                     │             │
                     ▼             ▼
                    STOP    Blockchain Eligibility
                                   │
                                   ▼
                           Fund Smart Contract
                                   │
                                   ▼
                            Distribute UBI
                                   │
                                   ▼
                         Smart Contract
                                   │
                                   ▼
                           User Wallet
                                   │
                                   ▼
                       Transaction Hash
                                   │
                                   ▼
                         MongoDB Record
                                   │
                                   ▼
                        User Transaction
                             History


🛠️ Technologies Used
Frontend
React 19
React DOM
React Router
Vite
Axios
ethers.js
JavaScript / JSX
CSS
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
Axios
dotenv
ethers.js
CORS
Blockchain
Ethereum
Solidity
Hardhat
ethers.js
Hardhat Local Network
Development Tools
Git
GitHub
Visual Studio Code
npm
MongoDB
MetaMask-compatible wallet
📂 Project Structure
ubi-smart-contract-distributor/
│
├── blockchain/
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
│
├── .gitignore
└── README.md
🧠 Core Components
👤 User Management

Users can:

Register an account
Login securely
Associate a wallet address
View verification status
View blockchain eligibility
View UBI payment status
View transaction history
👨‍💼 Admin Management

Administrators can:

View all registered users
View platform statistics
Approve users
Reject users
Re-approve users
Synchronize blockchain eligibility
View smart contract balance
Fund the smart contract
Distribute UBI
View blockchain transaction hashes
⛓️ Smart Contract

The smart contract manages:

UBI amount
User eligibility
Payment status
Contract balance
Contract ownership
Duplicate payment prevention

Blockchain interaction is handled using ethers.js.

🔐 Security

The application implements multiple security layers.

JWT Authentication

Protected API requests require a valid JWT token.

Authorization: Bearer <JWT_TOKEN>
Role-Based Authorization

Administrator endpoints require the authenticated user to have the admin role.

Unauthorized users receive:

403 Forbidden
Session Isolation

Authentication information is stored using:

sessionStorage

This allows separate User and Admin sessions in different browser tabs.

Duplicate Payment Protection

The backend checks MongoDB transaction history before processing a payment.

The smart contract also tracks whether a wallet has already received UBI.

Eligibility Protection

UBI distribution requires the user to:

Exist in the database
Be approved
Be eligible
Not have already received UBI
💾 Database

MongoDB is used for application-level data storage.

User Data
User
├── name
├── email
├── passwordHash
├── walletAddress
├── role
├── verificationStatus
├── eligible
└── totalReceived
Transaction Data
Transaction
├── user
├── walletAddress
├── amountEth
├── txHash
├── type
├── status
└── createdAt
🌐 API Endpoints
User
GET  /api/users/me
GET  /api/users/transactions/me
POST /api/users/claim
Admin
GET   /api/admin/users
GET   /api/admin/stats
PATCH /api/admin/users/:id/verify
POST  /api/admin/contract/deposit
POST  /api/admin/distribute/:id
📦 Installation
Requirements

Make sure the following are installed:

Node.js
npm
MongoDB
Git
MetaMask or compatible wallet
Visual Studio Code
1. Clone Repository
git clone https://github.com/yunus204/ubi-smart-contract-distributor.git

cd ubi-smart-contract-distributor
2. Install Blockchain Dependencies
cd blockchain

npm install
3. Install Backend Dependencies

Open another terminal:

cd ubi-smart-contract-distributor/backend

npm install
4. Install Frontend Dependencies

Open another terminal:

cd ubi-smart-contract-distributor/frontend

npm install
⛓️ Blockchain Setup
Start Hardhat Network

Open Terminal 1:

cd blockchain

npm run node

The local blockchain runs at:

http://127.0.0.1:8545

Keep this terminal running.

📜 Compile Smart Contract

Open another terminal:

cd blockchain

npm run compile
🚀 Deploy Smart Contract
npm run deploy:local

The deployment process provides the deployed contract address.

🔑 Backend Environment Variables

Create:

backend/.env

Use:

PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/ubi_distributor

JWT_SECRET=<your-random-secret>

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=<your-admin-password>

RPC_URL=http://127.0.0.1:8545

UBI_CONTRACT_ADDRESS=<deployed-contract-address>

ADMIN_PRIVATE_KEY=<hardhat-account-private-key>

UBI_AMOUNT_ETH=0.01
⚠️ Important

Never commit your actual .env file.

Never expose:

ADMIN_PRIVATE_KEY
JWT_SECRET
ADMIN_PASSWORD
MONGO_URI
▶️ Run Backend
cd backend

npm run dev

Backend:

http://localhost:5000
💻 Run Frontend

Open another terminal:

cd frontend

npm run dev

Frontend:

http://localhost:5173
🧪 Testing
Smart Contract Tests
cd blockchain

npm test
Frontend Build
cd frontend

npm run build
Backend

Development:

cd backend

npm run dev

Production:

npm start
🧪 Tested Scenarios
Scenario	Result
User Registration	✅
User Login	✅
Admin Login	✅
User Dashboard	✅
Admin Dashboard	✅
User accessing Admin API	❌ 403
User funding contract	❌ 403
Admin funding contract	✅
Admin approving user	✅
Blockchain eligibility sync	✅
UBI distribution	✅
Duplicate UBI distribution	❌ Rejected
Ineligible user distribution	❌ Rejected
Transaction saved in MongoDB	✅
Transaction history	✅
Contract balance tracking	✅
📊 Example UBI Transaction
Admin
 │
 │ Deposit
 ▼
┌─────────────────────────┐
│    UBI Smart Contract   │
│                         │
│ UBI Amount: 0.01 ETH    │
│ Contract Balance: ETH   │
└────────────┬────────────┘
             │
             │ Distribution
             ▼
      Eligible User Wallet
             │
             ▼
          0.01 ETH
             │
             ▼
       Transaction Hash
             │
             ▼
          MongoDB
🔗 Web2 + Web3 Integration

The project demonstrates the integration of conventional web technologies with blockchain.

React
  │
  │ Axios
  ▼
Express API
  │
  ├──────────────► MongoDB
  │
  │ ethers.js
  ▼
Ethereum Smart Contract
  │
  ▼
User Wallet

MongoDB handles application records while the blockchain handles the actual decentralized payment logic.

📈 Current Capabilities

The current prototype supports:

User registration
Secure login
JWT authentication
Admin authentication
Role-based authorization
User verification
Blockchain eligibility
Smart contract funding
UBI distribution
Duplicate payment prevention
MongoDB transaction storage
Transaction history
Admin dashboard
User dashboard
Blockchain transaction tracking
🔮 Future Improvements
Public Ethereum-compatible testnet deployment
MetaMask wallet integration
Automated eligibility verification
Multi-signature administration
Smart contract event monitoring
Blockchain transaction indexing
Production MongoDB deployment
Gas optimization
Automated CI/CD
Comprehensive automated testing
Blockchain explorer integration
Smart contract security audit
Production-grade key management
📌 Project Status

Functional Prototype

The complete User → Admin → Blockchain → Transaction flow has been implemented and tested on a local Ethereum/Hardhat network.

Registration
     ↓
Authentication
     ↓
Admin Verification
     ↓
Blockchain Eligibility
     ↓
Contract Funding
     ↓
UBI Distribution
     ↓
Transaction Recording
     ↓
User Transaction History
