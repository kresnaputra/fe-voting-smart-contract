'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Wallet } from 'lucide-react'
import { getEthereumProvider } from '@/utils/ether'
import { useEthersStore } from '@/store/ethers-store'
import { formatEther } from 'ethers'

export default function Navbar() {
  const { setProvider, signer, setSigner, provider } = useEthersStore();

  const [balance, setBalance] = useState('0');

  const initializeEthereum = async () => {
    try {
      const provider = getEthereumProvider();
      setProvider(provider);
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();
        console.log('signer', signer)
        setSigner(signer);
      }
    } catch (error) {
      console.error('Error initializing ethereum:', error);
    }
  };

  useEffect(() => {
    initializeEthereum();
  }, []);

  useEffect(() => {
    const getInformation = async () => {
      if (signer && provider) {
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setBalance(formatEther(balance));
      }
    };


    if (provider && signer) {
      getInformation();
    }
  }, [provider, signer]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        initializeEthereum();
      });
    }
  }, []);


  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Voting dApp
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {signer ? (
              <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md">
                <Wallet size={20} />
                <span className="text-sm font-medium">{balance}</span>
              </div>
            ) : (
              <Button>
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {signer ? (
                    <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md">
                      <Wallet size={20} />
                      <span className="text-sm font-medium">{balance}</span>
                    </div>
                  ) : (
                    <Button>
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}


