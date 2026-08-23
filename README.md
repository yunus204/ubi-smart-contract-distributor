# 💰 UBI Smart Contract Distributor

A full-stack **Universal Basic Income (UBI) distribution platform** that combines a modern React frontend, Node.js/Express backend, MongoDB database, and Ethereum smart contract.

The platform allows administrators to verify users, manage blockchain eligibility, fund the UBI smart contract, and distribute UBI payments securely. Users can track their verification status, eligibility, wallet information, payment status, and blockchain transaction history.

> **Project Status:** Functional Prototype  
> The complete end-to-end UBI distribution flow has been implemented and tested on a local Ethereum/Hardhat network.

---

# ✨ Features

## 👤 User Features

- User registration
- Secure login
- JWT authentication
- Wallet address association
- Verification status tracking
- Blockchain eligibility tracking
- UBI payment status tracking
- Personal transaction history
- UBI distribution status
- Transaction hash tracking

## 👨‍💼 Admin Features

- Dedicated admin dashboard
- View registered users
- View platform statistics
- Approve users
- Reject users
- Re-approve users
- Synchronize blockchain eligibility
- Monitor smart contract balance
- Fund the UBI smart contract
- Distribute UBI to eligible users
- Track blockchain transaction hashes

## ⛓️ Blockchain Features

- Ethereum smart contract integration
- Solidity smart contract
- Hardhat local blockchain
- ethers.js blockchain communication
- Smart contract funding
- UBI distribution
- Wallet eligibility checking
- Duplicate payment protection
- Contract balance monitoring
- Blockchain transaction tracking

## 🔐 Security Features

- JWT authentication
- Role-based access control
- Admin authorization
- Protected API routes
- Session-based authentication
- Duplicate payment prevention
- Eligibility validation
- Environment variable configuration
- Private key protection

---

# 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, React DOM, React Router, Vite, Axios, ethers.js, JavaScript / JSX, CSS |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Axios, dotenv, CORS, ethers.js |
| **Blockchain** | Ethereum, Solidity, Hardhat, ethers.js, Hardhat Local Network |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **Development Tools** | Git, GitHub, Visual Studio Code, npm |
| **Wallet** | MetaMask-compatible wallet |
| **API Communication** | REST API, Axios |
| **Blockchain RPC** | Hardhat Local RPC |

---

# 🧰 Development Tools Required

Before running the project, install:

- **Node.js**
- **npm**
- **MongoDB**
- **Git**
- **Visual Studio Code**
- **MetaMask**
- **Hardhat**
- **Modern Web Browser**

Check installations:

```bash
node --version
npm --version
git --version
```

---

# 🏗️ System Architecture

```text
                         ┌───────────────────┐
                         │    USER / ADMIN   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  React Frontend   │
                         │                   │
                         │ Login / Register  │
                         │ User Dashboard    │
                         │ Admin Dashboard   │
                         └─────────┬─────────┘
                                   │
                              REST API
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Node.js + Express │
                         │                   │
                         │ JWT Authentication│
                         │ User Management   │
                         │ Admin Operations  │
                         └───────┬─────┬─────┘
                                 │     │
                    ┌────────────┘     └─────────────┐
                    ▼                                ▼
             ┌──────────────┐               ┌──────────────────┐
             │   MongoDB    │               │ Ethereum/Hardhat │
             │              │               │                  │
             │ Users        │               │ UBI Smart        │
             │ Transactions │               │ Contract         │
             │ Verification │               │ Eligibility      │
             └──────────────┘               │ Payments         │
                                            └────────┬─────────┘
                                                     │
                                                     ▼
                                               User Wallet
```

---

# 🔄 Complete End-to-End Workflow

```text
                    USER REGISTRATION
                           │
                           ▼
                      USER LOGIN
                           │
                           ▼
                  ADMIN VERIFICATION
                           │
                 ┌─────────┴─────────┐
                 │                   │
              REJECT              APPROVE
                 │                   │
                 ▼                   ▼
                STOP        BLOCKCHAIN ELIGIBILITY
                                     │
                                     ▼
                           FUND SMART CONTRACT
                                     │
                                     ▼
                            UBI DISTRIBUTION
                                     │
                                     ▼
                            SMART CONTRACT
                                     │
                                     ▼
                              USER WALLET
                                     │
                                     ▼
                            TRANSACTION HASH
                                     │
                                     ▼
                              MONGODB RECORD
                                     │
                                     ▼
                         USER TRANSACTION HISTORY
```

