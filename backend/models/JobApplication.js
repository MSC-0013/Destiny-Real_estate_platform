import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    // Common
    role: { type: String, enum: ["worker", "contractor", "designer"], required: true },
    applicantId: { type: String, required: true },
    applicantName: { type: String, required: true },
    status: { type: String, default: "pending" },
    assignedProjectId: { type: String, default: "" },

    // Shared personal info
    fullName: { type: String, required: true },
    dob: { type: String },
    gender: { type: String },
    address: { type: String },
    phone: { type: String },
    altPhone: { type: String },
    email: { type: String, required: true },
    portfolio: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String },
    availability: { type: String },
    description: { type: String },
    nationality: { type: String },

    // Worker fields
    positionApplied: { type: String },
    startDate: { type: String },
    salary: { type: String },
    preferredLocation: { type: String },
    overtime: { type: Boolean, default: false },
    weekends: { type: Boolean, default: false },
    employmentType: { type: String },
    constructionSkills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    safetyTraining: { type: Boolean, default: false },
    firstAid: { type: Boolean, default: false },
    otherCertifications: { type: String },
    experienceYears: { type: String },
    educationLevel: { type: String },
    institutionName: { type: String },
    fieldOfStudy: { type: String },
    employmentHistory: { type: [Object], default: [] },
    references: { type: [Object], default: [] },
    healthConditions: { type: String },
    canLiftHeavy: { type: Boolean, default: false },
    comfortableHeights: { type: Boolean, default: false },
    allergies: { type: String },
    legalWork: { type: Boolean, default: false },
    criminalRecord: { type: Boolean, default: false },
    criminalDetails: { type: String },
    motivation: { type: String },
    languages: { type: String },
    hobbies: { type: String },

    // Contractor fields
    companyName: { type: String },
    contractorType: { type: String },
    licenseNumber: { type: String },
    licenseExpiry: { type: String },
    teamSize: { type: String },
    areasOfExpertise: { type: [String], default: [] },
    skillsServices: { type: [String], default: [] },
    insurance: { type: [String], default: [] },
    businessType: { type: String },
    taxNumber: { type: String },
    notableProjects: { type: [Object], default: [] },
    travelWillingness: { type: Boolean, default: false },
    safetyPlan: { type: Boolean, default: false },
    healthLimitations: { type: String },

    // Designer fields
    positionAppliedDesigner: { type: String },
    workType: { type: String },
    expectedSalary: { type: String },
    tools: { type: [String], default: [] },
    designSkills: { type: [String], default: [] },
    educationLevelDesigner: { type: String },
    fieldOfStudyDesigner: { type: String },
    institutionDesigner: { type: String },
    projectHistory: { type: [Object], default: [] },
    topProjects: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", JobApplicationSchema);
