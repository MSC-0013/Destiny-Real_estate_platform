import { useState,useEffect  } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Wallet, MapPin, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInvest } from "@/contexts/InvestContext"; // your context for investment API
import { useAuth } from "@/contexts/AuthContext";

// Import property images
import luxuryTowerMumbai from '@/assets/invest/luxury-tower-mumbai.jpg';
import oceanViewGoa from '@/assets/invest/ocean-view-goa.jpg';
import techParkBangalore from '@/assets/invest/tech-park-bangalore.jpg';
import heritageJaipur from '@/assets/invest/heritage-jaipur.jpg';
import ecoComplexPune from '@/assets/invest/eco-complex-pune.jpg';
import waterfrontKochi from '@/assets/invest/waterfront-kochi.jpg';
import mallDelhi from '@/assets/invest/mall-delhi.jpg';
import resortShimla from '@/assets/invest/resort-shimla.jpg';
import officeHyderabad from '@/assets/invest/office-hyderabad.jpg';
import lakesideUdaipur from '@/assets/invest/lakeside-udaipur.jpg';
import towersAhmedabad from '@/assets/invest/towers-ahmedabad.jpg';
import townshipChennai from '@/assets/invest/township-chennai.jpg';
import hotelKolkata from '@/assets/invest/hotel-kolkata.jpg';

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
  type: string;
  occupancy: number;
  yearBuilt: number;
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
    image: luxuryTowerMumbai,
    type: 'Residential',
    occupancy: 92,
    yearBuilt: 2022,
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
    availableShares: 850,
    expectedReturn: 8.2,
    image: oceanViewGoa,
    type: 'Resort',
    occupancy: 88,
    yearBuilt: 2021,
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
    availableShares: 1200,
    expectedReturn: 6.8,
    image: techParkBangalore,
    type: 'Commercial',
    occupancy: 95,
    yearBuilt: 2023,
    growthData: [
      { month: 'Jan', value: 15000 },
      { month: 'Feb', value: 15300 },
      { month: 'Mar', value: 15600 },
      { month: 'Apr', value: 15900 },
      { month: 'May', value: 16200 },
      { month: 'Jun', value: 16500 },
    ]
  },
  {
    id: '4',
    name: 'Heritage Palace Hotel',
    location: 'Jaipur, Rajasthan',
    totalValue: 12000000,
    sharePrice: 12000,
    availableShares: 900,
    expectedReturn: 9.5,
    image: heritageJaipur,
    type: 'Hospitality',
    occupancy: 85,
    yearBuilt: 2019,
    growthData: [
      { month: 'Jan', value: 12000 },
      { month: 'Feb', value: 12300 },
      { month: 'Mar', value: 12700 },
      { month: 'Apr', value: 13100 },
      { month: 'May', value: 13400 },
      { month: 'Jun', value: 13800 },
    ]
  },
  {
    id: '5',
    name: 'Eco Green Complex',
    location: 'Pune, Maharashtra',
    totalValue: 8500000,
    sharePrice: 8500,
    availableShares: 1100,
    expectedReturn: 7.8,
    image: ecoComplexPune,
    type: 'Residential',
    occupancy: 90,
    yearBuilt: 2023,
    growthData: [
      { month: 'Jan', value: 8500 },
      { month: 'Feb', value: 8700 },
      { month: 'Mar', value: 8950 },
      { month: 'Apr', value: 9200 },
      { month: 'May', value: 9400 },
      { month: 'Jun', value: 9650 },
    ]
  },
  {
    id: '6',
    name: 'Marina Waterfront',
    location: 'Kochi, Kerala',
    totalValue: 9500000,
    sharePrice: 9500,
    availableShares: 950,
    expectedReturn: 8.5,
    image: waterfrontKochi,
    type: 'Residential',
    occupancy: 93,
    yearBuilt: 2022,
    growthData: [
      { month: 'Jan', value: 9500 },
      { month: 'Feb', value: 9750 },
      { month: 'Mar', value: 10000 },
      { month: 'Apr', value: 10300 },
      { month: 'May', value: 10550 },
      { month: 'Jun', value: 10850 },
    ]
  },
  {
    id: '7',
    name: 'Grand Mall & Plaza',
    location: 'Delhi NCR',
    totalValue: 18000000,
    sharePrice: 18000,
    availableShares: 1300,
    expectedReturn: 6.5,
    image: mallDelhi,
    type: 'Commercial',
    occupancy: 97,
    yearBuilt: 2020,
    growthData: [
      { month: 'Jan', value: 18000 },
      { month: 'Feb', value: 18200 },
      { month: 'Mar', value: 18500 },
      { month: 'Apr', value: 18800 },
      { month: 'May', value: 19100 },
      { month: 'Jun', value: 19500 },
    ]
  },
  {
    id: '8',
    name: 'Mountain View Resort',
    location: 'Shimla, Himachal Pradesh',
    totalValue: 6500000,
    sharePrice: 6500,
    availableShares: 800,
    expectedReturn: 9.2,
    image: resortShimla,
    type: 'Resort',
    occupancy: 82,
    yearBuilt: 2018,
    growthData: [
      { month: 'Jan', value: 6500 },
      { month: 'Feb', value: 6700 },
      { month: 'Mar', value: 6900 },
      { month: 'Apr', value: 7100 },
      { month: 'May', value: 7350 },
      { month: 'Jun', value: 7600 },
    ]
  },
  {
    id: '9',
    name: 'HITEC City Tower',
    location: 'Hyderabad, Telangana',
    totalValue: 14000000,
    sharePrice: 14000,
    availableShares: 1150,
    expectedReturn: 7.2,
    image: officeHyderabad,
    type: 'Commercial',
    occupancy: 94,
    yearBuilt: 2023,
    growthData: [
      { month: 'Jan', value: 14000 },
      { month: 'Feb', value: 14300 },
      { month: 'Mar', value: 14650 },
      { month: 'Apr', value: 15000 },
      { month: 'May', value: 15300 },
      { month: 'Jun', value: 15700 },
    ]
  },
  {
    id: '10',
    name: 'Lake Palace Villas',
    location: 'Udaipur, Rajasthan',
    totalValue: 11000000,
    sharePrice: 11000,
    availableShares: 750,
    expectedReturn: 8.8,
    image: lakesideUdaipur,
    type: 'Luxury',
    occupancy: 87,
    yearBuilt: 2021,
    growthData: [
      { month: 'Jan', value: 11000 },
      { month: 'Feb', value: 11300 },
      { month: 'Mar', value: 11600 },
      { month: 'Apr', value: 12000 },
      { month: 'May', value: 12350 },
      { month: 'Jun', value: 12750 },
    ]
  },
  {
    id: '11',
    name: 'Skyline Residency',
    location: 'Ahmedabad, Gujarat',
    totalValue: 8800000,
    sharePrice: 8800,
    availableShares: 1050,
    expectedReturn: 7.6,
    image: towersAhmedabad,
    type: 'Residential',
    occupancy: 91,
    yearBuilt: 2022,
    growthData: [
      { month: 'Jan', value: 8800 },
      { month: 'Feb', value: 9000 },
      { month: 'Mar', value: 9250 },
      { month: 'Apr', value: 9500 },
      { month: 'May', value: 9750 },
      { month: 'Jun', value: 10050 },
    ]
  },
  {
    id: '12',
    name: 'Smart City Township',
    location: 'Chennai, Tamil Nadu',
    totalValue: 13500000,
    sharePrice: 13500,
    availableShares: 1250,
    expectedReturn: 7.0,
    image: townshipChennai,
    type: 'Mixed-Use',
    occupancy: 89,
    yearBuilt: 2023,
    growthData: [
      { month: 'Jan', value: 13500 },
      { month: 'Feb', value: 13800 },
      { month: 'Mar', value: 14100 },
      { month: 'Apr', value: 14450 },
      { month: 'May', value: 14750 },
      { month: 'Jun', value: 15100 },
    ]
  },
  {
    id: '13',
    name: 'Heritage Boutique Hotel',
    location: 'Kolkata, West Bengal',
    totalValue: 7200000,
    sharePrice: 7200,
    availableShares: 900,
    expectedReturn: 8.9,
    image: hotelKolkata,
    type: 'Hospitality',
    occupancy: 86,
    yearBuilt: 2020,
    growthData: [
      { month: 'Jan', value: 7200 },
      { month: 'Feb', value: 7400 },
      { month: 'Mar', value: 7650 },
      { month: 'Apr', value: 7900 },
      { month: 'May', value: 8150 },
      { month: 'Jun', value: 8450 },
    ]
  },
];