---

# 📂 Project Structure

```text
ubi-smart-contract-distributor/
│
├── blockchain/
│   ├── contracts/
│   │   └── UBIDistributor.sol
│   │
│   ├── scripts/
│   │   └── deploy.js
│   │
│   ├── test/
│   │
│   ├── hardhat.config.js
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Transaction.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── admin.routes.js
│   │   │
│   │   ├── services/
│   │   │   └── blockchain.service.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 📦 Installation

## 1. Clone Repository

```bash
git clone https://github.com/yunus204/ubi-smart-contract-distributor.git
```

Go inside the project:

```bash
cd ubi-smart-contract-distributor
```

---

# ⛓️ 2. Install Blockchain Dependencies

```bash
cd blockchain
npm install
```

---

# 🖥️ 3. Install Backend Dependencies

Open a new terminal:

```bash
cd ubi-smart-contract-distributor/backend
npm install
```

---

# 💻 4. Install Frontend Dependencies

Open another terminal:

```bash
cd ubi-smart-contract-distributor/frontend
npm install
```

---

# ⛓️ Blockchain Setup

## Start Hardhat Local Blockchain

Open **Terminal 1**:

```bash
cd blockchain
npm run node
```

Hardhat will start a local Ethereum network.

RPC URL:

```text
http://127.0.0.1:8545
```

Keep this terminal running.

---

# 📜 Compile Smart Contract

Open **Terminal 2**:

```bash
cd blockchain
npm run compile
```

Equivalent command:

```bash
npx hardhat compile
```

---

# 🚀 Deploy Smart Contract

```bash
npm run deploy:local
```

Equivalent:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

After deployment, copy the deployed contract address.

Example:

```text
UBI_CONTRACT_ADDRESS=0x...
```

---

# 🔑 Backend Environment Configuration

Create:

```text
backend/.env
```

Add:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/ubi_distributor

JWT_SECRET=<your-long-random-secret>

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=<your-admin-password>

RPC_URL=http://127.0.0.1:8545

UBI_CONTRACT_ADDRESS=<deployed-contract-address>

ADMIN_PRIVATE_KEY=<hardhat-account-private-key>

UBI_AMOUNT_ETH=0.01
```

> [!WARNING]
> Never commit `.env` to GitHub.
>
> Never expose your `ADMIN_PRIVATE_KEY`, `JWT_SECRET`, admin password, or production credentials.

---

# 🗄️ MongoDB Setup

Make sure MongoDB is running locally.

The project uses:

```text
mongodb://127.0.0.1:27017/ubi_distributor
```

Database:

```text
ubi_distributor
```

Main collections:

```text
users
transactions
```

---

# ▶️ Running the Complete Application

The application requires **three terminals**.

---

## Terminal 1: Blockchain

```bash
cd blockchain
npm run node
```

Runs:

```text
http://127.0.0.1:8545
```

---

## Terminal 2: Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Terminal 3: Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

---

# 👤 User Flow

```text
Register
   ↓
Login
   ↓
User Dashboard
   ↓
View Verification Status
   ↓
View Blockchain Eligibility
   ↓
View UBI Amount
   ↓
Receive UBI
   ↓
View Transaction History
```

---

# 👨‍💼 Admin Flow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
View Registered Users
     ↓
Verify User
     ↓
Check Blockchain Eligibility
     ↓
Fund Smart Contract
     ↓
Distribute UBI
     ↓
Transaction Confirmed
     ↓
View Transaction Hash
```

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user/admin |

---

## User APIs

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/users/me` | Get authenticated user |
| `GET` | `/api/users/transactions/me` | Get user transaction history |
| `POST` | `/api/users/claim` | Claim UBI |

---

## Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/admin/users` | Get registered users |
| `GET` | `/api/admin/stats` | Get platform statistics |
| `PATCH` | `/api/admin/users/:id/verify` | Verify/reject user |
| `POST` | `/api/admin/contract/deposit` | Deposit funds |
| `POST` | `/api/admin/distribute/:id` | Distribute UBI |

---

# 🔐 Authentication

The application uses JWT authentication.

After login:

```text
JWT Token
    │
    ▼
sessionStorage
    │
    ▼
Authorization Header
```

API requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

The frontend stores authentication information using:

```javascript
sessionStorage.setItem("token", token);
sessionStorage.setItem("user", JSON.stringify(user));
```

---

# 🛡️ Role-Based Access Control

The system supports two roles:

```text
USER
ADMIN
```

Admin-only APIs require:

```text
role = admin
```

If a normal user tries to access an admin endpoint:

```text
403 Forbidden
```

Example:

```json
{
  "success": false,
  "message": "Admin access required"
}
```

---

# 💰 UBI Distribution Logic

Before distributing UBI, the backend verifies:

```text
1. User exists
       ↓
2. User is approved
       ↓
3. User is blockchain eligible
       ↓
4. User has not already received UBI
       ↓
5. Smart contract has sufficient funds
       ↓
6. UBI is distributed
       ↓
7. Transaction saved in MongoDB
```

---

# ⛓️ Smart Contract Logic

The smart contract manages:

```text
UBI Amount
      │
      ├── User Eligibility
      │
      ├── Payment Status
      │
      ├── Contract Balance
      │
      ├── Contract Owner
      │
      └── Duplicate Payment Protection
```

Blockchain interaction is performed using:

```text
ethers.js
```

---

# 💾 Database Models

## User

```text
User
├── name
├── email
├── passwordHash
├── walletAddress
├── role
├── verificationStatus
├── eligible
├── totalReceived
├── createdAt
└── updatedAt
```

## Transaction

```text
Transaction
├── user
├── walletAddress
├── amountEth
├── txHash
├── type
├── status
├── createdAt
└── updatedAt
```

---

# 🔗 Web2 + Web3 Integration

```text
                 REACT
                   │
                   │ Axios
                   ▼
             EXPRESS API
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
       MongoDB          ethers.js
                            │
                            ▼
                    Smart Contract
                            │
                            ▼
                       Ethereum
                            │
                            ▼
                       User Wallet
```

MongoDB handles application-level records.

The Ethereum smart contract handles decentralized payment logic.

---

# 🧪 Testing

## Smart Contract Tests

```bash
cd blockchain
npm test
```

Equivalent:

```bash
npx hardhat test
```

---

# 🏗️ Frontend Production Build

```bash
cd frontend
npm run build
```

---

# 👀 Frontend Preview

```bash
npm run preview
```

---

# 🖥️ Backend Development

```bash
cd backend
npm run dev
```

---

# 🚀 Backend Production

```bash
cd backend
npm start
```

---

# 🧪 Tested Scenarios

| Scenario | Result |
|---|---|
| User Registration | ✅ Passed |
| User Login | ✅ Passed |
| Admin Login | ✅ Passed |
| User Dashboard | ✅ Passed |
| Admin Dashboard | ✅ Passed |
| User accessing Admin API | ❌ 403 Blocked |
| User funding contract | ❌ 403 Blocked |
| Admin funding contract | ✅ Passed |
| Admin approving user | ✅ Passed |
| Blockchain eligibility sync | ✅ Passed |
| UBI distribution | ✅ Passed |
| Duplicate UBI distribution | ❌ Rejected |
| Ineligible distribution | ❌ Rejected |
| Transaction saved in MongoDB | ✅ Passed |
| Transaction history | ✅ Passed |
| Contract balance tracking | ✅ Passed |
| Blockchain transaction hash | ✅ Passed |

---

# 📊 Example Transaction

```text
             ADMIN
               │
               │ Deposit ETH
               ▼
      ┌──────────────────┐
      │  UBI SMART       │
      │  CONTRACT        │
      │                  │
      │ UBI = 0.01 ETH   │
      └────────┬─────────┘
               │
               │ Distribution
               ▼
        ELIGIBLE USER
               │
               ▼
            0.01 ETH
               │
               ▼
       TRANSACTION HASH
               │
               ▼
           MONGODB
               │
               ▼
      TRANSACTION HISTORY
```

