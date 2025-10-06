import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "@/utils/api"; // Axios instance

// -------------------- Interfaces --------------------
export interface WorkerApplicationDetails {
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  nationality: string;
  address: { street: string; city: string; state: string; zip: string; country: string; };
  contact: { phone: string; alternatePhone?: string; email: string; };
  employmentPreferences: { position: string; startDate: string; desiredSalary: string; preferredLocations: string; overtime: boolean; weekends: boolean; employmentType: "Full-time" | "Part-time" | "Temporary/Contract"; };
  skillsAndCertifications: { skills: string[]; certifications?: string[]; safetyTraining: boolean; forkliftCertification: boolean; firstAidCertification: boolean; otherCertifications?: string; yearsExperience: number; };
  education: { highestLevel: string; institutionName?: string; fieldOfStudy?: string; };
  employmentHistory: { companyName: string; positionHeld: string; startDate: string; endDate: string; responsibilities: string; }[];
  references: { name: string; relationship: string; contact: string; }[];
  healthAndSafety: { medicalConditions?: string; canLiftHeavy: boolean; comfortableHeights: boolean; allergies?: string; };
  legalAndBackground: { legallyAllowed: boolean; convictions?: string; };
  additionalInfo: { motivation: string; achievements?: string; languages?: string[]; hobbies?: string[]; };
}

export interface ContractorApplicationDetails {
  fullName: string; companyName: string; dateOfBirth: string; gender: "Male" | "Female" | "Other";
  address: string; phone: string; email: string; website?: string; contractorType: "General" | "Subcontractor" | "Specialty";
  licenseNumber: string; licenseExpiry: string; yearsExperience: number; teamSize: number; areasOfExpertise: string;
  startDate: string; preferredLocations: string; willingToTravel: boolean; skills: string[]; certifications: string[]; insurance: string[];
  businessType: "Sole Proprietor" | "Partnership" | "LLC" | "Corp"; taxNumber: string;
  notableProjects: { projectName: string; role: string; startDate: string; endDate: string; value: string; }[];
  legalAndSafety: { legallyAllowed: boolean; previousDisputes?: string; safetyPlanTraining: boolean; healthLimitations?: string; };
  additionalInfo: { motivation: string; languagesSkillsEquipment?: string; };
}

export interface DesignerApplicationDetails {
  fullName: string; dateOfBirth: string; gender: "Male" | "Female" | "Other"; address: string; phone: string; email: string;
  portfolio?: string; positionApplied: string; startDate: string; preferredWorkType: "Full-time" | "Part-time" | "Freelance/Contract";
  expectedSalary?: string; toolsProficiency: string[]; designSkills: string[]; certifications?: string[];
  education: { highestQualification: string; fieldOfStudy?: string; institutionName?: string; };
  employmentHistory: { companyOrClient: string; role: string; startDate: string; endDate: string; achievements?: string; }[];
  portfolioSamples?: string[]; topProjects?: string[]; additionalInfo?: { languages?: string[]; hobbies?: string[]; motivation?: string; };
}

export interface JobApplication {
  id: string; // frontend-friendly ID
  role: "worker" | "contractor" | "designer";
  type: "construction" | "repair";
  applicantId: string;
  applicantName: string;
  status: "pending" | "approved" | "assigned" | "rejected";
  assignedProjectId?: string;
  createdAt: string;

  workerDetails?: WorkerApplicationDetails;
  contractorDetails?: ContractorApplicationDetails;
  designerDetails?: DesignerApplicationDetails;

  title?: string;
  description?: string;

  _id?: string; // raw MongoDB ID (optional)
}

// -------------------- Context --------------------
interface JobContextType {
  jobs: JobApplication[];
  workerApplications: JobApplication[];
  contractorApplications: JobApplication[];
  designerApplications: JobApplication[];
  applyJob: (job: Omit<JobApplication, "id" | "createdAt" | "status">) => void;
  approveJob: (jobId: string) => void;
  rejectJob: (jobId: string) => void;
  assignJob: (jobId: string, projectId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);
export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJob must be used within a JobProvider");
  return context;
};

// -------------------- Provider --------------------
export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Load jobs from backend or localStorage
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        // Map MongoDB _id to id
        const backendJobs: JobApplication[] = res.data.map((job: JobApplication) => ({
          ...job,
          id: job.id || job._id, // fallback to _id
        }));
        setJobs(backendJobs);
        localStorage.setItem("jobs", JSON.stringify(backendJobs));
      } catch {
        const savedJobs = localStorage.getItem("jobs");
        if (savedJobs) setJobs(JSON.parse(savedJobs));
      }
    };
    fetchJobs();
  }, []);

  const saveJobs = useCallback((updatedJobs: JobApplication[]) => {
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  }, []);

  const applyJob = useCallback(async (jobData: Omit<JobApplication, "id" | "createdAt" | "status">) => {
    try {
      const res = await API.post("/jobs", jobData);
      const newJob: JobApplication = { ...res.data, id: res.data.id || res.data._id };
      saveJobs([...jobs, newJob]);
    } catch {
      const newJob: JobApplication = {
        ...jobData,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      saveJobs([...jobs, newJob]);
    }
  }, [jobs, saveJobs]);

  const updateJobStatus = useCallback((jobId: string, status: "approved" | "rejected" | "assigned", projectId?: string) => {
    const updated = jobs.map(j =>
      (j.id === jobId || j._id === jobId)
        ? { ...j, status, assignedProjectId: projectId || j.assignedProjectId }
        : j
    );
    saveJobs(updated);
  }, [jobs, saveJobs]);

  const approveJob = useCallback(async (jobId: string) => {
    try {
      await API.put(`/jobs/${jobId}/approve`);
      updateJobStatus(jobId, "approved");
    } catch {
      updateJobStatus(jobId, "approved");
    }
  }, [updateJobStatus]);

  const rejectJob = useCallback(async (jobId: string) => {
    try {
      await API.put(`/jobs/${jobId}/reject`);
      updateJobStatus(jobId, "rejected");
    } catch {
      updateJobStatus(jobId, "rejected");
    }
  }, [updateJobStatus]);

  const assignJob = useCallback(async (jobId: string, projectId: string) => {
    try {
      await API.put(`/jobs/${jobId}/assign`, { projectId });
      updateJobStatus(jobId, "assigned", projectId);
    } catch {
      updateJobStatus(jobId, "assigned", projectId);
    }
  }, [updateJobStatus]);

  // Role-specific arrays
  const workerApplications = jobs.filter(j => j.role === "worker");
  const contractorApplications = jobs.filter(j => j.role === "contractor");
  const designerApplications = jobs.filter(j => j.role === "designer");

  return (
    <JobContext.Provider value={{
      jobs,
      workerApplications,
      contractorApplications,
      designerApplications,
      applyJob,
      approveJob,
      rejectJob,
      assignJob,
    }}>
      {children}
    </JobContext.Provider>
  );
};
