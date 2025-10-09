import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "@/utils/api"; // Axios instance

// -------------------- Interfaces --------------------
export interface JobApplication {
  id: string; // frontend-friendly ID
  _id?: string; // raw MongoDB ID (optional)

  // Common
  role: "worker" | "contractor" | "designer";
  applicantId: string;
  applicantName: string;
  status: "pending" | "approved" | "assigned" | "rejected";
  assignedProjectId?: string;
  createdAt: string;

  // Shared personal info
  fullName: string;
  dob?: string;
  gender?: string;
  address?: string;
  phone?: string;
  altPhone?: string;
  email: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  availability?: string;
  description?: string;
  nationality?: string;

  // Worker fields
  positionApplied?: string;
  startDate?: string;
  salary?: string;
  preferredLocation?: string;
  overtime?: boolean;
  weekends?: boolean;
  employmentType?: string;
  constructionSkills?: string[];
  certifications?: string[];
  safetyTraining?: boolean;
  firstAid?: boolean;
  otherCertifications?: string;
  experienceYears?: string;
  educationLevel?: string;
  institutionName?: string;
  fieldOfStudy?: string;
  employmentHistory?: Record<string, any>[];
  references?: Record<string, any>[];
  healthConditions?: string;
  canLiftHeavy?: boolean;
  comfortableHeights?: boolean;
  allergies?: string;
  legalWork?: boolean;
  criminalRecord?: boolean;
  criminalDetails?: string;
  motivation?: string;
  languages?: string;
  hobbies?: string;

  // Contractor fields
  companyName?: string;
  contractorType?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  teamSize?: string;
  areasOfExpertise?: string[];
  skillsServices?: string[];
  insurance?: string[];
  businessType?: string;
  taxNumber?: string;
  notableProjects?: Record<string, any>[];
  travelWillingness?: boolean;
  safetyPlan?: boolean;
  healthLimitations?: string;

  // Designer fields
  positionAppliedDesigner?: string;
  workType?: string;
  expectedSalary?: string;
  tools?: string[];
  designSkills?: string[];
  educationLevelDesigner?: string;
  fieldOfStudyDesigner?: string;
  institutionDesigner?: string;
  projectHistory?: Record<string, any>[];
  topProjects?: string[];

  // Optional extra info
  title?: string;
  descriptionExtra?: string;
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
        // Map MongoDB _id to id for frontend
        const backendJobs: JobApplication[] = res.data.map((job: JobApplication) => ({
          ...job,
          id: job.id || job._id,
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
