import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import API from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<boolean>;
  addFromInvestmentSale: (amount: number) => void;
  canAfford: (amount: number) => boolean;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wallet balance from MongoDB when user logs in
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await API.get(`/wallet/${user._id}`);
        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error("Error fetching balance:", err);
        toast({
          title: "Server Error",
          description: "Could not fetch wallet balance. Try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, [user]);

  // Add funds
  const addFunds = async (amount: number): Promise<void> => {
    if (!user || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a valid number.", variant: "destructive" });
      return;
    }
    try {
      const res = await API.post(`/wallet/${user._id}/add`, { amount });
      setBalance(res.data.balance);
      toast({ title: "Funds Added", description: res.data.message });
    } catch (err) {
      console.error("Error adding funds:", err);
      toast({ title: "Server Error", description: "Failed to add funds.", variant: "destructive" });
    }
  };

  // Withdraw funds
  const withdraw = async (amount: number): Promise<boolean> => {
    if (!user || amount <= 0) return false;
    if (amount > balance) {
      toast({ title: "Insufficient Funds", description: "Add more money to your wallet.", variant: "destructive" });
      return false;
    }
    try {
      const res = await API.post(`/wallet/${user._id}/withdraw`, { amount });
      setBalance(res.data.balance);
      toast({ title: "Withdrawal Successful", description: res.data.message });
      return true;
    } catch (err) {
      console.error("Error withdrawing funds:", err);
      toast({ title: "Server Error", description: "Failed to process withdrawal.", variant: "destructive" });
      return false;
    }
  };

  // Update wallet instantly after investment sale
  const addFromInvestmentSale = (amount: number) => {
    setBalance((prev) => prev + amount);
    toast({ title: "Wallet Updated", description: `₹${amount} added from investment sale.` });
  };

  const canAfford = (amount: number) => balance >= amount;

  return (
    <WalletContext.Provider value={{ balance, addFunds, withdraw, addFromInvestmentSale, canAfford, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