---

# 🔒 Security Architecture

```text
                    Request
                       │
                       ▼
                JWT Authentication
                       │
                 ┌─────┴─────┐
                 │           │
               Valid       Invalid
                 │           │
                 ▼           ▼
             Continue       401
                 │
                 ▼
             Role Check
                 │
           ┌─────┴─────┐
           │           │
         Admin        User
           │           │
           ▼           ▼
      Admin APIs    User APIs
```

Security mechanisms:

- JWT authentication
- Role-based authorization
- Protected routes
- Session isolation
- Password hashing
- Environment variables
- Duplicate transaction checks
- Blockchain eligibility checks
- Smart contract payment protection

---

# 📸 Screenshots

Create a folder:

```text
screenshots/
```

Recommended screenshots:

```text
screenshots/
├── login.png
├── user-dashboard.png
├── admin-dashboard.png
├── verification.png
├── contract-funding.png
├── distribution.png
└── transaction-history.png
```

Add them to README using:

```markdown
## 📸 Screenshots

### Login

![Login](<img width="1915" height="1079" alt="login"/>
)

### User Dashboard

![User Dashboard](<img width="1919" height="1079" alt="dashboard"/>
)

### Admin Dashboard

![Admin Dashboard](<img width="1919" height="1079" />
)

### Transaction History

![Transaction History](<img width="1919" height="1079" alt="Thistory"  />
)
```

---

# 🧰 Useful Git Commands

Check project status:

```bash
git status
```

Check changes:

```bash
git diff
```

Check staged changes:

```bash
git diff --cached
```

Check whether `.env` is tracked:

```bash
git ls-files .env
```

Check formatting issues:

```bash
git diff --check
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update UBI platform"
```

Push:

```bash
git push origin main
```

Check branches:

```bash
git branch
```

Check commit history:

```bash
git log --oneline
```

---

# 🔐 Git Security

Make sure `.gitignore` contains:

```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
coverage/
```

Verify `.env` is not tracked:

```bash
git ls-files .env
```

If nothing is returned, `.env` is not tracked.

---

# 📋 Example Environment File

For documentation, create:

```text
backend/.env.example
```

with:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/ubi_distributor

JWT_SECRET=your_secret_here

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your_password_here

RPC_URL=http://127.0.0.1:8545

UBI_CONTRACT_ADDRESS=your_contract_address

ADMIN_PRIVATE_KEY=your_private_key

UBI_AMOUNT_ETH=0.01
```

> Never put the real private key or real password inside `.env.example`.

---

# 🔮 Future Improvements

- Public Ethereum-compatible testnet deployment
- MetaMask wallet connection
- Automated eligibility verification
- Multi-signature administration
- Smart contract event monitoring
- Blockchain transaction indexing
- Production MongoDB deployment
- Gas optimization
- Automated CI/CD
- Comprehensive automated testing
- Blockchain explorer integration
- Smart contract security audit
- Production-grade key management
- Automated UBI distribution
- Advanced admin analytics

---

# 📌 Current Project Status

### Functional Prototype

The following complete flow has been implemented:

```text
┌─────────────────────┐
│ User Registration   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Authentication      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Admin Verification  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Blockchain Eligibility│
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Contract Funding    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ UBI Distribution    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ User Wallet         │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Transaction Hash    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ MongoDB Record      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Transaction History │
└─────────────────────┘
```

---

# 👨‍💻 Author

**Yunus Mulla**

GitHub:

https://github.com/yunus204

Repository:

https://github.com/yunus204/ubi-smart-contract-distributor

---

# 📄 License

This project is developed for academic, educational, and demonstration purposes.

---

# ⚠️ Important

This project currently uses a **local Hardhat Ethereum network** and is intended as a functional prototype.

Do not use:

- Development private keys
- Default admin credentials
- Local test accounts
- Development JWT secrets
- Development MongoDB credentials

in a production deployment.

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
