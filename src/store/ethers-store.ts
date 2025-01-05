import { Signer, JsonRpcProvider, BrowserProvider  } from 'ethers'
import { create } from 'zustand'

interface IState {
  provider: BrowserProvider | JsonRpcProvider | null,
  signer: Signer | null
  setProvider: (provider: BrowserProvider | JsonRpcProvider | null) => void
  setSigner: (signer: Signer | null) => void
}

export const useEthersStore = create<IState>((set) => ({
  signer: null,
  provider: null,
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
}))

