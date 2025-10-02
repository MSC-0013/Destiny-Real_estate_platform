import React, { createContext, useContext, useState } from "react";

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
  totalCost: number;        // total project cost (user funds)
  remainingPool: number;    // funds left for distribution
  materialCost: number;     // total material cost allocated
  salariesCost: number;     // total salaries allocated
}

interface PaymentContextType {
  payments: Payment[];
  pools: ProjectPool[];
  getPaymentsByProject: (projectId: string) => Payment[];
  addPayment: (payment: Payment) => void;
  markAsPaid: (id: string) => void;
  payInstallment: (paymentId: string, installmentId: string) => void;
  initializeProjectPool: (projectId: string, totalCost: number, materialCost: number) => void;
  allocatePayment: (projectId: string, recipient: string, amount: number, type: string) => void;
  getPoolBalance: (projectId: string) => ProjectPool | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pools, setPools] = useState<ProjectPool[]>([]);

  const getPaymentsByProject = (projectId: string) =>
    payments.filter((p) => p.projectId === projectId);

  const addPayment = (payment: Payment) => {
    setPayments((prev) => [...prev, payment]);
  };

  const markAsPaid = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p))
    );
  };

  const payInstallment = (paymentId: string, installmentId: string) => {
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
  };

  // Initialize project pool (from total project cost)
  const initializeProjectPool = (projectId: string, totalCost: number, materialCost: number) => {
    setPools((prev) => [
      ...prev.filter((p) => p.projectId !== projectId),
      {
        projectId,
        totalCost,
        remainingPool: totalCost - materialCost,
        materialCost,
        salariesCost: 0,
      },
    ]);

    // Add material payment automatically
    if (materialCost > 0) {
      addPayment({
        id: Date.now().toString(),
        projectId,
        description: "Material Cost",
        type: "material",
        amount: materialCost,
        dueDate: new Date().toISOString(),
        status: "paid",
      });
    }
  };

  // Allocate salaries or other payments from remaining pool
  const allocatePayment = (
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

    addPayment({
      id: Date.now().toString(),
      projectId,
      description: `Payment to ${recipient}`,
      type: type as any,
      amount,
      dueDate: new Date().toISOString(),
      status: "paid",
      recipient,
    });
  };

  const getPoolBalance = (projectId: string) =>
    pools.find((p) => p.projectId === projectId);

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
