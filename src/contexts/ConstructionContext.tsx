// -------------------- ConstructionContext.tsx --------------------
import React, { createContext, useContext, useState, useEffect } from 'react';
import { openDB, DBSchema } from 'idb';
import { v4 as uuidv4 } from 'uuid';


// -------------------- Interfaces --------------------
export interface ConstructionProject {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  location: string;
  address: string;
  projectType: 'residential' | 'commercial' | 'renovation' | 'interior';
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  phase: 'planning' | 'foundation' | 'structure' | 'interior' | 'finishing' | 'completed';
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
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
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
  type: 'advance' | 'milestone' | 'final';
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidAt?: string;
  description: string;
}

export interface ApprovalRequest {
  id: string;
  type: 'project' | 'task' | 'material' | 'payment';
  targetId: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// -------------------- Repair Request --------------------
export interface RepairRequest {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  location: string;
  address: string;
  projectType: 'residential' | 'commercial' | 'renovation' | 'interior'; // ADD THIS
  urgency: 'low' | 'medium' | 'high'; // ADD THIS
  attachments?: File[];           // ADD THIS
  estimatedCost?: number;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  createdAt: string;
  adminId?: string;
}

// -------------------- Context Type --------------------
interface ConstructionContextType {
  projects: ConstructionProject[];
  addProject: (project: Omit<ConstructionProject, 'id' | 'createdAt' | 'actualCost' | 'tasks' | 'materials' | 'payments' | 'requests'>) => void;
  updateProject: (id: string, updates: Partial<ConstructionProject>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => ConstructionProject | undefined;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'projectId'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addMaterial: (projectId: string, material: Omit<Material, 'id' | 'totalCost'>) => void;
  addPayment: (projectId: string, payment: Omit<Payment, 'id'>) => void;
  getProjectsByRole: (userId: string, role: string) => ConstructionProject[];
  requestApproval: (projectId: string, request: Omit<ApprovalRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveRequest: (projectId: string, requestId: string, approve: boolean) => void;
  repairRequests: RepairRequest[];
  addRepairRequest: (request: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => void;

  constructionRequests: ApprovalRequest[];
  approveRepairRequest: (id: string) => void;
  rejectRepairRequest: (id: string) => void;
  approveConstructionRequest: (id: string) => void;
  rejectConstructionRequest: (id: string) => void;

}

// -------------------- Context --------------------
const ConstructionContext = createContext<ConstructionContextType | undefined>(undefined);
export const useConstruction = () => {
  const context = useContext(ConstructionContext);
  if (!context) throw new Error('useConstruction must be used within a ConstructionProvider');
  return context;
};

// -------------------- Sample Projects --------------------
const sampleProjects: ConstructionProject[] = [
  {
    id: '1',
    title: 'Luxury Villa Construction',
    description: 'Building a modern 5-bedroom luxury villa with pool and landscaping',
    clientId: 'client-1',
    clientName: 'John Smith',
    location: 'Beverly Hills',
    address: '123 Sunset Boulevard, Beverly Hills, CA 90210',
    projectType: 'residential',
    status: 'in-progress',
    phase: 'structure',
    startDate: '2024-01-15',
    endDate: '2024-08-15',
    estimatedCost: 2500000,
    actualCost: 1200000,
    contractorId: 'contractor-1',
    contractorName: 'Elite Builders Inc',
    designerId: 'designer-1',
    designerName: 'Modern Designs Studio',
    workers: ['worker-1', 'worker-2', 'worker-3'],
    blueprints: ['/placeholder.svg'],
    progressImages: ['/placeholder.svg'],
    tasks: [],
    materials: [],
    payments: [],
    createdAt: new Date().toISOString(),
    adminId: 'admin-1',
    requests: [],
  },
];

// -------------------- IndexedDB Setup --------------------
interface ConstructionDB extends DBSchema {
  projects: { key: string; value: ConstructionProject };
}
const dbPromise = openDB<ConstructionDB>('construction-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('projects')) {
      db.createObjectStore('projects', { keyPath: 'id' });
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
      // Projects
      const savedProjects = localStorage.getItem('constructionProjects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      else setProjects(sampleProjects);

      const db = await dbPromise;
      const allProjects = await db.getAll('projects');
      if (allProjects.length > 0) {
        setProjects(allProjects);
        localStorage.setItem('constructionProjects', JSON.stringify(allProjects));
      } else {
        const tx = db.transaction('projects', 'readwrite');
        for (const proj of sampleProjects) tx.store.put(proj);
        await tx.done;
      }

      // Repair Requests
      const savedRepairRequests = localStorage.getItem('repairRequests');
      if (savedRepairRequests) setRepairRequests(JSON.parse(savedRepairRequests));
      // Construction Requests  <-- ADD THIS
      const savedConstructionRequests = localStorage.getItem('constructionRequests');
      if (savedConstructionRequests) setConstructionRequests(JSON.parse(savedConstructionRequests));
    };
    loadData();
  }, []);

  // -------------------- Save Helpers --------------------
  const saveProjects = async (updatedProjects: ConstructionProject[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
    const db = await dbPromise;
    const tx = db.transaction('projects', 'readwrite');
    for (const project of updatedProjects) await tx.store.put(project);
    await tx.done;
  };

  const saveRepairRequests = async (requests: RepairRequest[]) => {
    setRepairRequests(requests);
    localStorage.setItem('repairRequests', JSON.stringify(requests));
    // Optional: store in IndexedDB if needed
  };
  const saveConstructionRequests = (requests: ApprovalRequest[]) => {
    setConstructionRequests(requests); // THIS triggers re-render
    localStorage.setItem("constructionRequests", JSON.stringify(requests));
  };
  



  // -------------------- CRUD for Projects --------------------
  const addProject = (project: Omit<ConstructionProject, 'id' | 'createdAt'>) => {
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
  setProjects((prev) => [...prev, newProject]);
};
  
  const updateProject = (id: string, updates: Partial<ConstructionProject>) => {
    const updatedProjects = projects.map(p => (p.id === id ? { ...p, ...updates } : p));
    saveProjects(updatedProjects);
  };

  const deleteProject = (id: string) => saveProjects(projects.filter(p => p.id !== id));
  const getProject = (id: string) => projects.find(p => p.id === id);

  // -------------------- Tasks --------------------
  const addTask = (projectId: string, taskData: Omit<Task, 'id' | 'projectId'>) => {
    const newTask: Task = { ...taskData, id: Date.now().toString(), projectId };
    const updatedProjects = projects.map(p => (p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p));
    saveProjects(updatedProjects);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedProjects = projects.map(p => ({ ...p, tasks: p.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t)) }));
    saveProjects(updatedProjects);
  };

