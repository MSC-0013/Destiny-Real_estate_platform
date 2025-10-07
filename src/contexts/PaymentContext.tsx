import React, { createContext, useContext, useState, useEffect } from "react";
import API from "@/utils/api";

interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid";
}

interface Payment {
  id: string;
  projectId: string;
  description: string;
  type: "emi" | "salary" | "material" | "contractor" | "designer";
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  installments?: Installment[];
  recipient?: string; // Worker, Designer, Contractor
}

interface ProjectPool {
  projectId: string;
  totalCost: number;        
  remainingPool: number;    
  materialCost: number;     
  salariesCost: number;
}

interface PaymentContextType {
  payments: Payment[];
  pools: ProjectPool[];
  getPaymentsByProject: (projectId: string) => Payment[];
  addPayment: (payment: Payment, sync?: boolean) => void;
  markAsPaid: (id: string) => void;
  payInstallment: (paymentId: string, installmentId: string) => void;
  initializeProjectPool: (projectId: string, totalCost: number, materialCost: number) => void;
  allocatePayment: (projectId: string, recipient: string, amount: number, type: string) => void;
  getPoolBalance: (projectId: string) => ProjectPool | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem("payments");
    return saved ? JSON.parse(saved) : [];
  });

  const [pools, setPools] = useState<ProjectPool[]>(() => {
    const saved = localStorage.getItem("pools");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever payments or pools change
  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("pools", JSON.stringify(pools));
  }, [pools]);

  // ---------------------------------------
  // CRUD Functions (Local + Backend)
  // ---------------------------------------

  const getPaymentsByProject = (projectId: string) =>
    payments.filter((p) => p.projectId === projectId);

  const addPayment = async (payment: Payment, sync: boolean = true) => {
    setPayments((prev) => [...prev, payment]);

    if (sync) {
      try {
        await API.post("/payments", payment);
      } catch (err) {
        console.error("Error syncing payment:", err);
      }
    }
  };

  const markAsPaid = async (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p))
    );

    try {
      await API.patch(`/payments/paid/${id}`);
    } catch (err) {
      console.error("Error marking payment as paid:", err);
    }
  };

  const payInstallment = async (paymentId: string, installmentId: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              installments: p.installments?.map((i) =>
                i.id === installmentId ? { ...i, status: "paid" } : i
              ),
            }
          : p
      )
    );

    try {
      await API.patch(`/payments/installment/${paymentId}/${installmentId}`);
    } catch (err) {
      console.error("Error paying installment:", err);
    }
  };

  const initializeProjectPool = async (
    projectId: string,
    totalCost: number,
    materialCost: number
  ) => {
    const newPool: ProjectPool = {
      projectId,
      totalCost,
      remainingPool: totalCost - materialCost,
      materialCost,
      salariesCost: 0,
    };

    setPools((prev) => [
      ...prev.filter((p) => p.projectId !== projectId),
      newPool,
    ]);

    // Sync pool and add material payment to backend
    try {
      await API.post("/payments/pool/init", { projectId, totalCost, materialCost });
    } catch (err) {
      console.error("Error initializing pool:", err);
    }

    if (materialCost > 0) {
      addPayment({
        id: Date.now().toString(),
        projectId,
        description: "Material Cost",
        type: "material",
        amount: materialCost,
        dueDate: new Date().toISOString(),
        status: "paid",
      }, true);
    }
  };

  const allocatePayment = async (
    projectId: string,
    recipient: string,
    amount: number,
    type: string
  ) => {
    const pool = pools.find((p) => p.projectId === projectId);
    if (!pool) return;

    if (amount > pool.remainingPool) {
      alert("Not enough funds in project pool!");
      return;
    }

    setPools((prev) =>
      prev.map((p) =>
        p.projectId === projectId
          ? {
              ...p,
              remainingPool: p.remainingPool - amount,
              salariesCost: type === "salary" ? p.salariesCost + amount : p.salariesCost,
            }
          : p
      )
    );

    const payment: Payment = {
      id: Date.now().toString(),
      projectId,
      description: `Payment to ${recipient}`,
      type: type as any,
      amount,
      dueDate: new Date().toISOString(),
      status: "paid",
      recipient,
    };

    addPayment(payment, true);

    try {
      await API.post("/payments/pool/allocate", { projectId, recipient, amount, type });
    } catch (err) {
      console.error("Error allocating payment:", err);
    }
  };

  const getPoolBalance = (projectId: string) => pools.find((p) => p.projectId === projectId);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        pools,
        getPaymentsByProject,
        addPayment,
        markAsPaid,
        payInstallment,
        initializeProjectPool,
        allocatePayment,
        getPoolBalance,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayments must be used inside PaymentProvider");
  return context;
};
