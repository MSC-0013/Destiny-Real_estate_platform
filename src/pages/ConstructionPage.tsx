import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConstructionChart } from "./ConstructionChart";

interface ConstructionProject {
  id: number;
  name: string;
  location: string;
  status: string;
  budget: number;
}

export const ConstructionPage: React.FC = () => {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Planning");
  const [budget, setBudget] = useState<number>(0);

  const addProject = () => {
    if (!name || !location || budget <= 0) return;
    const newProject: ConstructionProject = {
      id: Date.now(),
      name,
      location,
      status,
      budget,
    };
    setProjects([...projects, newProject]);
    setName(""); setLocation(""); setBudget(0); setStatus("Planning");
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Construction Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Status (Planning, In Progress, Completed)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
          <Button onClick={addProject}>Add Project</Button>
        </CardContent>
      </Card>

      <ConstructionChart projects={projects} />
    </div>
  );
};
export default ConstructionPage;