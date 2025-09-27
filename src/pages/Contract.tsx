import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useProperty } from '@/contexts/PropertyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  IndianRupee, 
  FileText, 
  Shield, 
  Calendar,
  MapPin,
  User,
  CreditCard,
  Check,
  AlertTriangle,
  Home
} from 'lucide-react';

const Contract = () => {
  const { id, type } = useParams<{ id: string; type: 'buy' | 'rent' }>();
  const navigate = useNavigate();
  const { getProperty, updateProperty } = useProperty();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    idType: 'aadhar',
    duration: '1year',
    customDuration: '',
    paymentMethod: 'upi',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    termsAccepted: false,
    kycAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!id || !type || (type !== 'buy' && type !== 'rent')) {
    return <Navigate to="/properties" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const property = getProperty(id);

  if (!property || !property.available) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Property Not Available</h1>
            <p className="text-muted-foreground">This property is no longer available for {type === 'buy' ? 'purchase' : 'rent'}.</p>
            <Button onClick={() => navigate('/properties')} className="mt-4">
              Browse Properties
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const calculateTotal = () => {
    let baseAmount = property.price;
    let securityDeposit = 0;
    let processingFee = 2500; // ₹2,500 processing fee

    if (type === 'rent') {
      const months = getDurationInMonths();
      baseAmount = property.price * months;
      securityDeposit = property.price * 2; // 2 months security deposit
    }

    return {
      baseAmount,
      securityDeposit,
      processingFee,
      total: baseAmount + securityDeposit + processingFee
    };
  };

  const getDurationInMonths = () => {
    if (formData.duration === 'custom' && formData.customDuration) {
      return parseInt(formData.customDuration);
    }
    
    switch (formData.duration) {
      case '1month': return 1;
      case '6months': return 6;
      case '1year': return 12;
      case '2years': return 24;
      case '5years': return 60;
      case '10years': return 120;
      default: return 12;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted || !formData.kycAccepted) {
      toast({
        title: "Please accept all terms",
        description: "You must accept the terms and conditions and KYC verification.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update property as unavailable
      updateProperty(id, { available: false });

      // Create contract record (in real app, this would be stored in database)
      const contractData = {
        propertyId: id,
        userId: user.id,
        type,
        duration: type === 'rent' ? getDurationInMonths() : undefined,
        amount: calculateTotal().total,
        signedAt: new Date().toISOString(),
        ...formData
      };
      
      // Store contract in localStorage (for demo purposes)
      const contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
      contracts.push({ id: Date.now().toString(), ...contractData });
      localStorage.setItem('contracts', JSON.stringify(contracts));

      toast({
        title: "Contract Signed Successfully!",
        description: `You have successfully ${type === 'buy' ? 'purchased' : 'rented'} ${property.title}.`,
      });

      navigate('/orders');
    } catch (error) {
      toast({
        title: "Contract Failed",
        description: "There was an error processing your contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const costs = calculateTotal();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Contract</h1>
          <p className="text-muted-foreground">
            {type === 'buy' ? 'Purchase Agreement' : 'Rental Agreement'} for {property.title}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-px mx-2 ${
                    step > stepNum ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="idType">ID Type</Label>
                        <Select value={formData.idType} onValueChange={(value) => setFormData(prev => ({ ...prev, idType: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="pan">PAN Card</SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="license">Driving License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        value={formData.idNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                        placeholder="Enter ID number"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Current Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your current address"
                        required
                      />
                    </div>

                    {type === 'rent' && (
                      <div>
                        <Label htmlFor="duration">Rental Duration</Label>
                        <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1month">1 Month</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="1year">1 Year</SelectItem>
                            <SelectItem value="2years">2 Years</SelectItem>
                            <SelectItem value="5years">5 Years</SelectItem>
                            <SelectItem value="10years">10 Years</SelectItem>
                            <SelectItem value="custom">Custom Duration</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {formData.duration === 'custom' && (
                          <Input
                            className="mt-2"
                            type="number"
                            placeholder="Enter months (1-120)"
                            min="1"
                            max="120"
                            value={formData.customDuration}
                            onChange={(e) => setFormData(prev => ({ ...prev, customDuration: e.target.value }))}
                          />
                        )}
                      </div>
                    )}

                    <Button type="button" onClick={() => setStep(2)} className="w-full">
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Payment Method</Label>
                      <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI Payment</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="netbanking">Net Banking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.paymentMethod === 'upi' && (
                      <div>
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          value={formData.upiId}
                          onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                          placeholder="example@paytm"
                          required
                        />
                      </div>
                    )}

                    {formData.paymentMethod === 'card' && (
                      <>
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                              placeholder="123"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => setStep(3)} className="flex-1">
                        Review Contract
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Contract Review & Signature */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Contract Review & Signature
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contract Terms */}
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-muted/30">
                      <h4 className="font-semibold mb-2">
                        {type === 'buy' ? 'PROPERTY PURCHASE AGREEMENT' : 'PROPERTY RENTAL AGREEMENT'}
                      </h4>
                      
                      <div className="text-sm space-y-2 text-muted-foreground">
                        <p><strong>Property:</strong> {property.title}</p>
                        <p><strong>Address:</strong> {property.address}</p>
                        <p><strong>Buyer/Tenant:</strong> {formData.fullName}</p>
                        <p><strong>Seller/Landlord:</strong> {property.sellerName}</p>
                        {type === 'rent' && <p><strong>Duration:</strong> {getDurationInMonths()} months</p>}
                        
                        <Separator className="my-4" />
                        
                        <p className="font-medium">Terms and Conditions:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>This agreement is legally binding upon signature by both parties.</li>
                          <li>All payments must be made as per the agreed schedule.</li>
                          {type === 'rent' && (
                            <>
                              <li>Security deposit is refundable upon satisfactory completion of tenancy.</li>
                              <li>Monthly rent is due on the 1st of each month.</li>
                              <li>Property must be maintained in good condition.</li>
                            </>
                          )}
                          {type === 'buy' && (
                            <>
                              <li>Property ownership will transfer upon full payment clearance.</li>
                              <li>All legal documents will be provided within 30 days.</li>
                              <li>Property is sold in as-is condition.</li>
                            </>
                          )}
                          <li>Both parties agree to dispute resolution through arbitration.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Acceptance Checkboxes */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="kyc"
                          checked={formData.kycAccepted}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, kycAccepted: !!checked }))}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="kyc" className="text-sm font-medium">
                            KYC Verification Consent
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I consent to KYC verification and provide accurate identification documents.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: !!checked }))}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="terms" className="text-sm font-medium">
                            Terms and Conditions
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I have read and agree to all terms and conditions of this {type === 'buy' ? 'purchase' : 'rental'} agreement.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={loading || !formData.termsAccepted || !formData.kycAccepted}
                      >
                        {loading ? 'Processing...' : `Sign Contract & ${type === 'buy' ? 'Purchase' : 'Rent'}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Property Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <img
                    src={property.images[0] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Cost Breakdown</h4>
                  
                  <div className="flex justify-between text-sm">
                    <span>{type === 'buy' ? 'Property Price' : `Rent (${getDurationInMonths()} months)`}</span>
                    <span>₹{costs.baseAmount.toLocaleString()}</span>
                  </div>
                  
                  {type === 'rent' && (
                    <div className="flex justify-between text-sm">
                      <span>Security Deposit</span>
                      <span>₹{costs.securityDeposit.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>₹{costs.processingFee.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {costs.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {type === 'rent' && (
                  <>
                    <Separator />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{getDurationInMonths()} months rental period</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment processed by Destiny</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contract;