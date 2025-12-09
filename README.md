# Cross-Chain Wallet Activity Dashboard

A minimal React + TypeScript application for displaying wallet activity across multiple blockchains: Ethereum, Polygon PoS, and Arbitrum.

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

## Tradeoffs and Limitations
- ERC20 token amounts and decimals are simplified; accurate formatting requires reading token decimals via `ethers.Contract`.
- CoinGecko's free API is subject to rate limits; production use should consider paid price feeds or caching.
- Only native token USD conversion is implemented; ERC20 token USD conversion is a future improvement.
- Alchemy's free plan may also be rate-limited; the UI displays errors when this occurs.
- Network switching in MetaMask is not triggered automatically; chainId is read on change. EIP-3085 requests can be added to prompt switching.

## How to Run
1. Copy `.env.example` to `.env.local` and set `VITE_ALCHEMY_KEY`.
2. Run `npm install`
3. Start the app with `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173)

## File Map
- `src/redux/slice/walletSlice.ts` — wallet state management
- `src/redux/slice/transactions/txSlice.ts` — transaction fetching logic
- `src/services/alchemy.ts` — Alchemy RPC helpers
- `src/services/price.ts` — CoinGecko price helper
- `src/components/*` — UI components
- `src/redux/store.ts` — Redux store configuration

## Architecture

├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
│
├── public/
│   └── ... (static assets)
│
└── src/
    ├── App.css
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    │
    ├── components/
    │   ├── NetworkSelector.tsx
    │   ├── TransactionList.tsx
    │   ├── WalletConnector.tsx
    │   └── common/
    │       └── Loader.tsx
    │
    ├── data/
    │   └── dummyTransfers.json
    │
    ├── redux/
    │   ├── store.ts
    │   └── slice/
    │       ├── themeSlice.ts
    │       ├── walletSlice.ts
    │       └── transactions/
    │           └── txSlice.ts
    │
    ├── services/
    │   ├── alchemy.ts
    │   └── price.ts
    │
    ├── types/
    │   ├── ethereum.d.ts
    │   └── types.ts
    │
    └── utils/
        ├── ethersProvider.ts
        └── format.ts

## Next Steps / Improvements
- Proper token amount formatting using token decimals (via `ethers.Contract`) and ERC20 USD lookup per token.
- Caching (localStorage or IndexedDB) to reduce RPC calls and avoid rate limits.
- Paginated history view and "Load more" functionality.
- Unit tests for slices and components (Jest + React Testing Library).
- Add dark mode, programmatic chain switching (EIP-3085), and wallet fallback (WalletConnect).

