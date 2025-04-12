# 🌍 Clairo

Clairo is a lightweight, privacy-conscious legal tech platform that enables users to capture, timestamp, and map verifiable photo and video evidence of incidents in real time. Designed for moments of legal urgency — from protests to police encounters — Clairo empowers individuals to document truth securely and transparently.

## ⚠️ IMPORTANT: Security Considerations

Before deploying or pushing this code:

1. **Environment Variables**: Copy `.env.example` to `.env` and add your actual values
2. **NEVER commit** `.env` files containing real contract addresses or API keys
3. **GitIgnore**: Ensure `.env` is in your `.gitignore` file
4. **No Secrets in Code**: Don't hardcode sensitive information in JavaScript files

See [ENV_SETUP.md](ENV_SETUP.md) for detailed instructions on properly configuring environment variables.

---

## ✨ Why "Clairo"?

The name **Clairo** comes from *"Clarity + Proof"*, inspired by the Latin *"clārus"* — *clear, bright, evident*.  
Clairo symbolizes truth shining through noise — verified visual evidence that is accessible, transparent, and trustworthy.

---

## 🧠 Core Concept

Clairo connects **media**, **metadata**, and **location** into one secure ecosystem.

- 📸 Users take photos/videos DIRECTLY FROM CAMERA (no gallery uploads)
- 📍 Clairo records time & GPS location
- 🔐 Media is hashed and verified via blockchain (Solidity smart contracts)
- 🗺️ Public evidence is mapped and searchable
- 👥 Anonymous uploads supported, wallet connection optional

---

## 🔐 Authentication Model

Clairo uses a wallet-based authentication system:

- 🔑 Users connect with MetaMask (no usernames/passwords)
- 👤 Wallet address serves as user identifier
- 🌐 Session persists while wallet remains connected
- 🕵️ Anonymous uploads possible without wallet connection
- 📱 No traditional JWT/cookie-based sessions needed

---

## 🧱 Project Breakdown

### 🔐 Blockchain Layer (Solidity + Remix + Ethers.js)

Handles authenticity verification and user authentication.

- ✅ Write smart contracts in **Solidity**
- ✅ Deploy on testnet using **Remix**
- ✅ Connect MetaMask for authentication
- ✅ Use wallet signatures as identity proof
- ✅ Store hash of media + metadata as immutable proof
- ✅ Support both authenticated and anonymous proofs
- ✅ Add a `verified` flag to content based on on-chain match
- ✅ Public endpoint to verify content authenticity

**Tech:**  
- Solidity (smart contracts)  
- Remix IDE (write & deploy)  
- Ethers.js (connect frontend/backend to blockchain)

---

### ⚙️ Backend (Golang + PostgreSQL)

Handles API logic, metadata processing, blockchain integration.

- ✅ Anonymous media submissions (wallet or no auth)
- ✅ Store media metadata (timestamp, GPS, camera info) in PostgreSQL
- ✅ Index metadata (time and location) using pgVector/weaviate for nearest-search queries
- ✅ Locally hash images + metadata
- ✅ Send hash to smart contract via **ethers.js**
- ✅ Save media to local storage or S3-compatible bucket (e.g. DigitalOcean Spaces)
- ✅ Filterable metadata API (location, time, tags)
- ✅ Serve public gallery + map pins

**Tech:**  
- Golang for REST API  
- PostgreSQL (Docker/local instance)  
- Ethers.js wrapper inside Golang  
- S3-compatible object storage or local disk

---

### 🖼️ Frontend (Next.js)

User interface for media capture, uploads, and evidence exploration.

| Module               | Description |
|----------------------|-------------|
| 📍 **Map & Pins**      | Clustered map view of public incidents |
| 📸 **Capture Tool**     | Take/upload photos/videos w/ metadata |
| 🧾 **Metadata Auto**    | Capture GPS, timestamp, device info |
| 🔍 **Location Search**  | Search pins by coordinates or name |
| ⏰ **Time Filtering**   | Filter evidence by date/time |
| 🖼️ **Gallery View**     | Media grouped by location or event |
| 👤 **Anon Upload UX**   | Upload anonymously or with wallet |
| ✅ **Verified Badge**   | Visual indicator of on-chain proof |

