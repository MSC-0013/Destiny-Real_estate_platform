import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useConstruction } from "@/contexts/ConstructionContext";

export const ConstructionChart: React.FC = () => {
  const { projects } = useConstruction();

  if (projects.length === 0)
    return <div className="text-center p-4">No construction projects yet</div>;

  // Transform context data into chart shape
  const chartData = projects.map((p) => ({
    name: p.title,
    estimated: p.estimatedCost,
    actual: p.actualCost,
    status: p.status,
  }));

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Construction Budget Chart</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="estimated" fill="#4ade80" name="Estimated Cost" />
          <Bar dataKey="actual" fill="#60a5fa" name="Actual Cost" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConstructionChart;
