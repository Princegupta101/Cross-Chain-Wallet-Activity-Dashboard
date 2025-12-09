import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import type { ChainKey } from "../types/types";
import { setChain } from "../redux/slice/walletSlice";
import { fetchTxs } from "../redux/slice/transactions/txSlice";

const options: { key: ChainKey; label: string }[] = [
  { key: "ethereum", label: "Ethereum" },
  { key: "polygon", label: "Polygon" },
  { key: "arbitrum", label: "Arbitrum" }
];

export default function NetworkSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useSelector((s: RootState) => s.wallet);

  const onSelect = (chainKey: ChainKey) => { 
    const chainId: number =
      chainKey === "ethereum" ? 1 :
      chainKey === "polygon" ? 137 :
      42161;
    dispatch(setChain({ chainKey, chainId }));
    if (wallet.address) {
      dispatch(fetchTxs({ address: wallet.address, chainKey }));
    }
  };

  return (
    <div
      className="card card-hover rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Select Network
            </span>
            <div className="flex gap-2 flex-wrap">
              {options.map((o) => (
                <button
                  key={o.key}
                  onClick={() => onSelect(o.key as ChainKey)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold focus:outline-none transition-all cursor-pointer border min-w-20`}
                  style={{
                    backgroundColor:
                      wallet.chainKey === o.key
                        ? "var(--bg-accent)"
                        : "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    boxShadow:
                      wallet.chainKey === o.key
                        ? "0 0 0 2px var(--accent-primary)"
                        : "none",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
