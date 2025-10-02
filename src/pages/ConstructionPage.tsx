import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConstruction } from "@/contexts/ConstructionContext";
import ConstructionChart from "./ConstructionChart";

export const ConstructionPage: React.FC = () => {
  const { projects } = useConstruction();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Construction Projects Dashboard</h1>

     

      {/* Projects list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Card key={p.id} className="shadow-md hover:shadow-lg transition rounded-xl">
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <Badge>{p.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
              <p><strong>Client:</strong> {p.clientName}</p>
              <p><strong>Location:</strong> {p.location}</p>
              <p><strong>Type:</strong> {p.projectType}</p>
              <p><strong>Estimated Cost:</strong> ₹{p.estimatedCost.toLocaleString()}</p>
              <p><strong>Actual Cost:</strong> ₹{p.actualCost.toLocaleString()}</p>
              <p><strong>Phase:</strong> {p.phase}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConstructionPage;
