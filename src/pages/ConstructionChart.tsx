import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ConstructionProject {
  id: number;
  name: string;
  location: string;
  status: string;
  budget: number;
}

interface Props {
  projects: ConstructionProject[];
}

export const ConstructionChart: React.FC<Props> = ({ projects }) => {
  if (projects.length === 0)
    return <div className="text-center p-4">No construction projects yet</div>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Construction Budget Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={projects} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="budget" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ConstructionChart;