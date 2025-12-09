import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./slice/walletSlice";
import txReducer from "./slice/transactions/txSlice";
import themeReducer from "./slice/themeSlice";

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    tx: txReducer,
    theme:themeReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
