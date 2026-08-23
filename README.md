💰 UBI Smart Contract Distributor
A full-stack Universal Basic Income (UBI) distribution platform that combines a modern React frontend, a Node.js/Express backend, MongoDB, and an Ethereum smart contract.
The platform allows administrators to verify users, manage blockchain eligibility, fund the UBI smart contract, and distribute UBI payments securely. Users can track their verification status, eligibility, wallet information, payment status, and blockchain transaction history.
> **Project Status:** Functional Prototype
>
> The complete end-to-end UBI distribution flow has been implemented and tested on a local Ethereum/Hardhat network.
---
✨ Features
👤 User Features
User registration and secure login
JWT-based authentication
Wallet address association
Verification status tracking
Blockchain eligibility tracking
UBI payment status tracking
Personal transaction history
👨‍💼 Admin Features
Dedicated admin dashboard
View all registered users
Approve, reject, and re-approve users
Synchronize blockchain eligibility
View platform statistics
Monitor smart contract balance
Fund the UBI smart contract
Distribute UBI to eligible users
Track blockchain transaction hashes
⛓️ Blockchain & Security Features
Ethereum smart contract integration
Hardhat local blockchain support
ethers.js blockchain communication
Duplicate payment protection
Role-based access control
MongoDB transaction records
Environment-based configuration
---
🛠️ Tech Stack
Layer	Technologies
Frontend	React 19, React DOM, React Router, Vite, Axios, ethers.js, JavaScript/JSX, CSS
Backend	Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Axios, dotenv, ethers.js, CORS
Blockchain	Ethereum, Solidity, Hardhat, ethers.js, Hardhat Local Network
Development Tools	Git, GitHub, Visual Studio Code, npm, MongoDB, MetaMask-compatible wallet
---
📦 Installation
Prerequisites
Make sure the following are installed:
Node.js
npm
MongoDB
Git
Visual Studio Code
MetaMask or another compatible Ethereum wallet
1. Clone the Repository
```bash
git clone https://github.com/yunus204/ubi-smart-contract-distributor.git
cd ubi-smart-contract-distributor
```
2. Install Blockchain Dependencies
```bash
cd blockchain
npm install
```
3. Install Backend Dependencies
Open another terminal:
```bash
cd ubi-smart-contract-distributor/backend
npm install
```
4. Install Frontend Dependencies
Open another terminal:
```bash
cd ubi-smart-contract-distributor/frontend
npm install
```
5. Configure the Blockchain
Start the local Hardhat network from the `blockchain` directory:
```bash
cd blockchain
npm run node
```
The local blockchain runs at:
```text
http://127.0.0.1:8545
```
Keep this terminal running.
In another terminal, compile the smart contract:
```bash
cd blockchain
npx hardhat compile
```
Deploy the smart contract:
```bash
npm run deploy:local
```
After deployment, copy the generated smart contract address for the backend configuration.
6. Configure Backend Environment Variables
Create the following file:
```text
backend/.env
```
Add:
```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/ubi_distributor

JWT_SECRET=<your-random-secret>

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=<your-admin-password>

RPC_URL=http://127.0.0.1:8545

UBI_CONTRACT_ADDRESS=<deployed-contract-address>

ADMIN_PRIVATE_KEY=<hardhat-account-private-key>

UBI_AMOUNT_ETH=0.01
```
> [!WARNING]
> Never commit real private keys, passwords, JWT secrets, or production credentials to GitHub.
---
▶️ Usage
The application requires the blockchain node, backend server, and frontend development server to run together.
Terminal 1 — Blockchain
```bash
cd blockchain
npm run node
```
Terminal 2 — Backend
```bash
cd backend
npm run dev
```
Backend URL:
```text
http://localhost:5000
```
Terminal 3 — Frontend
```bash
cd frontend
npm run dev
```
Frontend URL:
```text
http://localhost:5173
```
🔄 UBI Distribution Workflow
```text
User Registration
       │
       ▼
User Login
       │
       ▼
Admin Verification
       │
   ┌───┴────┐
   │        │
Reject    Approve
   │        │
   ▼        ▼
 STOP   Blockchain Eligibility
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
    User Transaction History
```
🏗️ System Architecture
```text
                         User / Admin
                              │
                              ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ • User Dashboard    │
                    │ • Admin Dashboard   │
                    │ • Login / Register  │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │                     │
                    │ • JWT Authentication│
                    │ • User Management   │
                    │ • Admin Operations  │
                    └────────┬───────┬────┘
                             │       │
                 ┌───────────┘       └─────────────┐
                 ▼                                 ▼
        ┌──────────────────┐            ┌────────────────────┐
        │     MongoDB      │            │ Ethereum / Hardhat │
        │                  │            │                    │
        │ • Users          │            │ • UBI Contract     │
        │ • Transactions   │            │ • Eligibility      │
        │ • Verification   │            │ • Payments         │
        └──────────────────┘            └──────────┬─────────┘
                                                  │
                                                  ▼
                                              User Wallet
```
🌐 API Endpoints
User Endpoints
Method	Endpoint	Purpose
`GET`	`/api/users/me`	Get the authenticated user's profile
`GET`	`/api/users/transactions/me`	Get the authenticated user's transaction history
`POST`	`/api/users/claim`	Submit a UBI claim request
Admin Endpoints
Method	Endpoint	Purpose
`GET`	`/api/admin/users`	Get registered users
`GET`	`/api/admin/stats`	Get platform statistics
`PATCH`	`/api/admin/users/:id/verify`	Update user verification status
`POST`	`/api/admin/contract/deposit`	Fund the UBI smart contract
`POST`	`/api/admin/distribute/:id`	Distribute UBI to a user
🔐 Security
The platform uses multiple security layers to protect application and blockchain operations.
JWT Authentication: Protected API requests require a valid JWT token.
Role-Based Authorization: Administrative endpoints require the authenticated user to have the `admin` role.
Session Isolation: Authentication information is stored using `sessionStorage`, allowing separate user and admin sessions in different browser tabs.
Duplicate Payment Protection: The backend checks MongoDB transaction history and the smart contract tracks whether a wallet has already received UBI.
Eligibility Validation: Payments are processed only for approved, blockchain-eligible users who have not already received UBI.
🧪 Testing
Run smart contract tests:
```bash
cd blockchain
npm test
```
Create a frontend production build:
```bash
cd frontend
npm run build
```
Run the backend in development mode:
```bash
cd backend
npm run dev
```
Run the backend in production mode:
```bash
cd backend
npm start
```
Tested Scenarios
Scenario	Result
User Registration	✅ Passed
User Login	✅ Passed
Admin Login	✅ Passed
User Dashboard	✅ Passed
Admin Dashboard	✅ Passed
User accessing Admin API	❌ 403 — Blocked
User funding contract	❌ 403 — Blocked
Admin funding contract	✅ Passed
Admin approving user	✅ Passed
Blockchain eligibility sync	✅ Passed
UBI distribution	✅ Passed
Duplicate UBI distribution	❌ Rejected
Ineligible user distribution	❌ Rejected
Transaction saved in MongoDB	✅ Passed
Transaction history	✅ Passed
Contract balance tracking	✅ Passed
---
📂 Project Structure
```text
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
```
Core Components
User Management
Users can register, log in securely, associate a wallet address, and view their verification status, blockchain eligibility, payment status, and transaction history.
Admin Management
Administrators can manage registered users, approve or reject users, synchronize blockchain eligibility, monitor and fund the smart contract, distribute UBI, and review blockchain transaction hashes.
Smart Contract
The smart contract manages:
UBI amount
User eligibility
Payment status
Contract balance
Contract ownership
Duplicate payment prevention
Blockchain communication is handled using ethers.js.
Database Models
MongoDB stores application-level user and transaction data.
```text
User
├── name
├── email
├── passwordHash
├── walletAddress
├── role
├── verificationStatus
├── eligible
└── totalReceived
```
```text
Transaction
├── user
├── walletAddress
├── amountEth
├── txHash
├── type
├── status
└── createdAt
```
---
📸 Screenshots
Add screenshots of the application here to demonstrate the main user and admin workflows.
Suggested screenshots:
Login / Registration page
User dashboard
Admin dashboard
User verification screen
Smart contract funding screen
UBI distribution result
Transaction history
Example Markdown:
```markdown
![User Dashboard](screenshots/user-dashboard.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
```
> Create a `screenshots/` folder in the repository and update the image paths above after adding your screenshots.
---
🔮 Future Improvements
Potential future enhancements include:
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
---
👥 Contributors / Author
This README does not currently contain confirmed contributor or author names.
Add project contributors in the following format:
```text
Name — Role / Contribution
GitHub: https://github.com/username
```
Repository referenced in the installation instructions:
```text
https://github.com/yunus204/ubi-smart-contract-distributor
```
---
📄 License
No license was specified in the provided project documentation.
If you plan to distribute or open-source this project publicly, add a `LICENSE` file and update this section with the selected license.
---
⚠️ Important Note
This project currently uses a local Hardhat Ethereum network and is intended as a functional prototype and development project.
Do not use development private keys, default admin credentials, or local test configuration in a production deployment.
---
If you find this project useful, consider giving the repository a ⭐ on GitHub.
