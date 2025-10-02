import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "tenant" as
      | "tenant"
      | "landlord"
      | "contractor"
      | "worker"
      | "designer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const success = await signup(userData);

      if (success) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        setError("Email already exists. Try logging in.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-black text-white">
            <UserPlus className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-black">
            Create Account
          </CardTitle>
          <CardDescription className="text-black text-sm">
            Join <span className="font-semibold">EstateHub</span> today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-lg bg-red-100 text-red-800 border border-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="rounded-lg bg-white border border-black text-black placeholder-black focus:ring-2 focus:ring-yellow-400 transition"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="rounded-lg bg-white border border-black text-black placeholder-black focus:ring-2 focus:ring-yellow-400 transition"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-black">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="rounded-lg bg-white border border-black text-black placeholder-black focus:ring-2 focus:ring-yellow-400 transition"
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-black">
                Account Type
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => handleInputChange("role", value)}
              >
                <SelectTrigger className="rounded-lg bg-white border border-black text-black focus:ring-2 focus:ring-yellow-400">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border border-black">
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="rounded-lg bg-white border border-black text-black placeholder-black pr-10 focus:ring-2 focus:ring-yellow-400 transition"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-black">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="rounded-lg bg-white border border-black text-black placeholder-black focus:ring-2 focus:ring-yellow-400 transition"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-black">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold underline text-black">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
