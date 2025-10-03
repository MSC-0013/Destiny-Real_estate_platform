import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { useConstruction } from "@/contexts/ConstructionContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  supplier: string;
  unitCost: number;
  totalCost: number;
}

interface MaterialsTabProps {
  projectId: string;
  materials: Material[];
}

const initialMaterials: Material[] = [
  { id: "1", name: "Cement", quantity: 0, unit: "bags", supplier: "", unitCost: 0, totalCost: 0 },
  { id: "2", name: "Sand", quantity: 0, unit: "tons", supplier: "", unitCost: 0, totalCost: 0 },
  { id: "3", name: "Bricks", quantity: 0, unit: "pieces", supplier: "", unitCost: 0, totalCost: 0 },
  { id: "4", name: "Steel", quantity: 0, unit: "kg", supplier: "", unitCost: 0, totalCost: 0 },
  { id: "5", name: "Tiles", quantity: 0, unit: "sqm", supplier: "", unitCost: 0, totalCost: 0 },
];

const MaterialsTab: React.FC<MaterialsTabProps> = ({ projectId, materials }) => {
  const { updateProjectMaterials } = useConstruction();
  const [localMaterials, setLocalMaterials] = useState<Material[]>(
    materials.length > 0 ? materials : initialMaterials
  );

  // Extra costs
  const [transportation, setTransportation] = useState<number>(0);
  const [admin, setAdmin] = useState<number>(0);

  // Sync local state with materials prop
  useEffect(() => {
    setLocalMaterials(materials.length > 0 ? materials : initialMaterials);
  }, [materials]);

  // Handle input changes
  const handleChange = (index: number, key: keyof Material, value: string | number) => {
    const updated = [...localMaterials];
    updated[index][key] = value as any;
    updated[index].totalCost = updated[index].quantity * updated[index].unitCost;
    setLocalMaterials(updated);
  };

  // Add new material
  const handleAddMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: "",
      quantity: 0,
      unit: "",
      supplier: "",
      unitCost: 0,
      totalCost: 0,
    };
    setLocalMaterials([...localMaterials, newMaterial]);
  };

  // Save materials to context
  const handleSaveMaterials = () => {
    updateProjectMaterials(projectId, localMaterials);
    alert("Materials saved successfully!");
  };

  // Total cost calculations
  const materialsTotal = localMaterials.reduce((sum, m) => sum + m.totalCost, 0);
  const grandTotal = materialsTotal + transportation + admin;

  // Chart data
  const chartData = [
    ...localMaterials.map((m) => ({
      name: m.name || "Unnamed",
      value: m.totalCost,
    })),
    { name: "Transportation", value: transportation },
    { name: "Admin/Misc", value: admin },
  ].filter((d) => d.value > 0);

  const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f87171", "#34d399", "#a78bfa", "#f472b6"];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Building className="w-5 h-5 text-blue-600" /> Materials & Supplies
        </CardTitle>
      </CardHeader>

      <CardContent>
        {localMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localMaterials.map((material, index) => (
              <div
                key={material.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900 flex flex-col gap-2"
              >
                <Input
                  placeholder="Material Name"
                  value={material.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="mb-1"
                />
                <div className="flex gap-2 flex-wrap">
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={material.quantity}
                    onChange={(e) => handleChange(index, "quantity", Number(e.target.value))}
                  />
                  <Input
                    placeholder="Unit (e.g., kg, pcs)"
                    value={material.unit}
                    onChange={(e) => handleChange(index, "unit", e.target.value)}
                  />
                  <Input
                    placeholder="Unit Cost"
                    type="number"
                    value={material.unitCost}
                    onChange={(e) => handleChange(index, "unitCost", Number(e.target.value))}
                  />
                </div>
                <Input
                  placeholder="Supplier"
                  value={material.supplier}
                  onChange={(e) => handleChange(index, "supplier", e.target.value)}
                />
                <div className="text-right font-medium mt-1">
                  Total: ₹{material.totalCost.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No materials recorded yet</p>
          </div>
        )}

        {/* Extra Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium">Transportation (₹)</label>
            <Input
              type="number"
              value={transportation}
              onChange={(e) => setTransportation(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Admin / Misc (₹)</label>
            <Input
              type="number"
              value={admin}
              onChange={(e) => setAdmin(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {localMaterials.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-2">{m.name || "Unnamed"}</td>
                  <td className="p-2 text-right">{m.totalCost.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t">
                <td className="p-2">Transportation</td>
                <td className="p-2 text-right">{transportation.toLocaleString()}</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Admin / Misc</td>
                <td className="p-2 text-right">{admin.toLocaleString()}</td>
              </tr>
              <tr className="border-t font-bold bg-gray-50 dark:bg-gray-800">
                <td className="p-2">Grand Total</td>
                <td className="p-2 text-right">₹{grandTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="h-80 mt-6">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <Button onClick={handleAddMaterial} className="bg-blue-600 hover:bg-blue-700">
            Add Material
          </Button>
          <Button onClick={handleSaveMaterials} className="bg-green-600 hover:bg-green-700">
            Save Materials
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialsTab;
