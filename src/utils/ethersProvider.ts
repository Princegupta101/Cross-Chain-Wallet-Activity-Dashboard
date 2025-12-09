import { ethers } from 'ethers';

export class EthersWalletProvider {
  private provider: ethers.BrowserProvider | null = null;

  async getProvider(): Promise<ethers.BrowserProvider> {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask not found. Install MetaMask and retry.');
    }
    
    if (!this.provider) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
    return this.provider;
  }

  async getSigner(): Promise<ethers.JsonRpcSigner> {
    const provider = await this.getProvider();
    return await provider.getSigner();
  }

  async getAccounts(): Promise<string[]> {
    const provider = await this.getProvider();
    return await provider.send('eth_requestAccounts', []);
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();
    const network = await provider.getNetwork();
    return Number(network.chainId);
  }

  async switchChain(chainId: number): Promise<void> {
    const provider = await this.getProvider();
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` }
      ]);
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('Chain not added to wallet. Please add it manually.');
      }
      throw error;
    }
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if ((window as any).ethereum?.on) {
      (window as any).ethereum.on('accountsChanged', callback);
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if ((window as any).ethereum?.on) {
      (window as any).ethereum.on('chainChanged', callback);
    }
  }

  removeAllListeners(): void {
    if ((window as any).ethereum?.removeAllListeners) {
      (window as any).ethereum.removeAllListeners();
    }
  }
}

export const ethersProvider = new EthersWalletProvider();
