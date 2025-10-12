import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import API from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<boolean>;
  canAfford: (amount: number) => boolean;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load wallet balance from backend or fallback to localStorage
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await API.get(`/wallet/${user._id}`);
        let mongoBalance = res.data.balance;

        // Merge with localStorage if exists (to avoid losing offline funds)
        const stored = localStorage.getItem(`walletBalance_${user._id}`);
        if (stored) {
          const localBalance = parseFloat(stored);
          mongoBalance = Math.max(mongoBalance, localBalance);
        }

        setBalance(mongoBalance);
        localStorage.setItem(`walletBalance_${user._id}`, mongoBalance.toString());
      } catch {
        console.warn("Backend unavailable, using localStorage");
        const raw = localStorage.getItem(`walletBalance_${user._id}`);
        setBalance(raw ? parseFloat(raw) : 0); // start from 0 if nothing
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  // Sync localStorage whenever balance changes
  useEffect(() => {
    if (user) localStorage.setItem(`walletBalance_${user._id}`, balance.toString());
  }, [balance, user]);

  // Add funds
  const addFunds = async (amount: number): Promise<void> => {
    if (!user || amount <= 0 || !isFinite(amount)) {
      toast({ title: "Invalid amount", description: "Enter a positive amount", variant: "destructive" });
      return;
    }

    try {
      const res = await API.post(`/wallet/${user._id}/add`, { amount });
      setBalance(res.data.balance);
      localStorage.setItem(`walletBalance_${user._id}`, res.data.balance.toString());
      toast({ title: "Funds added", description: `₹${amount.toLocaleString()} added to wallet` });
    } catch {
      // fallback to localStorage
      const newBalance = balance + amount;
      setBalance(newBalance);
      localStorage.setItem(`walletBalance_${user._id}`, newBalance.toString());
      toast({ title: "Funds added (offline)", description: `₹${amount.toLocaleString()} added to wallet` });
    }
  };

  // Withdraw funds
  const withdraw = async (amount: number): Promise<boolean> => {
    if (!user || amount <= 0 || !isFinite(amount)) {
      toast({ title: "Invalid amount", description: "Enter a positive amount", variant: "destructive" });
      return false;
    }

    if (amount > balance) {
      toast({ title: "Insufficient funds", description: "Add money to your wallet to continue", variant: "destructive" });
      return false;
    }

    try {
      const res = await API.post(`/wallet/${user._id}/withdraw`, { amount });
      setBalance(res.data.balance);
      localStorage.setItem(`walletBalance_${user._id}`, res.data.balance.toString());
      toast({ title: "Payment Successful", description: `₹${amount.toLocaleString()} deducted from wallet` });
      return true;
    } catch {
      // fallback to localStorage
      const newBalance = balance - amount;
      setBalance(newBalance);
      localStorage.setItem(`walletBalance_${user._id}`, newBalance.toString());
      toast({ title: "Payment Successful (offline)", description: `₹${amount.toLocaleString()} deducted from wallet` });
      return true;
    }
  };

  const canAfford = (amount: number) => balance >= amount;

  return (
    <WalletContext.Provider value={{ balance, addFunds, withdraw, canAfford, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
