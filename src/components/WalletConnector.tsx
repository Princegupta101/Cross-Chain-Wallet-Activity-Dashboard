import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AccountBalanceWallet } from "@mui/icons-material";
import { setWallet, disconnect, setChain, setError } from "../redux/slice/walletSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchTxs } from "../redux/slice/transactions/txSlice";
import { ethersProvider } from "../utils/ethersProvider";
import type { ChainKey } from "../types/types";

// Use ChainKey type for mapping
const chainIdToKey: Record<number, { key: ChainKey; name: string }> = {
  1: { key: "ethereum", name: "Ethereum" },
  137: { key: "polygon", name: "Polygon" },
  42161: { key: "arbitrum", name: "Arbitrum" }
};

export default function WalletConnector() {
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useSelector((s: RootState) => s.wallet);

  useEffect(() => {
    const handleAccounts = async (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        dispatch(disconnect());
      } else {
        try {
          const chainId = await ethersProvider.getChainId();
          const chain = chainIdToKey[chainId] ?? { key: "ethereum" as ChainKey };
          dispatch(setWallet({ address: accounts[0], chainId, chainKey: chain.key }));
          dispatch(fetchTxs({ address: accounts[0], chainKey: chain.key }));
        } catch (error: any) {
          dispatch(setError(error.message || "Failed to get chain information"));
        }
      }
    };

    const handleChain = (chainHex: string) => {
      const chainId = parseInt(chainHex, 16);
      const chain = chainIdToKey[chainId];
      if (chain) {
        dispatch(setChain({ chainKey: chain.key, chainId }));
      } else {
        dispatch(setError("Unsupported chain connected"));
      }
    };

    ethersProvider.onAccountsChanged(handleAccounts);
    ethersProvider.onChainChanged(handleChain);

    return () => {
      ethersProvider.removeAllListeners();
    };
  }, [dispatch]);

  const connect = async () => {
    try {
      const accounts = await ethersProvider.getAccounts();
      if (!accounts || accounts.length === 0) {
        dispatch(setError("No accounts found. Please unlock your wallet."));
        return;
      }
      
      const chainId = await ethersProvider.getChainId();
      const chain = chainIdToKey[chainId] ?? { key: "ethereum" as ChainKey };
      dispatch(setWallet({ address: accounts[0], chainId, chainKey: chain.key }));
      dispatch(fetchTxs({ address: accounts[0], chainKey: chain.key }));
    } catch (err: any) {
      let errorMessage = "Failed to connect wallet";
      if (err.message?.includes('rate limit') || err.code === 429) {
        errorMessage = "Rate limit exceeded. Please try again in a moment.";
      } else if (err.code === 4001) {
        errorMessage = "User rejected the connection request";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      dispatch(setError(errorMessage));
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnect());
  };

  return (
    <div
      className="card card-hover rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      {wallet.connected ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--bg-accent)",
              }}
            >
              <AccountBalanceWallet sx={{ fontSize: 24, color: "var(--accent-primary)" }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-center" style={{ color: "var(--text-muted)" }}>
                Connected Wallet
              </span>
              <span
                className="font-mono text-sm font-semibold mt-1 tracking-tight"
                style={{ color: "var(--accent-primary)" }}
              >
                {wallet.address
                  ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                  : ""}
              </span>
              <span className="text-xs mt-1 font-medium" style={{ color: "var(--text-secondary)" }}>
                {wallet.chainKey.charAt(0).toUpperCase() + wallet.chainKey.slice(1)} Network
              </span>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fecaca"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="w-full px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "#ffffff",
            boxShadow: "var(--shadow-md)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent-primary)"}
          disabled={wallet.connected}
        >
          Connect MetaMask Wallet
        </button>
      )}
    </div>
  );
}
