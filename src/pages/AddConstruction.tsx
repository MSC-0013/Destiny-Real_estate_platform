import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConstruction } from '@/contexts/ConstructionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddConstruction = () => {
  const { addProject } = useConstruction();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'renovation' | 'interior'>('residential');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'Project title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!clientName) newErrors.clientName = 'Client name is required';
    if (!location) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addProject({
      title,
      description,
      clientId: user?.id || 'unknown',
      clientName,
      location,
      address,
      projectType,
      status: 'pending',
      phase: 'planning',
      estimatedCost,
      actualCost: 0,
      adminId: user?.id || 'unknown',
      workers: [],
      blueprints: [],
      progressImages: [],
      tasks: [],
      materials: [],
      payments: [],
    });

    navigate('/construction');
  };

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4">Start New Construction Project</h1>

          <div className="space-y-4">
            <div>
              <Input placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
            </div>

            <div>
              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <Input placeholder="Address (Optional)" value={address} onChange={(e) => setAddress(e.target.value)} />

            <Input
              type="number"
              placeholder="Estimated Cost"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
            />

            <Select value={projectType} onValueChange={(value) => setProjectType(value as any)}>
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

            <Button
              className="bg-black hover:bg-gray-800 w-full text-white font-semibold"
              onClick={handleSubmit}
              disabled={!title || !description || !clientName || !location}
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
