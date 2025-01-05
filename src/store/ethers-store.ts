import { Signer, JsonRpcProvider, BrowserProvider } from 'ethers'
import { create } from 'zustand'

interface IState {
  provider: BrowserProvider | JsonRpcProvider | null
  signer: Signer | null
  balance: string
  setProvider: (provider: BrowserProvider | JsonRpcProvider | null) => void
  setSigner: (signer: Signer | null) => void
  setBalance: (balance: string) => void
}

export const useEthersStore = create<IState>((set) => ({
  signer: null,
  provider: null,
  balance: '0',
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
  setBalance: (balance) => set({ balance }),
}))

