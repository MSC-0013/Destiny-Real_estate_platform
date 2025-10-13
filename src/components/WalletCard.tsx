import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet as WalletIcon, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function WalletCard() {
  const { balance, addFunds, withdraw, isLoading } = useWallet();
  const { toast } = useToast();
  const [addAmt, setAddAmt] = useState<string>("");
  const [wdAmt, setWdAmt] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!addAmt || parseFloat(addAmt) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid amount to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      toast({ title: "Payment successful!", description: "Funds added successfully." });
      await addFunds(parseFloat(addAmt));
      setShowAddModal(false);
    }, 2000);
  };

  const handleWithdraw = async () => {
    if (!wdAmt || parseFloat(wdAmt) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      toast({ title: "Withdrawal successful!", description: "Funds withdrawn successfully." });
      await withdraw(parseFloat(wdAmt));
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <Card className="mb-8 border-none bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 shadow-lg rounded-2xl p-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold text-indigo-800">Wallet Balance</CardTitle>
        <WalletIcon className="h-6 w-6 text-indigo-600" />
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold text-gray-800">{formatCurrency(balance)}</div>
          <div className="flex gap-3">
            <Button
              disabled={isLoading}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:scale-105 transition"
            >
              Add Money
            </Button>

            <Button
              disabled={isLoading}
              onClick={() => setShowWithdrawModal(true)}
              variant="outline"
              className="border-indigo-400 text-indigo-700 hover:bg-indigo-50"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl z-50 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">Add Money</h2>
            <p className="text-gray-500 mb-4 text-sm">Demo only. No real payments.</p>

            <div className="bg-gray-100 p-4 rounded-xl mb-4 w-72 text-center">
              <p className="text-sm font-medium mb-2 text-gray-700">Scan to Pay</p>
              <div className="h-32 w-32 mx-auto bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                QR IMAGE
              </div>
            </div>

            <div className="w-72 space-y-3">
              <Label htmlFor="add-amt">Enter Amount</Label>
              <div className="flex gap-2 items-center border rounded-md p-2">
                <IndianRupee className="h-4 w-4 text-gray-600" />
                <Input
                  id="add-amt"
                  type="number"
                  value={addAmt}
                  onChange={(e) => setAddAmt(e.target.value)}
                  placeholder="10000"
                />
              </div>

              <Label htmlFor="utr">UTR / UPI / Card Ref</Label>
              <Input id="utr" placeholder="Enter transaction reference" />

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md"
                >
                  {isProcessing ? "Processing..." : "Pay"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast({ title: "Payment failed", description: "Transaction cancelled." });
                    setShowAddModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl z-50 p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">Withdraw Funds</h2>
            <p className="text-gray-500 mb-4 text-sm">Demo only. Simulated transfer.</p>

            <div className="w-72 space-y-3">
              <Label htmlFor="wd-amt">Amount</Label>
              <div className="flex gap-2 items-center border rounded-md p-2">
                <IndianRupee className="h-4 w-4 text-gray-600" />
                <Input
                  id="wd-amt"
                  type="number"
                  value={wdAmt}
                  onChange={(e) => setWdAmt(e.target.value)}
                  placeholder="5000"
                />
              </div>

              <Label htmlFor="details">Bank / UPI / Card Details</Label>
              <Input id="details" placeholder="Enter account or UPI ID" />

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleWithdraw}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                >
                  {isProcessing ? "Processing..." : "Withdraw"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast({ title: "Withdrawal cancelled" });
                    setShowWithdrawModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
