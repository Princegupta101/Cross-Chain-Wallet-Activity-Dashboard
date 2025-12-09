import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ChainKey } from "../../types/types";

interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number;
  chainKey: ChainKey;
  error: string | null;
}

const loadChainFromStorage = (): ChainKey => {
  try {
    const saved = localStorage.getItem('selectedChain');
    if (saved && ['ethereum', 'polygon', 'arbitrum'].includes(saved)) {
      return saved as ChainKey;
    }
  } catch (error) {
    console.warn('Failed to load chain from localStorage:', error);
  }
  return 'ethereum';
};

const saveChainToStorage = (chainKey: ChainKey) => {
  try {
    localStorage.setItem('selectedChain', chainKey);
  } catch (error) {
    console.warn('Failed to save chain to localStorage:', error);
  }
};

const initialState: WalletState = {
  connected: false,
  address: null,
  chainId: 1,
  chainKey: loadChainFromStorage(),
  error: null
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet(state, action: PayloadAction<{ address: string; chainId: number; chainKey: ChainKey }>) {
      state.connected = true;
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.chainKey = action.payload.chainKey;
      state.error = null;
      saveChainToStorage(action.payload.chainKey);
    },
    setChain(state, action: PayloadAction<{ chainKey: ChainKey; chainId: number }>) {
      state.chainKey = action.payload.chainKey;
      state.chainId = action.payload.chainId;
      state.error = null;
      saveChainToStorage(action.payload.chainKey);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    disconnect(state) {
      state.connected = false;
      state.address = null;
      state.error = null;
      // Keep chainKey persisted even after disconnect
    }
  }
});

export const { setWallet, setChain, setError, disconnect } = walletSlice.actions;
export default walletSlice.reducer;
