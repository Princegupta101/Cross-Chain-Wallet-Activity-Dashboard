# Cross-Chain Wallet Activity Dashboard

A minimal React + TypeScript application for displaying wallet activity across multiple blockchains: Ethereum, Polygon PoS, and Arbitrum.

### Live link - https://cross-chain-wallet-activity-dashboa.vercel.app/

## Features
- Connect MetaMask (display address, disconnect)
- Select chain (Ethereum, Polygon, Arbitrum) — selection is persisted in `localStorage`
- Fetch the last 10 asset transfers using Alchemy (`alchemy_getAssetTransfers`)
- Display timestamp, direction, amount, token symbol, chain, and status
- Native token USD conversion (via CoinGecko) for quick USD equivalents
- Loading and error states
- Mobile-responsive UI using minimal Tailwind CSS
- Global state management with Redux Toolkit (wallet & transactions)

## Technology Choices & Rationale
- **React + TypeScript**: Required for typed UI and maintainability.
- **Redux Toolkit**: Provides a single source of truth for wallet and transaction state, simplifies async logic, and ensures predictable state updates.
- **ethers.js**: Included for potential future features (e.g., token decimal lookups); currently, direct MetaMask provider access is used.
- **Tailwind CSS**: Enables rapid, utility-first styling with minimal custom CSS.
- **Alchemy**: The `alchemy_getAssetTransfers` method offers a convenient cross-token transfer feed via REST JSON-RPC.
- **CoinGecko**: Public API for native token USD prices; suitable for this assessment.


## How to Run
1. Copy `.env.example` to `.env.local` and set `VITE_ALCHEMY_KEY`.
2. Run `npm install`
3. Start the app with `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173)

**Key Directories:**
- `components/`: All UI building blocks, including wallet and transaction views.
- `redux/`: Centralized state management using Redux Toolkit.
- `services/`: API helpers for Alchemy and CoinGecko.
- `types/`: TypeScript type definitions for strong typing.
- `utils/`: Utility functions for formatting and provider setup.
- `data/`: Static data for development/testing.

## File Map
- `src/redux/slice/walletSlice.ts` — wallet state management
- `src/redux/slice/transactions/txSlice.ts` — transaction fetching logic
- `src/redux/slice/themeSlice.ts` — theme logic 
- `src/services/alchemy.ts` — Alchemy RPC helpers
- `src/services/price.ts` — CoinGecko price helper
- `src/components/*` — UI components
- `src/redux/store.ts` — Redux store configuration

## Architecture

The project is organized for clarity and scalability:

```
├── eslint.config.js           # ESLint configuration
├── index.html                 # Main HTML entry point
├── package.json               # Project dependencies and scripts
├── README.md                  # Project documentation
├── tsconfig*.json             # TypeScript configuration files
├── vercel.json                # Vercel deployment config
├── vite.config.ts             # Vite build config
│
├── public/                    # Static assets (favicon, images, etc.)
│
└── src/                       # Application source code
    ├── App.css                # Global app styles
    ├── App.tsx                # Main React component
    ├── index.css              # Tailwind and global styles
    ├── main.tsx               # React entry point
    │
    ├── components/            # Reusable UI components
    │   ├── NetworkSelector.tsx
    │   ├── TransactionList.tsx
    │   ├── WalletConnector.tsx
    │   └── common/
    │       └── Loader.tsx
    │
    ├── data/                  # Static/dummy data for development
    │   └── dummyTransfers.json
    │
    ├── redux/                 # Redux state management
    │   ├── store.ts
    │   └── slice/
    │       ├── themeSlice.ts
    │       ├── walletSlice.ts
    │       └── transactions/
    │           └── txSlice.ts
    │
    ├── services/              # API and external service helpers
    │   ├── alchemy.ts
    │   └── price.ts
    │
    ├── types/                 # TypeScript type definitions
    │   ├── ethereum.d.ts
    │   └── types.ts
    │
    └── utils/                 # Utility functions
        ├── ethersProvider.ts
        └── format.ts
```

