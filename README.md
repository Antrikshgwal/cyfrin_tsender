
## 🚀 TSender - Multi-Recipient Token Transfer dApp

TSender is a powerful dApp that lets you send ERC-20 tokens to **multiple addresses at once** — fast, efficient, and gas-optimized. Perfect for airdrops, payouts, or distributions.

![screenshot](![alt text](image.png))

---

### ✨ Features

* 🔍 **Auto-token detection**: Enter a token address to auto-fetch its name, decimals, and your balance
* 🧑‍🤝‍🧑 **Batch transfer**: Distribute tokens to many wallets in one transaction
* 📦 **Smart contract powered**: Uses a custom `TSender` contract to execute secure multi-send
* ⚡ **Real-time validation**: Checks for address validity, token balance, and amount formatting
* 🦄 Built with **React**, **Wagmi**, **Ethers.js**, and **Tailwind CSS**

---

### 🖼 Demo

[Live Demo Link](https://cyfrin-tsender.vercel.app/)

---

### 🔧 Getting Started

#### 1. Clone the repo

```bash
git clone https://github.com/yourusername/tsender.git
cd tsender
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Set up your environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_PROJECT_ID=your-wagmi-or-walletconnect-project-id
```

> Note: You may also need Alchemy or Infura keys if using them.

#### 4. Run the dev server

```bash
pnpm dev
```

---

### 🧠 How It Works

1. **Token Info Fetching**:
   We use `useReadContracts` to fetch:

   * `decimals`
   * `name`
   * `balanceOf(msg.sender)`

2. **Transfer Form**:

   * Input token address
   * Paste recipient addresses (comma or newline separated)
   * Enter amount per recipient
   * Total is calculated = amount × number of recipients

3. **Smart Contract Interaction**:
   On submission:

   * We call the `TSender` contract’s `distributeTokens` (or equivalent)
   * It performs a `transferFrom` to each recipient

---

### 📄 Smart Contract

Deployed on: `Polygon Mumbai` / `Sepolia` / etc.
Contract Address: `0xYourTSenderContractAddress`
Function Signature:

```solidity
function distributeERC20(
  address token,
  address[] calldata recipients,
  uint256[] calldata amounts
) external
```

---

### 🛡 Security Notes

* We rely on the user approving the `TSender` contract beforehand
* All addresses and values are validated client-side before execution

---

### 🛠 Tech Stack

* ⚛️ React + Next.js
* 🎣 Wagmi + Viem
* 💅 Tailwind CSS
* 💼 ethers.js
* 🧠 TypeScript

---

### 📦 Folder Structure (optional)

```bash
.
├── components/        # Reusable UI components
├── constants/         # ABI, chain config
├── hooks/             # Custom hooks like useDebounce
├── pages/             # Next.js pages
├── public/            # Static assets
└── utils/             # Utility functions
```

---

### 👨‍💻 Author

**Antriksh Gwal**
🔗 [GitHub](https://github.com/antrikshgwal)
🐦 [Twitter](https://x.com/Warmonger85)

---

### 🪙 License

MIT License. Feel free to fork, improve, and build on top of it!

---
