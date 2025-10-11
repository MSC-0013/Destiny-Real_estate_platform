import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as API from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export interface Investment {
  _id?: string;
  property_id: string;
  user_id: string;
  property_name: string;
  shares_owned: number;
  total_investment: number;
  date: string;
  current_value: number;
  growth_percentage: number;
  profit?: number;
  admin_commission?: number;
}

interface InvestorDetails {
  investor_id: string;
  investor_name: string;
  email: string;
  total_invested: number;
  total_profit: number;
  admin_commission: number;
  investments: Investment[];
}

interface InvestContextType {
  investments: Investment[];
  allInvestorDetails: InvestorDetails[];
  loading: boolean;
  fetchInvestments: (userId: string) => Promise<void>;
  addInvestment: (investment: Omit<Investment, "_id">) => Promise<void>;
  deleteInvestment: (investmentId: string) => Promise<void>;
  fetchAllInvestorDetails: () => Promise<void>;
}

const InvestContext = createContext<InvestContextType | undefined>(undefined);

export const InvestProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [allInvestorDetails, setAllInvestorDetails] = useState<InvestorDetails[]>([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Load investments from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("investments");
    if (saved) setInvestments(JSON.parse(saved));
  }, []);

  // 🧩 Fetch investments for a single user and sync with backend
  const fetchInvestments = async (userId: string) => {
    try {
      setLoading(true);
      const res = await API.getInvestments(userId);
      setInvestments(res.data);
      localStorage.setItem("investments", JSON.stringify(res.data));
    } catch (error) {
      console.error("❌ Failed to fetch investments:", error);
      toast({
        title: "Error loading investments",
        description: "Could not fetch your investments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Add new investment (Buy shares)
  const addInvestment = async (investment: Omit<Investment, "_id">) => {
    try {
      setLoading(true);

      // Calculate profit and admin commission
      const profit = investment.total_investment * (investment.growth_percentage / 100);
      const admin_commission = profit * 0.01;

      const newInvestment: Investment = {
        ...investment,
        profit,
        admin_commission,
        _id: `temp-${Date.now()}`, // temporary id for immediate UI
      };

      // 1️⃣ Show in UI immediately and save to localStorage
      setInvestments((prev) => {
        const updated = [...prev, newInvestment];
        localStorage.setItem("investments", JSON.stringify(updated));
        return updated;
      });

      // 2️⃣ Persist to backend
      const res = await API.createInvestment(newInvestment);

      // 3️⃣ Replace temp id with real backend id
      setInvestments((prev) =>
        prev.map((inv) => (inv._id === newInvestment._id ? res.data : inv))
      );
      localStorage.setItem(
        "investments",
        JSON.stringify(
          investments.map((inv) => (inv._id === newInvestment._id ? res.data : inv))
        )
      );

      toast({
        title: "Investment Successful!",
        description: "Your investment has been added successfully.",
      });
    } catch (error) {
      console.error("❌ Error adding investment:", error);
      toast({
        title: "Failed to add investment",
        description: "Something went wrong while saving your investment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Delete investment
  const deleteInvestment = async (investmentId: string) => {
    try {
      setLoading(true);

      // 1️⃣ Remove locally immediately
      setInvestments((prev) => {
        const updated = prev.filter((inv) => inv._id !== investmentId);
        localStorage.setItem("investments", JSON.stringify(updated));
        return updated;
      });

      // 2️⃣ Remove from backend
      await API.deleteInvestment(investmentId);

      toast({
        title: "Investment Removed",
        description: "Investment deleted successfully.",
      });
    } catch (error) {
      console.error("❌ Error deleting investment:", error);
      toast({
        title: "Failed to delete investment",
        description: "Something went wrong while deleting your investment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Fetch all investor details (Admin View)
  const fetchAllInvestorDetails = async () => {
    try {
      setLoading(true);
      const res = await API.getAllInvestorDetails();
      setAllInvestorDetails(res.data);
      toast({
        title: "Investor Data Loaded",
        description: "All investor details loaded successfully.",
      });
    } catch (error) {
      console.error("❌ Failed to load all investor details:", error);
      toast({
        title: "Error fetching investor details",
        description: "Unable to fetch complete investor data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvestContext.Provider
      value={{
        investments,
        allInvestorDetails,
        loading,
        fetchInvestments,
        addInvestment,
        deleteInvestment,
        fetchAllInvestorDetails,
      }}
    >
      {children}
    </InvestContext.Provider>
  );
};

export const useInvest = () => {
  const context = useContext(InvestContext);
  if (!context) throw new Error("useInvest must be used within an InvestProvider");
  return context;
};