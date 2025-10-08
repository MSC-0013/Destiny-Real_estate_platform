// -------------------- ConstructionContext.tsx --------------------
import React, { createContext, useContext, useState, useEffect } from "react";
import { openDB, DBSchema } from "idb";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// -------------------- API Config --------------------
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// -------------------- Interfaces --------------------
export interface ConstructionProject {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  location: string;
  address: string;
  projectType: "residential" | "commercial" | "renovation" | "interior";
  status: "pending" | "approved" | "in-progress" | "completed" | "cancelled";
  phase:
  | "planning"
  | "foundation"
  | "structure"
  | "interior"
  | "finishing"
  | "completed";
  startDate?: string;
  endDate?: string;
  estimatedCost: number;
  actualCost?: number;
  contractorId?: string;
  contractorName?: string;
  designerId?: string;
  designerName?: string;
  workers?: string[];
  blueprints?: string[];
  progressImages?: string[];
  tasks: Task[];
  materials: Material[];
  payments: Payment[];
  requests: ApprovalRequest[];
  adminId?: string;
}

export interface Task {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  assignedTo: string;
  assigneeName: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  startDate?: string;
  endDate?: string;
  completedAt?: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier: string;
  purchasedAt?: string;
}

export interface Payment {
  id: string;
  amount: number;
  type: "advance" | "milestone" | "final";
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  paidAt?: string;
  description: string;
}

export interface ApprovalRequest {
  id: string;
  type: "project" | "task" | "material" | "payment";
  targetId: string;
  requestedBy: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface RepairRequest {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  projectType: "residential" | "commercial" | "renovation" | "interior";
  urgency: "low" | "medium" | "high";
  attachments?: File[];
  estimatedCost?: number;
  status: "pending" | "approved" | "in-progress" | "completed" | "rejected";
  createdAt: string;
  adminId?: string;
}

// -------------------- Context Type --------------------
interface ConstructionContextType {
  projects: ConstructionProject[];
  addProject: (
    project: Omit<
      ConstructionProject,
      | "id"
      | "createdAt"
      | "actualCost"
      | "tasks"
      | "materials"
      | "payments"
      | "requests"
    >
  ) => Promise<void>;
  updateProject: (id: string, updates: Partial<ConstructionProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => ConstructionProject | undefined;
  addTask: (projectId: string, task: Omit<Task, "id" | "projectId">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addMaterial: (projectId: string, material: Omit<Material, "id" | "totalCost">) => void;
  addPayment: (projectId: string, payment: Omit<Payment, "id">) => void;
  getProjectsByRole: (userId: string, role: string) => ConstructionProject[];
  requestApproval: (
    projectId: string,
    request: Omit<ApprovalRequest, "id" | "createdAt" | "status">
  ) => void;
  approveRequest: (projectId: string, requestId: string, approve: boolean) => void;
  repairRequests: RepairRequest[];
  addRepairRequest: (request: Omit<RepairRequest, "id" | "createdAt" | "status">) => void;
  approveRepairRequest: (id: string) => void;
  rejectRepairRequest: (id: string) => void;
  constructionRequests: ApprovalRequest[];
  approveConstructionRequest: (id: string) => void;
  rejectConstructionRequest: (id: string) => void;
  updateProjectMaterials: (projectId: string, materials: Material[]) => void;
}

// -------------------- Context --------------------
const ConstructionContext = createContext<ConstructionContextType | undefined>(undefined);
export const useConstruction = () => {
  const context = useContext(ConstructionContext);
  if (!context) throw new Error("useConstruction must be used within a ConstructionProvider");
  return context;
};

// -------------------- IndexedDB Setup --------------------
interface ConstructionDB extends DBSchema {
  projects: { key: string; value: ConstructionProject };
}
const dbPromise = openDB<ConstructionDB>("construction-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("projects")) {
      db.createObjectStore("projects", { keyPath: "id" });
    }
  },
});

