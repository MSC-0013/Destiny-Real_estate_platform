import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet as WalletIcon, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

export default function WalletCard() {
  const { balance, addFunds, withdraw } = useWallet();
  const [addAmt, setAddAmt] = useState<string>("");
  const [wdAmt, setWdAmt] = useState<string>("");

  return (
    <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">Wallet Balance</CardTitle>
        <WalletIcon className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Add Money</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                  <DialogDescription>Demo only. No real payment processed.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="add-amt">Amount</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 rounded-md border px-3"><IndianRupee className="h-4 w-4" /></div>
                    <Input id="add-amt" type="number" value={addAmt} onChange={(e) => setAddAmt(e.target.value)} placeholder="10000" />
                  </div>
                  <Button className="w-full" onClick={() => addAmt && addFunds(parseFloat(addAmt))}>Add</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Withdraw</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw to Bank</DialogTitle>
                  <DialogDescription>Demo only. Simulates bank withdrawal.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="wd-amt">Amount</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 rounded-md border px-3"><IndianRupee className="h-4 w-4" /></div>
                    <Input id="wd-amt" type="number" value={wdAmt} onChange={(e) => setWdAmt(e.target.value)} placeholder="5000" />
                  </div>
                  <Button className="w-full" onClick={() => wdAmt && withdraw(parseFloat(wdAmt))}>Withdraw</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
