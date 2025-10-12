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
  addInvestment: (investment: Omit<Investment, "_id">) => Promise<Investment>;
  deleteInvestment: (investmentId: string) => Promise<void>;
  fetchAllInvestorDetails: () => Promise<void>;
}

const InvestContext = createContext<InvestContextType | undefined>(undefined);

export const InvestProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [allInvestorDetails, setAllInvestorDetails] = useState<InvestorDetails[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Fetch investments for a single user (directly from backend)
  const fetchInvestments = async (userId: string) => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await API.getInvestments(userId);
      setInvestments(res.data);
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

  // 🧩 Add new investment (buy shares)
  const addInvestment = async (investment: Omit<Investment, "_id">): Promise<Investment> => {
    setLoading(true);
    try {
      const res = await API.createInvestment(investment);
      setInvestments((prev) => [...prev, res.data]);

      toast({
        title: "Investment Successful!",
        description: "Your investment has been added successfully.",
      });

      return res.data as Investment;
    } catch (error) {
      console.error("❌ Error adding investment:", error);
      toast({
        title: "Failed to add investment",
        description: "Something went wrong while adding your investment.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Delete investment (sell shares)
  const deleteInvestment = async (investmentId: string) => {
    try {
      setLoading(true);
      await API.deleteInvestment(investmentId);
      setInvestments((prev) => prev.filter((inv) => inv._id !== investmentId));

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

  // 🧩 Fetch all investor details (admin)
  const fetchAllInvestorDetails = async () => {
    try {
      setLoading(true);
      const res = await API.getAllInvestorDetails();
      setAllInvestorDetails(res.data);
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