// -------------------- Provider --------------------
export const ConstructionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [constructionRequests, setConstructionRequests] = useState<ApprovalRequest[]>([]);

  // Load data from LocalStorage / IndexedDB
  useEffect(() => {
    const loadData = async () => {
      const db = await dbPromise;

      // Projects
      const allProjects = await db.getAll("projects");
      if (allProjects.length > 0) {
        setProjects(allProjects);
        localStorage.setItem("constructionProjects", JSON.stringify(allProjects));
      } else {
        const tx = db.transaction("projects", "readwrite");
        for (const proj of []) tx.store.put(proj); // replace [] with sampleProjects if needed
        await tx.done;
      }

      // Repair Requests
      const savedRepairRequests = localStorage.getItem("repairRequests");
      if (savedRepairRequests) {
        const parsed = JSON.parse(savedRepairRequests) as RepairRequest[];
        setRepairRequests(parsed);
      }

      // Construction Requests
      const savedConstructionRequests = localStorage.getItem("constructionRequests");
      if (savedConstructionRequests) {
        const parsed = JSON.parse(savedConstructionRequests) as ApprovalRequest[];
        setConstructionRequests(parsed);
      }
    };
    loadData();
  }, []);

  // -------------------- Save Helpers --------------------
  const saveProjects = async (updated: ConstructionProject[]) => {
    setProjects(updated);
    localStorage.setItem("constructionProjects", JSON.stringify(updated));
    const db = await dbPromise;
    const tx = db.transaction("projects", "readwrite");
    for (const project of updated) await tx.store.put(project);
    await tx.done;
  };

  const saveRepairRequests = async (requests: RepairRequest[]) => {
    setRepairRequests(requests);
    localStorage.setItem("repairRequests", JSON.stringify(requests));
  };

  const saveConstructionRequests = (requests: ApprovalRequest[]) => {
    setConstructionRequests(requests);
    localStorage.setItem("constructionRequests", JSON.stringify(requests));
  };

  // -------------------- CRUD with Backend Sync --------------------
  const addProject = async (project: Omit<ConstructionProject, "id" | "createdAt" | "actualCost" | "tasks" | "materials" | "payments" | "requests">) => {
    try {
      const payload = {
        title: project.title,
        description: project.description,
        clientId: project.clientId,
        clientName: project.clientName,
        location: project.location,
        address: project.address,
        projectType: project.projectType, // Must match backend enum
        status: project.status || "pending",
        phase: project.phase || "planning",
        startDate: project.startDate,
        endDate: project.endDate,
        estimatedCost: project.estimatedCost,
        contractorId: project.contractorId,
        contractorName: project.contractorName,
        designerId: project.designerId,
        designerName: project.designerName,
        workers: project.workers || [],
        blueprints: project.blueprints || [],
        progressImages: project.progressImages || [],
        adminId: project.adminId,
      };

      const res = await API.post("/construction/projects", payload);

      // Update frontend state & localStorage
      setProjects(prev => [...prev, res.data]);
      localStorage.setItem("projects", JSON.stringify([...projects, res.data]));
    } catch (error) {
      console.error("Failed to add project:", error.response?.data || error.message);
    }
  };


  const updateProject = async (id: string, updates: Partial<ConstructionProject>) => {
    const updatedProjects = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    await saveProjects(updatedProjects);

    const project = updatedProjects.find((p) => p.id === id);
    if (project) {
      try {
        await API.put(`/construction/projects/${id}`, project);
      } catch (error) {
        console.error("Backend updateProject error:", error);
      }
    }
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    await saveProjects(updated);

    try {
      await API.delete(`/construction/projects/${id}`);
    } catch (error) {
      console.error("Backend deleteProject error:", error);
    }
  };

  const getProject = (id: string) => projects.find((p) => p.id === id);

  // -------------------- Tasks --------------------
  const addTask = async (projectId: string, task: Omit<Task, "id" | "projectId">) => {
    const newTask: Task = { ...task, id: Date.now().toString(), projectId };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
    );
    await saveProjects(updated);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updated = projects.map((p) => ({
      ...p,
      tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
    await saveProjects(updated);
  };

  // -------------------- Materials --------------------
  const addMaterial = async (projectId: string, material: Omit<Material, "id" | "totalCost">) => {
    const newMaterial: Material = {
      ...material,
      id: Date.now().toString(),
      totalCost: material.quantity * material.unitCost,
    };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, materials: [...p.materials, newMaterial] } : p
    );
    await saveProjects(updated);
  };

  // -------------------- Payments --------------------
  const addPayment = async (projectId: string, payment: Omit<Payment, "id">) => {
    const newPayment: Payment = { ...payment, id: Date.now().toString() };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, payments: [...p.payments, newPayment] } : p
    );
    await saveProjects(updated);
  };

  // -------------------- Projects by Role --------------------
  const getProjectsByRole = (userId: string, role: string) => {
    if (role === "admin") return projects;
    return projects.filter(
      (p) =>
        p.clientId === userId ||
        p.contractorId === userId ||
        p.designerId === userId ||
        p.workers?.includes(userId)
    );
  };

  // -------------------- Approval Requests --------------------
  const requestApproval = (
    projectId: string,
    request: Omit<ApprovalRequest, "id" | "createdAt" | "status">
  ) => {
    const newRequest: ApprovalRequest = {
      ...request,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, requests: [...(p.requests || []), newRequest] } : p
    );
    saveProjects(updated);
  };

  const approveRequest = async (projectId: string, requestId: string, approve: boolean) => {
    const status = approve ? "approved" : "rejected";
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const updatedReq = p.requests?.map((r) =>
        r.id === requestId ? { ...r, status: status as "approved" | "rejected" | "pending" } : r
      );
      return { ...p, requests: updatedReq || [] };
    });
    await saveProjects(updated);
  };

  // -------------------- Repair Requests --------------------
  const addRepairRequest = async (request: Omit<RepairRequest, "id" | "createdAt" | "status">) => {
    try {
      const payload = {
        title: request.title,
        description: request.description,
        clientId: request.clientId,
        clientName: request.clientName,
        location: request.location,
        address: request.address,
        projectType: request.projectType, // Must match backend enum exactly
        urgency: request.urgency || "medium", // default
        attachments: request.attachments?.map(file => file.name) || [],
        estimatedCost: request.estimatedCost,
        status: "pending",
        adminId: request.adminId || "",
      };

      const res = await API.post("/construction/repair-requests", payload);

      // Update frontend state & localStorage
      setRepairRequests(prev => [...prev, res.data]);
      localStorage.setItem("repairRequests", JSON.stringify([...repairRequests, res.data]));
    } catch (error) {
      console.error("Failed to add repair request:", error.response?.data || error.message);
    }
  };

  const approveRepairRequest = async (id: string) => {
    try {
      await API.put(`/construction/repair-requests/${id}/approve`);
      const updated: RepairRequest[] = repairRequests.map((r) =>
        r.id === id ? { ...r, status: "approved" } : r
      );
      saveRepairRequests(updated);
    } catch (error) {
      console.error("Failed to approve repair request:", error);
      throw error;
    }
  };

  const rejectRepairRequest = async (id: string) => {
    try {
      await API.put(`/construction/repair-requests/${id}/reject`);
      const updated: RepairRequest[] = repairRequests.map((r) =>
        r.id === id ? { ...r, status: "rejected" } : r
      );
      saveRepairRequests(updated);
    } catch (error) {
      console.error("Failed to reject repair request:", error);
      throw error;
    }
  };

  const approveConstructionRequest = async (id: string) => {
    try {
      await API.put(`/construction/construction-requests/${id}/approve`);
      const updated: ApprovalRequest[] = constructionRequests.map((r) =>
        r.id === id ? { ...r, status: "approved" } : r
      );
      saveConstructionRequests(updated);
    } catch (error) {
      console.error("Failed to approve construction request:", error);
      throw error;
    }
  };

  const rejectConstructionRequest = async (id: string) => {
    try {
      await API.put(`/construction/construction-requests/${id}/reject`);
      const updated: ApprovalRequest[] = constructionRequests.map((r) =>
        r.id === id ? { ...r, status: "rejected" } : r
      );
      saveConstructionRequests(updated);
    } catch (error) {
      console.error("Failed to reject construction request:", error);
      throw error;
    }
  };

  const updateProjectMaterials = (projectId: string, materials: Material[]) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, materials } : p
    );
    saveProjects(updated);
  };

  return (
    <ConstructionContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        addTask,
        updateTask,
        addMaterial,
        addPayment,
        getProjectsByRole,
        requestApproval,
        approveRequest,
        repairRequests,
        addRepairRequest,
        approveRepairRequest,
        rejectRepairRequest,
        constructionRequests,
        approveConstructionRequest,
        rejectConstructionRequest,
        updateProjectMaterials,
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};
