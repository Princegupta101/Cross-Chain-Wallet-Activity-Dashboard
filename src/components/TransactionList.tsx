import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info, ArrowForward, ArrowBack } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../redux/store";
import type { TxItem } from "../types/types";
import { fetchTxs } from "../redux/slice/transactions/txSlice";
import Loader from "../components/common/Loader";

const  shortAddr=(a?: string) =>{
  if (!a) return "";
  return a.slice(0, 6) + "…" + a.slice(-4);
}

export default function TransactionList() {
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useSelector((s: RootState) => s.wallet);
  const txState = useSelector((s: RootState) => s.tx);

  useEffect(() => {
    if (wallet.connected && wallet.address) {
      dispatch(fetchTxs({ address: wallet.address, chainKey: wallet.chainKey }));
    }
  }, [dispatch, wallet.connected, wallet.address, wallet.chainKey]);

  if (!wallet.connected) {
    return (
      <div
        className="card rounded-xl p-8 text-center"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <Info sx={{ fontSize: 64, color: "var(--text-muted)", opacity: 0.5, mb: 2 }} />
        <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
          Connect your wallet to view transaction history
        </p>
      </div>
    );
  }

  if (txState.loading) {
    return (
      <div
        className="card rounded-xl p-8"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <Loader text="Loading transactions" />
      </div>
    );
  }

  if (txState.error) {
    return (
      <div className="card rounded-xl p-6" style={{ backgroundColor: "#fee2e2", borderColor: "#fecaca" }}>
        <p className="font-medium" style={{ color: "#dc2626" }}>{txState.error}</p>
      </div>
    );
  }

  if (txState.items.length === 0) {
    return (
      <div
        className="card rounded-xl p-8 text-center"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
          No transactions found for this network
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Recent Transactions
        </h2>
        <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "var(--bg-accent)", color: "var(--text-secondary)" }}>
          {txState.items.length} {txState.items.length === 1 ? "transaction" : "transactions"}
        </span>
      </div>
      
      <div className="space-y-3">
        {txState.items.map((tx: TxItem) => (
          <div
            key={tx.hash}
            className="card card-hover rounded-xl p-5"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: tx.direction === "sent" ? "#fee2e2" : "#dcfce7",
                  }}
                >
                  {tx.direction === "sent" ? (
                    <ArrowForward sx={{ fontSize: 20, color: "#dc2626" }} />
                  ) : (
                    <ArrowBack sx={{ fontSize: 20, color: "#16a34a" }} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded"
                      style={{
                        backgroundColor: tx.direction === "sent" ? "#fee2e2" : "#dcfce7",
                        color: tx.direction === "sent" ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {tx.direction.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: "var(--text-muted)" }}>From:</span>
                      <span className="font-mono" style={{ color: "var(--text-secondary)" }}>{shortAddr(tx.from)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: "var(--text-muted)" }}>To:</span>
                      <span className="font-mono" style={{ color: "var(--text-secondary)" }}>{shortAddr(tx.to)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  {tx.amountDisplay}
                </div>
                <div className="text-sm font-medium mb-1" style={{ color: "var(--accent-primary)" }}>
                  {tx.tokenSymbol ?? "NATIVE"}
                </div>
                <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                  {tx.chain.toUpperCase()}
                </div>
                {tx.usd && (
                  <div className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                    ${tx.usd.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
