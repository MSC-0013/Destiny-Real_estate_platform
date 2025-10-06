  import React, { useState } from "react";
  import { useJob } from "@/contexts/JobContext";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { useToast } from '@/hooks/use-toast';
  

  const initialFormData = {
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    altPhone: "",
    email: "",
    portfolio: "",
    linkedin: "",
    github: "",
    website: "",
    availability: "",
    description: "",
    status: "pending",
    assignedProjectId: "",
    nationality: "",
    positionApplied: "",
    startDate: "",
    salary: "",
    preferredLocation: "",
    overtime: false,
    weekends: false,
    employmentType: "",
    constructionSkills: [] as string[],
    certifications: [] as string[],
    safetyTraining: false,
    firstAid: false,
    otherCertifications: "",
    experienceYears: "",
    educationLevel: "",
    institutionName: "",
    fieldOfStudy: "",
    employmentHistory: [] as any[],
    references: [] as any[],
    healthConditions: "",
    canLiftHeavy: false,
    comfortableHeights: false,
    allergies: "",
    legalWork: false,
    criminalRecord: false,
    criminalDetails: "",
    motivation: "",
    languages: "",
    hobbies: "",
    companyName: "",
    contractorType: "",
    licenseNumber: "",
    licenseExpiry: "",
    teamSize: "",
    areasOfExpertise: "",
    skillsServices: [] as string[],
    insurance: [] as string[],
    businessType: "",
    taxNumber: "",
    notableProjects: [] as any[],
    travelWillingness: false,
    safetyPlan: false,
    healthLimitations: "",
    positionAppliedDesigner: "",
    workType: "",
    expectedSalary: "",
    tools: [] as string[],
    designSkills: [] as string[],
    educationLevelDesigner: "",
    fieldOfStudyDesigner: "",
    institutionDesigner: "",
    projectHistory: [] as any[],
    topProjects: [],
  };

  const JobApplicationForm: React.FC<{ applicantId: string; applicantName: string }> = ({ applicantId, applicantName }) => {
    const { applyJob } = useJob();
    const { toast } = useToast();

    const [role, setRole] = useState<"worker" | "contractor" | "designer">("worker");
    const [formData, setFormData] = useState<any>(initialFormData);

    const handleChange = (field: string, value: any) => {
      setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked", formData); 

    if (!formData.fullName || !formData.email) {
      return toast.error("Please fill required fields (Full Name & Email)");
    }

    applyJob({ ...formData, applicantId, applicantName, role });
    toast({
    title: "Job application submitted successfully!",
  });
    setFormData(initialFormData);
  };


    return (
      <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-xl shadow-lg max-w-5xl mx-auto bg-white">
        <h2 className="text-3xl font-bold text-center mb-6">Job Application Form</h2>

        {/* Role selection */}
        <div>
          <Label>Role</Label>
          <Select value={role} onValueChange={(val) => setRole(val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worker">Worker</SelectItem>
              <SelectItem value="contractor">Contractor</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} required />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} />
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div>
            <Label>Alternate Phone</Label>
            <Input value={formData.altPhone} onChange={(e) => handleChange("altPhone", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
          </div>
        </div>

        {/* Role-specific sections */}
        {role === "worker" && <WorkerForm formData={formData} handleChange={handleChange} />}
        {role === "contractor" && <ContractorForm formData={formData} handleChange={handleChange} />}
        {role === "designer" && <DesignerForm formData={formData} handleChange={handleChange} />}

        <Button type="submit" className="w-full py-3 text-lg mt-4">
          Submit Application
        </Button>
      </form>
    );
  };

  // ---------------------- Worker Form ----------------------
  const WorkerForm = ({ formData, handleChange }: any) => (
    <>
      <h3 className="text-xl font-semibold mt-6">Worker Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <Label>Nationality</Label>
          <Input value={formData.nationality} onChange={(e) => handleChange("nationality", e.target.value)} />
        </div>
        <div>
          <Label>Position Applied For</Label>
          <Input value={formData.positionApplied} onChange={(e) => handleChange("positionApplied", e.target.value)} />
        </div>
        <div>
          <Label>Available Start Date</Label>
          <Input type="date" value={formData.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
        </div>
        <div>
          <Label>Desired Salary</Label>
          <Input value={formData.salary} onChange={(e) => handleChange("salary", e.target.value)} />
        </div>
        <div>
          <Label>Preferred Location</Label>
          <Input value={formData.preferredLocation} onChange={(e) => handleChange("preferredLocation", e.target.value)} />
        </div>
        <div>
          <Label>Willing to Work Overtime?</Label>
          <Select value={formData.overtime ? "yes" : "no"} onValueChange={(val) => handleChange("overtime", val === "yes")}>
            <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Willing to Work Weekends?</Label>
          <Select value={formData.weekends ? "yes" : "no"} onValueChange={(val) => handleChange("weekends", val === "yes")}>
            <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Employment Type</Label>
          <Select value={formData.employmentType} onValueChange={(val) => handleChange("employmentType", val)}>
            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="temporary">Temporary / Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Construction Skills (comma separated)</Label>
  <Input
    value={formData.constructionSkills.join(",")}
    onChange={(e) =>
      handleChange("constructionSkills", e.target.value.split(",").map(s => s.trim()))
    }
  />
        </div>
        <div>
          <Label>Certifications / Licenses</Label>
          <Input value={formData.certifications} onChange={(e) => handleChange("certifications", e.target.value.split(","))} />
        </div>
        <div>
          <Label>Safety Training?</Label>
          <Select value={formData.safetyTraining ? "yes" : "no"} onValueChange={(val) => handleChange("safetyTraining", val === "yes")}>
            <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>First Aid Certification?</Label>
          <Select value={formData.firstAid ? "yes" : "no"} onValueChange={(val) => handleChange("firstAid", val === "yes")}>
            <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Other Certifications</Label>
          <Input value={formData.otherCertifications} onChange={(e) => handleChange("otherCertifications", e.target.value)} />
        </div>
        <div>
          <Label>Years of Experience</Label>
          <Input value={formData.experienceYears} onChange={(e) => handleChange("experienceYears", e.target.value)} />
        </div>
        <div>
          <Label>Education Level</Label>
          <Input value={formData.educationLevel} onChange={(e) => handleChange("educationLevel", e.target.value)} />
        </div>
        <div>
          <Label>Institution Name</Label>
          <Input value={formData.institutionName} onChange={(e) => handleChange("institutionName", e.target.value)} />
        </div>
        <div>
          <Label>Field of Study</Label>
          <Input value={formData.fieldOfStudy} onChange={(e) => handleChange("fieldOfStudy", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label>Description / About You</Label>
          <Textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
        </div>
      </div>
    </>
  );

  // ---------------------- Contractor Form ----------------------
  const ContractorForm = ({ formData, handleChange }: any) => (
    <>
      <h3 className="text-xl font-semibold mt-6">Contractor Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <Label>Company / Business Name</Label>
          <Input value={formData.companyName} onChange={(e) => handleChange("companyName", e.target.value)} />
        </div>
        <div>
          <Label>Contractor Type</Label>
          <Select value={formData.contractorType} onValueChange={(val) => handleChange("contractorType", val)}>
            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="subcontractor">Subcontractor</SelectItem>
              <SelectItem value="specialty">Specialty</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>License Number</Label>
          <Input value={formData.licenseNumber} onChange={(e) => handleChange("licenseNumber", e.target.value)} />
        </div>
        <div>
          <Label>License Expiry</Label>
          <Input type="date" value={formData.licenseExpiry} onChange={(e) => handleChange("licenseExpiry", e.target.value)} />
        </div>
        <div>
          <Label>Years of Experience</Label>
          <Input value={formData.experienceYears} onChange={(e) => handleChange("experienceYears", e.target.value)} />
        </div>
        <div>
          <Label>Team Size</Label>
          <Input value={formData.teamSize} onChange={(e) => handleChange("teamSize", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label>Areas of Expertise (comma separated)</Label>
          <Input value={formData.areasOfExpertise} onChange={(e) => handleChange("areasOfExpertise", e.target.value.split(","))} />
        </div>
      </div>
    </>
  );

  // ---------------------- Designer Form ----------------------
  const DesignerForm = ({ formData, handleChange }: any) => (
    <>
      <h3 className="text-xl font-semibold mt-6">Designer Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <Label>Portfolio / Website</Label>
          <Input value={formData.portfolio} onChange={(e) => handleChange("portfolio", e.target.value)} />
        </div>
        <div>
          <Label>Position Applied</Label>
          <Select value={formData.positionAppliedDesigner} onValueChange={(val) => handleChange("positionAppliedDesigner", val)}>
            <SelectTrigger><SelectValue placeholder="Select Position" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="graphic">Graphic Designer</SelectItem>
              <SelectItem value="uiux">UI/UX Designer</SelectItem>
              <SelectItem value="web">Web Designer</SelectItem>
              <SelectItem value="motion">Motion Designer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Available Start Date</Label>
          <Input type="date" value={formData.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
        </div>
        <div>
          <Label>Preferred Work Type</Label>
          <Select value={formData.workType} onValueChange={(val) => handleChange("workType", val)}>
            <SelectTrigger><SelectValue placeholder="Select Work Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="freelance">Freelance / Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Expected Salary / Rate</Label>
          <Input value={formData.expectedSalary} onChange={(e) => handleChange("expectedSalary", e.target.value)} />
        </div>
      </div>
    </>
  );

  export default JobApplicationForm;