interface Investment {
  _id?: string; 
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
  const { addInvestment, fetchInvestments, deleteInvestment } = useInvest();
  const { user } = useAuth(); // get logged-in user

useEffect(() => {
  if (!user?._id) return;

  const local = JSON.parse(localStorage.getItem('investments') || '[]').filter(Boolean);

  setInvestments(local); // show localStorage immediately

  // Fetch from backend
  fetchInvestments(user._id).then(() => {
    const backend = JSON.parse(localStorage.getItem('investments') || '[]'); // after context fetch
    const merged = [...local];

    backend.forEach((inv: Investment) => {
      if (!merged.find((l: Investment) => l._id === inv._id)) merged.push(inv);
    });

    setInvestments(merged);
    localStorage.setItem('investments', JSON.stringify(merged));
  });
}, [user]);
  const [investments, setInvestments] = useState<Investment[]>([]);
const [sellCount, setSellCount] = useState<{ [key: string]: number }>({});


  const handleBuyShares = async () => {
  if (!selectedProperty || shareCount < 1 || !user) return;

  const totalCost = selectedProperty.sharePrice * shareCount;
  const growthRate = 3.2;

  const newInvestment: Investment = {
    property_id: selectedProperty.id,
    user_id: user._id,
    property_name: selectedProperty.name,
    shares_owned: shareCount,
    total_investment: totalCost,
    date: new Date().toISOString(),
    current_value: totalCost * (1 + growthRate / 100),
    growth_percentage: growthRate,
  };

  // Check if the user already invested in this property
  const existingInvestmentIndex = investments.findIndex(
    (inv) => inv.property_id === selectedProperty.id && inv.user_id === user._id
  );

  let updatedInvestments: Investment[];
  if (existingInvestmentIndex >= 0) {
    updatedInvestments = [...investments];
    const existing = updatedInvestments[existingInvestmentIndex];
    updatedInvestments[existingInvestmentIndex] = {
      ...existing,
      shares_owned: existing.shares_owned + shareCount,
      total_investment: existing.total_investment + totalCost,
      current_value: (existing.total_investment + totalCost) * (1 + growthRate / 100),
    };
  } else {
    updatedInvestments = [...investments, newInvestment];
  }

  // Save to localStorage immediately for fast UI update
  localStorage.setItem('investments', JSON.stringify(updatedInvestments));
  setInvestments(updatedInvestments);

 try {
    const savedInvestment = await addInvestment(newInvestment);

    if (savedInvestment) {
        // Only update localStorage if backend returned a valid object
        if (existingInvestmentIndex === -1) {
            updatedInvestments[updatedInvestments.length - 1] = savedInvestment;
            localStorage.setItem('investments', JSON.stringify(updatedInvestments));
            setInvestments(updatedInvestments);
        }
        toast({
            title: 'Payment Successful!',
            description: 'Investment added to your portfolio',
        });
    } else {
        throw new Error('Backend did not return saved investment');
    }
} catch (error) {
    console.error('Error saving investment:', error); // log for debugging
    toast({
        title: 'Failed to save investment',
        description: 'Something went wrong while saving to backend.',
        variant: 'destructive',
    });
}

  setSelectedProperty(null);
  setShareCount(1);
};


const handleSellShares = async (investment: Investment) => {
  const shares = sellCount[investment.property_id] || 0;
  if (!user || shares < 1 || shares > investment.shares_owned) {
    toast({
      title: 'Invalid Share Amount',
      description: `Enter a valid number of shares to sell (max ${investment.shares_owned})`,
      variant: 'destructive',
    });
    return;
  }

  const updatedInvestments = investments.map((inv) =>
    inv.property_id === investment.property_id
      ? {
          ...inv,
          shares_owned: inv.shares_owned - shares,
          total_investment: inv.total_investment * ((inv.shares_owned - shares) / inv.shares_owned),
        }
      : inv
  ).filter(inv => inv.shares_owned > 0);

  setInvestments(updatedInvestments);
  localStorage.setItem('investments', JSON.stringify(updatedInvestments));

  try {
    await deleteInvestment(investment._id, shares); // adjust if your backend supports partial sell
    toast({
      title: 'Shares Sold',
      description: `Successfully sold ${shares} shares of ${investment.property_name}`,
    });
  } catch (error) {
    toast({
      title: 'Failed to sell shares',
      description: 'Something went wrong while updating backend.',
      variant: 'destructive',
    });
  }

  setSellCount({ ...sellCount, [investment.property_id]: 0 });
};

const handleDeleteInvestment = async (investmentId: string) => {
  // Update localStorage immediately
  const updated = investments.filter(inv => inv._id !== investmentId);
  setInvestments(updated);
  localStorage.setItem('investments', JSON.stringify(updated));

  // Delete from backend
  try {
    await deleteInvestment(investmentId); // use context function
    toast({
      title: 'Investment Removed',
      description: 'Investment deleted successfully',
    });
  } catch (error) {
    toast({
      title: 'Failed to delete investment',
      description: 'Something went wrong while deleting investment.',
      variant: 'destructive',
    });
  }
};


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalInvested = investments.reduce(
  (sum, inv) => sum + (inv?.total_investment || 0),
  0
);

const totalCurrentValue = investments.reduce(
  (sum, inv) => sum + (inv?.current_value || 0),
  0
);

