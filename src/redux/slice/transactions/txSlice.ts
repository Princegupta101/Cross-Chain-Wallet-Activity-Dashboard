import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { getRecentTransfers } from "../../../services/alchemy";
import { getNativePriceUSD } from "../../../services/price";
import type { TxItem, TxState, TxStatus , ChainKey} from "../../../types/types";

const initialState: TxState = {
  items: [],
  loading: false,
  error: null
};

interface CacheEntry {
  data: TxItem[];
  timestamp: number;
  address: string;
  chainKey: ChainKey;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry>();

const getCacheKey = (address: string, chainKey: ChainKey) => `${address}-${chainKey}`;

const getCachedTransactions = (address: string, chainKey: ChainKey): TxItem[] | null => {
  const key = getCacheKey(address, chainKey);
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  return null;
};

const setCachedTransactions = (address: string, chainKey: ChainKey, data: TxItem[]): void => {
  const key = getCacheKey(address, chainKey);
  cache.set(key, {
    data,
    timestamp: Date.now(),
    address,
    chainKey
  });
};

export const fetchTxs = createAsyncThunk<
  TxItem[],
  { address: string; chainKey: ChainKey },
  { state: RootState; rejectValue: string }
>("tx/fetchTxs", async ({ address, chainKey }, { rejectWithValue }) => {
  try {
    // Check cache first
    const cached = getCachedTransactions(address, chainKey);
    if (cached) {
      return cached;
    }

    const transfers = await getRecentTransfers(chainKey, address, 12); 
    const nativePrice = await getNativePriceUSD(chainKey);
    const mapped = transfers
      .map((t: any) => {
        const direction = (t.from || "").toLowerCase() === address.toLowerCase() ? "sent" : "received";
        const tokenSymbol = t?.asset || t?.tokenSymbol || (t.category === "external" ? "ETH" : undefined);
        let rawValue = "0";
        let amountDisplay = "";
        if (t.value) {
          rawValue = t.value;
          const asNum = Number(rawValue) / 1e18;
          amountDisplay = asNum.toFixed(asNum < 1 ? 6 : 4).replace(/\.?0+$/, "");
        } else if (t.amount) {
          rawValue = t.amount;
          amountDisplay = rawValue;
        } else {
          amountDisplay = "0";
        }
        const ts = t.metadata?.blockTimestamp ? Math.floor(new Date(t.metadata.blockTimestamp).getTime() / 1000) : Math.floor(Date.now() / 1000);
        const status: TxStatus = t?.status === "PENDING" ? "pending" : "confirmed";
        const usd = nativePrice ? Number(amountDisplay) * nativePrice : null;

        return {
          hash: t.hash,
          from: t.from,
          to: t.to,
          value: rawValue,
          amountDisplay,
          tokenSymbol,
          timestamp: ts,
          status,
          chain: chainKey,
          direction,
          usd
        } as TxItem;
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    // Cache the results
    setCachedTransactions(address, chainKey, mapped);
    
    return mapped;
  } catch (err: any) {
    let errorMessage = "Failed to fetch transactions";
    
    // Enhanced error handling for rate limiting
    if (err.response?.status === 429 || err.message?.includes('rate limit')) {
      errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
    } else if (err.response?.status === 400) {
      errorMessage = "Invalid request. Please check your wallet address.";
    } else if (err.response?.status === 500) {
      errorMessage = "Server error. Please try again later.";
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    return rejectWithValue(errorMessage);
  }
});

const txSlice = createSlice({
  name: "tx",
  initialState,
  reducers: {
    clearTxs(state) {
      state.items = [];
      state.error = null;
    },
    clearCache() {
      cache.clear();
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTxs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTxs.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchTxs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Error fetching transactions";
    });
  }
});

export const { clearTxs, clearCache } = txSlice.actions;
export default txSlice.reducer;