  // -------------------- Materials --------------------
  const addMaterial = (projectId: string, materialData: Omit<Material, 'id' | 'totalCost'>) => {
    const newMaterial: Material = { ...materialData, id: Date.now().toString(), totalCost: materialData.quantity * materialData.unitCost };
    const updatedProjects = projects.map(p => (p.id === projectId ? { ...p, materials: [...p.materials, newMaterial] } : p));
    saveProjects(updatedProjects);
  };

  // -------------------- Payments --------------------
  const addPayment = (projectId: string, paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...paymentData, id: Date.now().toString() };
    const updatedProjects = projects.map(p => (p.id === projectId ? { ...p, payments: [...p.payments, newPayment] } : p));
    saveProjects(updatedProjects);
  };

  // -------------------- Projects by Role --------------------
  const getProjectsByRole = (userId: string, role: string) => {
    if (role === 'admin') return projects;
    return projects.filter(p => p.clientId === userId || p.contractorId === userId || p.designerId === userId || p.workers.includes(userId));
  };

  // -------------------- Approval Requests --------------------
  const requestApproval = (projectId: string, requestData: Omit<ApprovalRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: ApprovalRequest = { ...requestData, id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() };
    const updatedProjects = projects.map(p => (p.id === projectId ? { ...p, requests: [...(p.requests || []), newRequest] } : p));
    saveProjects(updatedProjects);
  };

  const approveRequest = (projectId: string, requestId: string, approve: boolean) => {
    const updatedProjects = projects.map(p => {
      if (p.id !== projectId) return p;
      const updatedRequests = p.requests?.map(r => (r.id === requestId ? { ...r, status: approve ? 'approved' : 'rejected' } : r)) || [];
      return { ...p, requests: updatedRequests };
    });
    saveProjects(updatedProjects);
  };

  // -------------------- Repair Requests --------------------
  const addRepairRequest = (requestData: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: RepairRequest = { ...requestData, id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'pending' };
    saveRepairRequests([...repairRequests, newRequest]);
  };
  // -------------------- Approve / Reject Repair Requests --------------------
  const approveRepairRequest = (id: string) => {
    const updated = repairRequests.map(r => (r.id === id ? { ...r, status: 'approved' } : r));
    saveRepairRequests(updated);
  };

  const rejectRepairRequest = (id: string) => {
    const updated = repairRequests.map(r => (r.id === id ? { ...r, status: 'rejected' } : r));
    saveRepairRequests(updated);
  };

  // -------------------- Approve / Reject Construction Requests --------------------
  const approveConstructionRequest = (id: string) => {
    const updated = constructionRequests.map(r =>
      r.id === id ? { ...r, status: "approved" } : r
    );
    saveConstructionRequests(updated);
  };

  const rejectConstructionRequest = (id: string) => {
    const updated = constructionRequests.map(r =>
      r.id === id ? { ...r, status: "rejected" } : r
    );
    saveConstructionRequests(updated);
  };


  // -------------------- Provider --------------------
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
      }}
    >

      {children}
    </ConstructionContext.Provider>
  );
};
