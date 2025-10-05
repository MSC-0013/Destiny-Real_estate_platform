// -------------------- ConstructionContext.tsx --------------------
import React, { createContext, useContext, useState, useEffect } from "react";
import { openDB, DBSchema } from "idb";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// -------------------- API Config --------------------
const API = axios.create({
  baseURL: "http://localhost:5000/api", // change to deployed link later
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
  actualCost: number;
  contractorId?: string;
  contractorName?: string;
  designerId?: string;
  designerName?: string;
  workers: string[];
  blueprints: string[];
  progressImages: string[];
  tasks: Task[];
  materials: Material[];
  payments: Payment[];
  createdAt: string;
  adminId: string;
  requests?: ApprovalRequest[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  assigneeName: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  images: string[];
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
  addRepairRequest: (
    request: Omit<RepairRequest, "id" | "createdAt" | "status">
  ) => void;
  constructionRequests: ApprovalRequest[];
  approveRepairRequest: (id: string) => void;
  rejectRepairRequest: (id: string) => void;
  approveConstructionRequest: (id: string) => void;
  rejectConstructionRequest: (id: string) => void;
  updateProjectMaterials: (projectId: string, materials: Material[]) => void;
}

// -------------------- Context --------------------
const ConstructionContext = createContext<ConstructionContextType | undefined>(undefined);
export const useConstruction = () => {
  const context = useContext(ConstructionContext);
  if (!context)
    throw new Error("useConstruction must be used within a ConstructionProvider");
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
export const ConstructionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [constructionRequests, setConstructionRequests] = useState<ApprovalRequest[]>([]);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem("constructionProjects");
      if (saved) setProjects(JSON.parse(saved));

      const db = await dbPromise;
      const all = await db.getAll("projects");
      if (all.length > 0) setProjects(all);
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

  // -------------------- CRUD with Backend Sync --------------------
  const addProject = async (
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
  ) => {
    const newProject: ConstructionProject = {
      ...project,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      actualCost: 0,
      workers: [],
      blueprints: [],
      progressImages: [],
      tasks: [],
      materials: [],
      payments: [],
      requests: [],
    };

    const updated = [...projects, newProject];
    await saveProjects(updated);

    // backend sync
    try {
      await API.post("/construction/projects", newProject);
    } catch (error) {
      console.error("Backend addProject error:", error);
    }
  };

  const updateProject = async (id: string, updates: Partial<ConstructionProject>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    await saveProjects(updated);

    const project = updated.find((p) => p.id === id);
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

  // -------------------- Other CRUD --------------------
  const getProject = (id: string) => projects.find((p) => p.id === id);

  const addTask = (projectId: string, task: Omit<Task, "id" | "projectId">) => {
    const newTask: Task = { ...task, id: Date.now().toString(), projectId };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
    );
    saveProjects(updated);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updated = projects.map((p) => ({
      ...p,
      tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
    saveProjects(updated);
  };

  const addMaterial = (projectId: string, material: Omit<Material, "id" | "totalCost">) => {
    const newMaterial: Material = {
      ...material,
      id: Date.now().toString(),
      totalCost: material.quantity * material.unitCost,
    };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, materials: [...p.materials, newMaterial] } : p
    );
    saveProjects(updated);
  };

  const addPayment = (projectId: string, payment: Omit<Payment, "id">) => {
    const newPayment: Payment = { ...payment, id: Date.now().toString() };
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, payments: [...p.payments, newPayment] } : p
    );
    saveProjects(updated);
  };

  // -------------------- Role / Approval / Repair --------------------
  const getProjectsByRole = (userId: string, role: string) => {
    if (role === "admin") return projects;
    return projects.filter(
      (p) =>
        p.clientId === userId ||
        p.contractorId === userId ||
        p.designerId === userId ||
        p.workers.includes(userId)
    );
  };

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
      p.id === projectId
        ? { ...p, requests: [...(p.requests || []), newRequest] }
        : p
    );
    saveProjects(updated);
  };

  const approveRequest = (projectId: string, requestId: string, approve: boolean) => {
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const updatedReq = p.requests?.map((r) =>
        r.id === requestId ? { ...r, status: approve ? "approved" : "rejected" } : r
      );
      return { ...p, requests: updatedReq };
    });
    saveProjects(updated);
  };

  const addRepairRequest = (
    request: Omit<RepairRequest, "id" | "createdAt" | "status">
  ) => {
    const newRequest: RepairRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    const updated = [...repairRequests, newRequest];
    setRepairRequests(updated);
    localStorage.setItem("repairRequests", JSON.stringify(updated));
  };

  const approveRepairRequest = (id: string) => {
    const updated = repairRequests.map((r) =>
      r.id === id ? { ...r, status: "approved" } : r
    );
    setRepairRequests(updated);
    localStorage.setItem("repairRequests", JSON.stringify(updated));
  };

  const rejectRepairRequest = (id: string) => {
    const updated = repairRequests.map((r) =>
      r.id === id ? { ...r, status: "rejected" } : r
    );
    setRepairRequests(updated);
    localStorage.setItem("repairRequests", JSON.stringify(updated));
  };

  const approveConstructionRequest = (id: string) => {
    const updated = constructionRequests.map((r) =>
      r.id === id ? { ...r, status: "approved" } : r
    );
    setConstructionRequests(updated);
  };

  const rejectConstructionRequest = (id: string) => {
    const updated = constructionRequests.map((r) =>
      r.id === id ? { ...r, status: "rejected" } : r
    );
    setConstructionRequests(updated);
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
        constructionRequests,
        approveRepairRequest,
        rejectRepairRequest,
        approveConstructionRequest,
        rejectConstructionRequest,
        updateProjectMaterials,
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};
