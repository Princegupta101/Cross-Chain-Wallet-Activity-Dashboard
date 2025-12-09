import axios from "axios";
import type { ChainKey } from "../types/types";

const chainToCG: Record<ChainKey, string> = {
  ethereum: "ethereum",
  polygon: "matic-network",
  arbitrum: "arbitrum"
};

interface CoinGeckoResponse {
  [coinId: string]: {
    usd?: number;
  };
}

export async function getNativePriceUSD(chain: ChainKey): Promise<number | null> {
  try {
    const id = chainToCG[chain];
    const res = await axios.get<CoinGeckoResponse>(`https://api.coingecko.com/api/v3/simple/price`, {
      params: { ids: id, vs_currencies: "usd" }
    });
    const price = res.data?.[id]?.usd;
    if (typeof price === "number") return price;
    return null;
  } catch (err: unknown) {
    return null;
  }
}
