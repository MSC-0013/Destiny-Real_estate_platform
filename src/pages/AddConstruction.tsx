import React, { useState } from "react";
import { useConstruction } from "@/contexts/ConstructionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useLocation } from "react-router-dom";

interface ConstructionRequest {
  clientName: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  floors: string;
  budget: string;
  timeline: string;
  description: string;
  requirements: string[];
  designImages: string[];
}

const AddConstruction = () => {
  const { addProject } = useConstruction();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const constructionRequest = location.state?.constructionRequest;

  const [formData, setFormData] = useState<ConstructionRequest>({
    clientName: constructionRequest?.clientName || user?.name || "",
    email: constructionRequest?.email || user?.email || "",
    phone: constructionRequest?.phone || user?.phone || "",
    projectType: constructionRequest?.projectType || "",
    location: constructionRequest?.location || "",
    area: constructionRequest?.area || "",
    bedrooms: constructionRequest?.bedrooms || "",
    bathrooms: constructionRequest?.bathrooms || "",
    floors: constructionRequest?.floors || "1",
    budget: constructionRequest?.budgetRange || (constructionRequest as any)?.budget || "",
    timeline: constructionRequest?.timeline || "",
    description: constructionRequest?.description || "",
    requirements: constructionRequest?.requirements || [],
    designImages: constructionRequest?.designImages || [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newRequirement, setNewRequirement] = useState("");

  const handleAddRequirement = () => {
    if (newRequirement.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, newRequirement.trim()],
    }));
    setNewRequirement("");
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.clientName) newErrors.clientName = "Client name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.projectType) newErrors.projectType = "Project type is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add project to context
    await addProject({
      ...formData,
      title: formData.projectType + " Project",
      clientId: user?._id || "unknown",
      clientName: user?.name || "Unknown",
      projectType: formData.projectType as "residential" | "commercial" | "renovation" | "interior",
      status: "pending",
      phase: "planning",
      estimatedCost: Number(formData.budget) || 0,
      workers: [],
      blueprints: [],
      progressImages: formData.designImages,
      address: formData.location,
    });

    navigate("/construction");
  };

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4">Start New Construction Project</h1>

          <div className="space-y-4">
            <Input
              placeholder="Client Name"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
            {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName}</p>}

            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <Select
              value={formData.projectType}
              onValueChange={(value) => setFormData({ ...formData, projectType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="renovation">Renovation</SelectItem>
                <SelectItem value="interior">Interior</SelectItem>
              </SelectContent>
            </Select>
            {errors.projectType && <p className="text-red-500 text-sm">{errors.projectType}</p>}

            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

            <Input
              placeholder="Area (sq ft)"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />

            <Input
              placeholder="Bedrooms"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            />

            <Input
              placeholder="Bathrooms"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            />

            <Input
              placeholder="Floors"
              type="number"
              value={formData.floors}
              onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
            />

            <Input
              placeholder="Budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />

            <Input
              placeholder="Timeline (e.g., 6 months)"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            />

            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

            {/* Requirements Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add Requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
              />
              <Button onClick={handleAddRequirement}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((req, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                  {req}
                </span>
              ))}
            </div>

            <Button
              className="bg-black hover:bg-gray-800 w-full text-white font-semibold"
              onClick={handleSubmit}
            >
              Create Project
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddConstruction;
