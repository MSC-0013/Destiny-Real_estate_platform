import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface ConstructionContextType {
  projects: ConstructionProject[];
  addProject: (project: Omit<ConstructionProject, 'id' | 'createdAt' | 'actualCost' | 'tasks' | 'materials' | 'payments'>) => void;
  updateProject: (id: string, updates: Partial<ConstructionProject>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => ConstructionProject | undefined;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'projectId'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addMaterial: (projectId: string, material: Omit<Material, 'id' | 'totalCost'>) => void;
  addPayment: (projectId: string, payment: Omit<Payment, 'id'>) => void;
  getProjectsByRole: (userId: string, role: string) => ConstructionProject[];
}

const ConstructionContext = createContext<ConstructionContextType | undefined>(undefined);

export const useConstruction = () => {
  const context = useContext(ConstructionContext);
  if (!context) {
    throw new Error('useConstruction must be used within a ConstructionProvider');
  }
  return context;
};

// Sample construction projects
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
  },
];

export const ConstructionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('constructionProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(sampleProjects);
      localStorage.setItem('constructionProjects', JSON.stringify(sampleProjects));
    }
  }, []);

  const addProject = (projectData: Omit<ConstructionProject, 'id' | 'createdAt' | 'actualCost' | 'tasks' | 'materials' | 'payments'>) => {
    const newProject: ConstructionProject = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      actualCost: 0,
      tasks: [],
      materials: [],
      payments: [],
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
  };

  const updateProject = (id: string, updates: Partial<ConstructionProject>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
  };

  const getProject = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const addTask = (projectId: string, taskData: Omit<Task, 'id' | 'projectId'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      projectId,
    };

    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { ...project, tasks: [...project.tasks, newTask] }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedProjects = projects.map(project => ({
      ...project,
      tasks: project.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
  };

  const addMaterial = (projectId: string, materialData: Omit<Material, 'id' | 'totalCost'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: Date.now().toString(),
      totalCost: materialData.quantity * materialData.unitCost,
    };

    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { ...project, materials: [...project.materials, newMaterial] }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
  };

  const addPayment = (projectId: string, paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
    };

    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { ...project, payments: [...project.payments, newPayment] }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('constructionProjects', JSON.stringify(updatedProjects));
  };

  const getProjectsByRole = (userId: string, role: string) => {
    switch (role) {
      case 'admin':
        return projects;
      case 'contractor':
        return projects.filter(p => p.contractorId === userId);
      case 'designer':
        return projects.filter(p => p.designerId === userId);
      case 'worker':
        return projects.filter(p => p.workers.includes(userId));
      case 'tenant':
      case 'seller':
        return projects.filter(p => p.clientId === userId);
      default:
        return [];
    }
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
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};