export type LoaderSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface LoaderProps {
  size?: LoaderSize;
  text?: string;
  className?: string;
}

export type ThemeState = {
  mode: 'light' | 'dark';
};

export type TxStatus = "pending" | "confirmed" | "failed";

export interface TxItem {
  hash: string;
  from: string;
  to: string;
  value: string;
  amountDisplay: string; 
  tokenSymbol?: string;
  timestamp: number;
  status: TxStatus;
  chain: string;
  direction: "sent" | "received" | "self";
  usd?: number | null;
}

export interface TxState {
  items: TxItem[];
  loading: boolean;
  error?: string | null;
}

export type ChainKey = "ethereum" | "polygon" | "arbitrum";

export interface ChainConfig {
  base: string;
  chainId: number;
  nativeSymbol: string;
}

export interface AlchemyTransferMetadata {
  blockTimestamp?: string;
  blockNumber?: string;
}

export interface AlchemyTransfer {
  hash: string;
  from: string;
  to: string;
  value?: number;
  asset?: string;
  category: string;
  rawContract?: {
    address?: string;
    decimal?: string;
  };
  metadata?: AlchemyTransferMetadata;
}

export interface AlchemyResponse {
  jsonrpc: string;
  id: number;
  result?: {
    transfers: AlchemyTransfer[];
  };
  error?: {
    code: number;
    message: string;
  };
}

export interface AlchemyRequestParams {
  category: string[];
  withMetadata: boolean;
  maxCount: number;
  toAddress?: string;
  fromAddress?: string;
}

export interface AlchemyRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params: [AlchemyRequestParams];
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  chainKey: ChainKey;
  connected: boolean;
  error?: string | null;
}