import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";
import { usePayments } from "@/contexts/PaymentContext";
import { useState } from "react";

interface PaymentsTabProps {
  projectId: string;
}

export default function PaymentsTab({ projectId }: PaymentsTabProps) {
  const { 
    getPaymentsByProject, 
    markAsPaid, 
    payInstallment, 
    allocatePayment, 
    getPoolBalance 
  } = usePayments();

  const payments = getPaymentsByProject(projectId);
  const pool = getPoolBalance(projectId);

  const [recipient, setRecipient] = useState("");
  const [allocAmount, setAllocAmount] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments & Salaries</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Pool Section */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold">Project Pool</h3>
          <p>Total Project Cost: ₹{pool?.totalCost ?? 0}</p>
          <p>Material Cost: ₹{pool?.materialCost ?? 0}</p>
          <p>Salaries Paid: ₹{pool?.salariesCost ?? 0}</p>
          <p>Remaining: ₹{pool?.remainingPool ?? 0}</p>

          {/* Allocate salaries */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Recipient (Worker/Designer/Contractor)"
            />
            <input
              type="number"
              value={allocAmount}
              onChange={(e) => setAllocAmount(Number(e.target.value))}
              className="border px-2 py-1 rounded"
              placeholder="Amount"
            />
            <button
              onClick={() => {
                allocatePayment(projectId, recipient, allocAmount, "salary");
                setRecipient("");
                setAllocAmount(0);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Allocate
            </button>
          </div>
        </div>

        {/* Existing Payments */}
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        payment.status === "paid"
                          ? "border-green-500 text-green-500"
                          : payment.status === "overdue"
                          ? "border-red-500 text-red-500"
                          : "border-yellow-500 text-yellow-500"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{payment.type}</p>
                    {payment.status !== "paid" && (
                      <button
                        onClick={() => markAsPaid(payment.id)}
                        className="mt-2 px-3 py-1 text-sm rounded bg-green-500 text-white"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>

                {/* Installments */}
                {payment.installments && (
                  <div className="mt-3 pl-4 border-l-2">
                    <h5 className="text-sm font-medium">Installments</h5>
                    {payment.installments.map((inst) => (
                      <div key={inst.id} className="flex justify-between text-sm py-1">
                        <span>
                          {new Date(inst.dueDate).toLocaleDateString()} - ₹{inst.amount}
                        </span>
                        <span>
                          {inst.status === "paid" ? (
                            <Badge className="bg-green-500">Paid</Badge>
                          ) : (
                            <button
                              onClick={() => payInstallment(payment.id, inst.id)}
                              className="px-2 py-0.5 text-xs rounded bg-blue-500 text-white"
                            >
                              Pay Now
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <IndianRupee className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No payments scheduled yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
