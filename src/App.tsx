import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DarkMode, LightMode } from "@mui/icons-material";
import WalletConnector from "./components/WalletConnector";
import NetworkSelector from "./components/NetworkSelector";
import TransactionList from "./components/TransactionList";
import { toggleTheme } from "./redux/slice/themeSlice";
import type { RootState } from "./redux/store";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Cross-Chain Wallet Dashboard
              </h1>
            </div>
            
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-3 rounded-lg card-hover"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <DarkMode sx={{ color: "var(--text-secondary)" }} />
              ) : (
                <LightMode sx={{ color: "var(--text-secondary)" }} />
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WalletConnector />
            <NetworkSelector />
          </div>
        </header>
        <main>
          <TransactionList />
        </main>
      </div>
    </div>
  );
}
