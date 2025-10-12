import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  canAfford: (amount: number) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const raw = localStorage.getItem("walletBalance");
    setBalance(raw ? parseFloat(raw) : 250000); // default demo balance
  }, []);

  useEffect(() => {
    localStorage.setItem("walletBalance", String(balance));
  }, [balance]);

  const addFunds = (amount: number) => {
    if (amount <= 0 || !isFinite(amount)) {
      toast({ title: "Invalid amount", description: "Enter a positive amount", variant: "destructive" });
      return;
    }
    setBalance((b) => b + amount);
    toast({ title: "Funds added", description: `₹${amount.toLocaleString()} added to wallet` });
  };

  const withdraw = (amount: number) => {
    if (amount <= 0 || !isFinite(amount)) {
      toast({ title: "Invalid amount", description: "Enter a positive amount", variant: "destructive" });
      return false;
    }
    if (amount > balance) {
      toast({ title: "Insufficient funds", description: "Add money to your wallet to continue", variant: "destructive" });
      return false;
    }
    setBalance((b) => b - amount);
    toast({ title: "Payment Successful", description: `₹${amount.toLocaleString()} deducted from wallet` });
    return true;
  };

  const canAfford = (amount: number) => balance >= amount;

  return (
    <WalletContext.Provider value={{ balance, addFunds, withdraw, canAfford }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
