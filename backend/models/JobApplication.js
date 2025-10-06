import mongoose from "mongoose";

// -------------------- Worker Subschema --------------------
const WorkerDetailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  nationality: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  contact: {
    phone: String,
    alternatePhone: String,
    email: String,
  },
  employmentPreferences: {
    position: String,
    startDate: { type: Date },
    desiredSalary: String,
    preferredLocations: String,
    overtime: Boolean,
    weekends: Boolean,
    employmentType: { type: String, enum: ["Full-time", "Part-time", "Temporary/Contract"] },
  },
  skillsAndCertifications: {
    skills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    safetyTraining: Boolean,
    forkliftCertification: Boolean,
    firstAidCertification: Boolean,
    otherCertifications: String,
    yearsExperience: Number,
  },
  education: {
    highestLevel: String,
    institutionName: String,
    fieldOfStudy: String,
  },
  employmentHistory: [
    {
      companyName: String,
      positionHeld: String,
      startDate: Date,
      endDate: Date,
      responsibilities: String,
    },
  ],
  references: [
    {
      name: String,
      relationship: String,
      contact: String,
    },
  ],
  healthAndSafety: {
    medicalConditions: String,
    canLiftHeavy: Boolean,
    comfortableHeights: Boolean,
    allergies: String,
  },
  legalAndBackground: {
    legallyAllowed: Boolean,
    convictions: String,
  },
  additionalInfo: {
    motivation: String,
    achievements: String,
    languages: { type: [String], default: [] },
    hobbies: { type: [String], default: [] },
  },
});

// -------------------- Contractor Subschema --------------------
const ContractorDetailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  companyName: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  address: String,
  phone: String,
  email: String,
  website: String,
  contractorType: { type: String, enum: ["General", "Subcontractor", "Specialty"] },
  licenseNumber: String,
  licenseExpiry: Date,
  yearsExperience: Number,
  teamSize: Number,
  areasOfExpertise: { type: [String], default: [] },
  startDate: Date,
  preferredLocations: String,
  willingToTravel: Boolean,
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  insurance: { type: [String], default: [] },
  businessType: { type: String, enum: ["Sole Proprietor", "Partnership", "LLC", "Corp"] },
  taxNumber: String,
  notableProjects: [
    {
      projectName: String,
      role: String,
      startDate: Date,
      endDate: Date,
      value: String,
    },
  ],
  legalAndSafety: {
    legallyAllowed: Boolean,
    previousDisputes: String,
    safetyPlanTraining: Boolean,
    healthLimitations: String,
  },
  additionalInfo: {
    motivation: String,
    languagesSkillsEquipment: String,
  },
});

// -------------------- Designer Subschema --------------------
const DesignerDetailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  address: String,
  phone: String,
  email: String,
  portfolio: String,
  positionApplied: String,
  startDate: Date,
  preferredWorkType: { type: String, enum: ["Full-time", "Part-time", "Freelance/Contract"] },
  expectedSalary: String,
  toolsProficiency: { type: [String], default: [] },
  designSkills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  education: {
    highestQualification: String,
    fieldOfStudy: String,
    institutionName: String,
  },
  employmentHistory: [
    {
      companyOrClient: String,
      role: String,
      startDate: Date,
      endDate: Date,
      achievements: String,
    },
  ],
  portfolioSamples: { type: [String], default: [] },
  topProjects: { type: [String], default: [] },
  additionalInfo: {
    languages: { type: [String], default: [] },
    hobbies: { type: [String], default: [] },
    motivation: String,
  },
});

// -------------------- Main JobApplication Schema --------------------
const JobApplicationSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["worker", "contractor", "designer"], required: true },
    type: { type: String, enum: ["construction", "repair"], required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicantName: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "assigned", "rejected"], default: "pending" },
    assignedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: "ConstructionProject", default: null },
    workerDetails: WorkerDetailsSchema,
    contractorDetails: ContractorDetailsSchema,
    designerDetails: DesignerDetailsSchema,
    title: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", JobApplicationSchema);