**Tech:**  
- Next.js (TypeScript)  
- Mapbox / Leaflet  
- TailwindCSS & ShadCN UI  
- Ethers.js for reading verification data from blockchain  

---

## 🧪 Development Milestones (Grouped for Parallel Work)

### 🔹 Group A – Frontend-Focused (Next.js, UI, UX)

| Task | Description |
|------|-------------|
| 📸 Capture Tool | Interface to capture photo/video + metadata |
| 🧾 Metadata Auto-Capture | Use browser APIs to get GPS + timestamp |
| 🖼️ Gallery View | Media view w/ filters by location + time |
| 🗺️ Map View | Clustered map using Mapbox or Leaflet |
| ✅ Verified Badge UI | Show proof status using on-chain verification |
| 🔍 Search UX | Coordinate + time search input |
| 👤 Anon Upload UX | Basic upload flow without registration |
| 🧪 Browser Hashing | Hash media + metadata before sending to API |

---

### 🔹 Group B – Backend-Focused (Golang, PostgreSQL, Storage)

| Task | Description |
|------|-------------|
| ⚙️ REST API | Go API for media metadata + blockchain logic |
| 🐘 PostgreSQL Setup | Local or Dockerized DB for media entries |
| 💾 Media Storage | Store files locally or via S3-compatible storage |
| 🔐 Hash to Blockchain | Use Ethers.js to send hash from backend |
| ✅ Verify Endpoint | Public API to check hash match status |
| 🧠 Metadata Filtering | Location + time filter support in API |
| 🗺️ Pin Metadata Endpoint | API endpoint for frontend map pins |
| 🧪 Testing | Validate endpoints using Postman or Curl |

---

### 🔹 Group C – Blockchain Setup (Shared)

| Task | Description |
|------|-------------|
| 📝 Smart Contract | Solidity contract to store hash and metadata reference |
| 🧪 Deploy to Testnet | Use Remix to deploy to Sepolia or Mumbai |
| 🔗 ABI Sharing | Export ABI for frontend + backend usage |
| 🔍 Ethers.js Setup | Connect both layers with Ethers.js |

---

## 🔄 App Flow Summary

1. 📸 User captures photo/video on frontend  
2. 📍 Metadata (GPS, time, device) is auto-collected  
3. 🧾 Media + metadata hashed in browser  
4. 🔐 Hash sent to backend, stored on blockchain  
5. 💾 Media saved in S3 bucket or local storage  
6. 🧠 Metadata saved in PostgreSQL  
7. 🗺️ Map pin created if media is public  
8. ✅ Frontend verifies hash via blockchain and shows badge  

---

## 💰 Dev Environment – 100% Free Setup

| Tool               | Purpose                         | Free?   | Notes                              |
|--------------------|----------------------------------|--------|------------------------------------|
| **MetaMask**       | Wallet & auth                   | ✅     | Fake accounts for testing          |
| **Remix IDE**      | Write/deploy Solidity contracts | ✅     | Use Sepolia or Mumbai testnet      |
| **Ethers.js**      | Contract interaction lib        | ✅     | Used by both backend & frontend    |
| **Next.js**        | Frontend framework              | ✅     | Deployed locally on docker         |
| **Golang**         | Backend API logic               | ✅     | Run locally or on VPS              |
| **PostgreSQL**     | Metadata database               | ✅     | Self-hosted with Docker            |
| **Mapbox / Leaflet** | Mapping interface             | ✅     | Free tier for developers           |
| **Docker**         | Local dev environments          | ✅     | For DB and backend                 |

---

## 🚀 Suggested Build Phases

| Phase | Description |
|-------|-------------|
| 🔧 Phase 1 | Set up local PostgreSQL, Docker, and Git repo |
| 🛠️ Phase 2 | Split into Group A (Frontend) & Group B (Backend) |
| 🔗 Phase 3 | Deploy smart contract and integrate verification |
| 🗺️ Phase 4 | Connect pins and metadata to frontend map |
| ✅ Phase 5 | Final testing, verification, and Vercel deployment |

---
