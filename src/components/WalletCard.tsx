import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet as WalletIcon, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
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
  const { balance, addFunds, withdraw, addFromInvestmentSale, isLoading } = useWallet();
  const { toast } = useToast();

  const [addAmt, setAddAmt] = useState<string>("");
  const [wdAmt, setWdAmt] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      toast({
        title: "Payment Failed",
        description: "Time expired. Please try again.",
        variant: "destructive",
      });
      setShowAddModal(false);
      setTimerActive(false);
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  const startTimer = () => {
    setTimeLeft(300);
    setTimerActive(true);
  };

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
    setTimerActive(false);
    setTimeout(async () => {
      setIsProcessing(false);
      await addFunds(parseFloat(addAmt));
      toast({ title: "Payment Successful", description: "Funds added successfully." });
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
      await withdraw(parseFloat(wdAmt));
      toast({ title: "Withdrawal Successful", description: "Funds withdrawn successfully." });
      setShowWithdrawModal(false);
    }, 2000);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ Example usage for investment sale:
  // addFromInvestmentSale(current_value);
  // You should call this in your InvestmentCard or wherever the sale is successful.

  return (
    <Card className="mb-8 border border-gray-800 bg-gradient-to-br from-black via-zinc-900 to-gray-950 shadow-xl rounded-2xl p-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-semibold text-white">Wallet Balance</CardTitle>
        <WalletIcon className="h-6 w-6 text-green-400" />
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold text-green-300">{formatCurrency(balance)}</div>
          <div className="flex gap-3">
            <Button
              disabled={isLoading}
              onClick={() => {
                setShowAddModal(true);
                startTimer();
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg hover:scale-105 transition-all"
            >
              Add Money
            </Button>

            <Button
              disabled={isLoading}
              onClick={() => setShowWithdrawModal(true)}
              variant="outline"
              className="border-green-400 text-green-300 hover:bg-green-950"
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
            className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center rounded-2xl z-50 p-6 border border-gray-700 shadow-[0_0_25px_#00ff99aa]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-semibold mb-2 text-green-300">Add Money</h2>
            <p className="text-gray-400 mb-4 text-sm">Scan to pay before timer ends</p>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl mb-4 w-72 text-center border border-green-700 shadow-inner"
            >
              <p className="text-sm font-medium mb-2 text-gray-300">Scan this QR to Pay</p>
              <div className="h-40 w-40 mx-auto bg-white flex items-center justify-center rounded-lg shadow-[0_0_15px_#00ff99]">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=demo@upi&pn=DemoUser&am=500"
                  alt="QR Code"
                  className="rounded-md"
                />
              </div>
            </motion.div>

            <div className="text-green-400 mb-3 font-mono text-sm">
              ⏳ Time left: {formatTime(timeLeft)}
            </div>

            <div className="w-72 space-y-3">
              <Label htmlFor="add-amt" className="text-gray-300">
                Enter Amount
              </Label>
              <div className="flex gap-2 items-center border border-gray-700 rounded-md p-2 bg-black/40">
                <IndianRupee className="h-4 w-4 text-green-400" />
                <Input
                  id="add-amt"
                  type="number"
                  value={addAmt}
                  onChange={(e) => setAddAmt(e.target.value)}
                  placeholder="10000"
                  className="bg-transparent text-gray-200 border-none focus:ring-0"
                />
              </div>

              <Label htmlFor="utr" className="text-gray-300">
                UTR / Transaction Ref
              </Label>
              <Input
                id="utr"
                placeholder="Enter transaction reference"
                className="bg-black/40 border-gray-700 text-gray-200"
              />

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || timeLeft <= 0}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-700 text-white shadow-md hover:scale-105"
                >
                  {isProcessing ? "Processing..." : "Pay"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => {
                    toast({ title: "Payment Cancelled", description: "Transaction aborted." });
                    setShowAddModal(false);
                    setTimerActive(false);
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
            className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center rounded-2xl z-50 p-6 border border-gray-700 shadow-[0_0_25px_#00ccffaa]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-semibold mb-2 text-blue-300">Withdraw Funds</h2>
            <p className="text-gray-400 mb-4 text-sm">Enter your bank or UPI details</p>

            <div className="w-72 space-y-3">
              <Label htmlFor="wd-amt" className="text-gray-300">
                Amount
              </Label>
              <div className="flex gap-2 items-center border border-gray-700 rounded-md p-2 bg-black/40">
                <IndianRupee className="h-4 w-4 text-blue-400" />
                <Input
                  id="wd-amt"
                  type="number"
                  value={wdAmt}
                  onChange={(e) => setWdAmt(e.target.value)}
                  placeholder="5000"
                  className="bg-transparent text-gray-200 border-none focus:ring-0"
                />
              </div>

              <Label htmlFor="details" className="text-gray-300">
                Bank / UPI Details
              </Label>
              <Input
                id="details"
                placeholder="Enter account or UPI ID"
                className="bg-black/40 border-gray-700 text-gray-200"
              />

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleWithdraw}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md hover:scale-105"
                >
                  {isProcessing ? "Processing..." : "Withdraw"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => {
                    toast({ title: "Withdrawal Cancelled" });
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
