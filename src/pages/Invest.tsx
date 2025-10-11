import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, TrendingUp, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Property {
  id: string;
  name: string;
  location: string;
  totalValue: number;
  sharePrice: number;
  availableShares: number;
  expectedReturn: number;
  image: string;
  growthData: { month: string; value: number }[];
}

const properties: Property[] = [
  {
    id: '1',
    name: 'Luxury Downtown Tower',
    location: 'Mumbai, Maharashtra',
    totalValue: 10000000,
    sharePrice: 10000,
    availableShares: 1000,
    expectedReturn: 7.5,
    image: '/placeholder.svg',
    growthData: [
      { month: 'Jan', value: 10000 },
      { month: 'Feb', value: 10200 },
      { month: 'Mar', value: 10500 },
      { month: 'Apr', value: 10800 },
      { month: 'May', value: 11000 },
      { month: 'Jun', value: 11500 },
    ]
  },
  {
    id: '2',
    name: 'Ocean View Residency',
    location: 'Goa',
    totalValue: 7500000,
    sharePrice: 7500,
    availableShares: 1000,
    expectedReturn: 8.2,
    image: '/placeholder.svg',
    growthData: [
      { month: 'Jan', value: 7500 },
      { month: 'Feb', value: 7650 },
      { month: 'Mar', value: 7800 },
      { month: 'Apr', value: 8000 },
      { month: 'May', value: 8200 },
      { month: 'Jun', value: 8500 },
    ]
  },
  {
    id: '3',
    name: 'Tech Park Plaza',
    location: 'Bangalore, Karnataka',
    totalValue: 15000000,
    sharePrice: 15000,
    availableShares: 1000,
    expectedReturn: 6.8,
    image: '/placeholder.svg',
    growthData: [
      { month: 'Jan', value: 15000 },
      { month: 'Feb', value: 15300 },
      { month: 'Mar', value: 15600 },
      { month: 'Apr', value: 15900 },
      { month: 'May', value: 16200 },
      { month: 'Jun', value: 16500 },
    ]
  },
];

interface Investment {
  property_id: string;
  user_id: string;
  property_name: string;
  shares_owned: number;
  total_investment: number;
  date: string;
  current_value: number;
  growth_percentage: number;
}

const Invest = () => {
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [shareCount, setShareCount] = useState(1);
  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('investments');
    return saved ? JSON.parse(saved) : [];
  });

  const handleBuyShares = () => {
    if (!selectedProperty || shareCount < 1) return;

    const totalCost = selectedProperty.sharePrice * shareCount;
    const newInvestment: Investment = {
      property_id: selectedProperty.id,
      user_id: 'current-user', // Replace with actual user ID from auth
      property_name: selectedProperty.name,
      shares_owned: shareCount,
      total_investment: totalCost,
      date: new Date().toISOString(),
      current_value: totalCost * 1.032, // Simulate 3.2% growth
      growth_percentage: 3.2,
    };

    const existingInvestmentIndex = investments.findIndex(
      inv => inv.property_id === selectedProperty.id
    );

    let updatedInvestments;
    if (existingInvestmentIndex >= 0) {
      updatedInvestments = [...investments];
      updatedInvestments[existingInvestmentIndex] = {
        ...updatedInvestments[existingInvestmentIndex],
        shares_owned: updatedInvestments[existingInvestmentIndex].shares_owned + shareCount,
        total_investment: updatedInvestments[existingInvestmentIndex].total_investment + totalCost,
        current_value: (updatedInvestments[existingInvestmentIndex].total_investment + totalCost) * 1.032,
      };
    } else {
      updatedInvestments = [...investments, newInvestment];
    }

    localStorage.setItem('investments', JSON.stringify(updatedInvestments));
    setInvestments(updatedInvestments);

    toast({
      title: 'Payment Successful!',
      description: 'Investment added to your portfolio',
    });

    setShareCount(1);
    setSelectedProperty(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.total_investment, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalGrowth = totalCurrentValue - totalInvested;
  const totalGrowthPercentage = totalInvested > 0 ? ((totalGrowth / totalInvested) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Investment Opportunities
          </h1>
          <p className="text-muted-foreground">Invest in premium real estate properties and earn passive income</p>
        </div>

        {/* Portfolio Summary */}
        {investments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
                  </div>
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Growth</p>
                    <p className="text-2xl font-bold text-green-500">+{totalGrowthPercentage}%</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Available Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Building2 className="h-20 w-20 text-primary/40" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{property.name}</CardTitle>
                <CardDescription>{property.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Value:</span>
                    <span className="font-semibold">{formatCurrency(property.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Share Price:</span>
                    <span className="font-semibold">{formatCurrency(property.sharePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Shares:</span>
                    <span className="font-semibold">{property.availableShares}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Annual Return:</span>
                    <span className="font-semibold text-green-500">{property.expectedReturn}%</span>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={property.growthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                      onClick={() => setSelectedProperty(property)}
                    >
                      Buy Shares
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invest in {property.name}</DialogTitle>
                      <DialogDescription>
                        Enter the number of shares you want to purchase
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="shares">Number of Shares</Label>
                        <Input
                          id="shares"
                          type="number"
                          min="1"
                          max={property.availableShares}
                          value={shareCount}
                          onChange={(e) => setShareCount(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Share Price:</span>
                          <span className="font-semibold">{formatCurrency(property.sharePrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Quantity:</span>
                          <span className="font-semibold">{shareCount}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(property.sharePrice * shareCount)}</span>
                        </div>
                      </div>
                      <Button className="w-full" onClick={handleBuyShares}>
                        Confirm Purchase
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Investments */}
        {investments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Investments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investments.map((investment, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{investment.property_name}</CardTitle>
                    <CardDescription>
                      Invested on {new Date(investment.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shares Owned:</span>
                      <span className="font-semibold">{investment.shares_owned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Invested:</span>
                      <span className="font-semibold">{formatCurrency(investment.total_investment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Value:</span>
                      <span className="font-semibold text-green-500">{formatCurrency(investment.current_value)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-muted-foreground">Growth:</span>
                      <span className="font-semibold text-green-500 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +{investment.growth_percentage}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invest;
