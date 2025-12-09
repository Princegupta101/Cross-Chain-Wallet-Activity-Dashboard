import axios from "axios";
import type { ChainKey, ChainConfig, AlchemyTransfer, AlchemyResponse, AlchemyRequest } from "../types/types";

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY as string;
const USE_DUMMY_TXS = import.meta.env.VITE_USE_DUMMY_TXS === "true";

if (!ALCHEMY_KEY) {
  console.warn("No ALCHEMY KEY set. Create .env.local with VITE_ALCHEMY_KEY");
}

const chainConfig: Record<ChainKey, ChainConfig> = {
  ethereum: { base: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, chainId: 1, nativeSymbol: "ETH" },
  polygon: { base: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, chainId: 137, nativeSymbol: "MATIC" },
  arbitrum: { base: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, chainId: 42161, nativeSymbol: "ETH" }
};

export async function getRecentTransfers(chain: ChainKey, address: string, maxCount = 10): Promise<AlchemyTransfer[]> {
  if (USE_DUMMY_TXS) {
    const dummy = await import("../data/dummyTransfers.json");
    return (dummy.default as AlchemyTransfer[]).slice(0, maxCount);
  }

  const cfg = chainConfig[chain];
  if (!cfg) throw new Error("Unsupported chain");
  const base = cfg.base;

  try {
    const commonParams = {
      category: ["external", "erc20", "erc721", "erc1155", "internal"],
      withMetadata: true,
      maxCount
    };

    const [incomingResp, outgoingResp] = await Promise.all([
      axios.post<AlchemyResponse>(base, {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            ...commonParams,
            toAddress: address
          }
        ]
      } as AlchemyRequest),
      axios.post<AlchemyResponse>(base, {
        jsonrpc: "2.0",
        id: 2,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            ...commonParams,
            fromAddress: address
          }
        ]
      } as AlchemyRequest)
    ]);

    const inTransfers = incomingResp.data?.result?.transfers ?? [];
    const outTransfers = outgoingResp.data?.result?.transfers ?? [];
    
    const combined = [...inTransfers, ...outTransfers];
    const map = new Map<string, AlchemyTransfer>();
    for (const t of combined) {
      const key = `${t.hash}-${t.from}-${t.to}`;
      if (!map.has(key)) map.set(key, t);
    }
    const unique = Array.from(map.values()).sort((a: AlchemyTransfer, b: AlchemyTransfer) => {
      const ta = new Date(a.metadata?.blockTimestamp || Date.now()).getTime();
      const tb = new Date(b.metadata?.blockTimestamp || Date.now()).getTime();
      return tb - ta;
    });
    return unique.slice(0, maxCount);
  } catch (err: unknown) {
    const error = err as any;
    const msg = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || "Alchemy request failed";
    throw new Error(msg);
  }
}