  const totalGrowth = totalCurrentValue - totalInvested;
  const totalGrowthPercentage = totalInvested > 0 ? ((totalGrowth / totalInvested) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/50">
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
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="h-56 relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-primary/90 backdrop-blur-sm">{property.type}</Badge>
                  <Badge className="bg-green-500/90 backdrop-blur-sm">{property.occupancy}% Occupied</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{property.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </CardDescription>
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
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Year Built:
                    </span>
                    <span className="font-semibold">{property.yearBuilt}</span>
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
                          max={selectedProperty?.availableShares || 1}
                          value={shareCount}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 1;
                            if (val > selectedProperty?.availableShares!) val = selectedProperty.availableShares;
                            setShareCount(val);
                          }}
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
      {investments
        .filter(Boolean) // Remove any undefined/null investments
        .map((investment) =>
          investment ? (
            <Card
              key={investment._id || investment.property_id}
              className="hover:shadow-md transition-shadow p-4"
            >
              <CardHeader>
                <CardTitle className="text-lg">{investment.property_name}</CardTitle>
                <CardDescription>
                  Invested on{' '}
                  {investment.date
                    ? new Date(investment.date).toLocaleDateString()
                    : 'N/A'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shares Owned:</span>
                  <span className="font-semibold">{investment.shares_owned || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invested:</span>
                  <span className="font-semibold">
                    {formatCurrency(investment.total_investment || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Value:</span>
                  <span className="font-semibold text-green-500">
                    {formatCurrency(investment.current_value || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-muted-foreground">Growth:</span>
                  <span className="font-semibold text-green-500 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +{investment.growth_percentage || 0}%
                  </span>
                </div>
              </CardContent>

              {/* Sell input */}
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  min={1}
                  max={investment.shares_owned || 1}
                  value={sellCount[investment.property_id] || ''}
                  onChange={(e) =>
                    setSellCount({
                      ...sellCount,
                      [investment.property_id]: Number(e.target.value),
                    })
                  }
                  placeholder={`Shares to sell (max ${investment.shares_owned || 0})`}
                />
                <Button onClick={() => handleSellShares(investment)}>Sell</Button>
              </div>
            </Card>
          ) : null
        )}
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default Invest;
