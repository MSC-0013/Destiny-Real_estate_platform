import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayments } from "@/contexts/PaymentContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IndianRupee, CircleDollarSign, Users, Layers, Percent } from "lucide-react";

interface PaymentsTabProps {
  projectId: string;
}

export default function PaymentsTab({ projectId }: PaymentsTabProps) {
  const { getPoolBalance } = usePayments();
  const pool = getPoolBalance(projectId);

  // Editable inputs
  const [totalCost, setTotalCost] = useState<number>(
    pool?.totalCost ?? 2000000
  );
  const [materialPercent, setMaterialPercent] = useState<number>(() =>
    pool?.materialCost
      ? Math.round((pool.materialCost / (pool?.totalCost || 2000000)) * 100)
      : 40
  );
  const [desiredProfitPercent, setDesiredProfitPercent] = useState<number>(0);

  const [workers, setWorkers] = useState<number>(10);
  const [workerSalary, setWorkerSalary] = useState<number>(15000); // per month
  const [designerSalary, setDesignerSalary] = useState<number>(30000);
  const [contractorSalary, setContractorSalary] = useState<number>(80000);
  const [months, setMonths] = useState<number>(12);

  // Helpers
  const fmt = (v: number) =>
    "₹" + (isFinite(v) ? Math.round(v).toLocaleString() : "0");
  const pct = (value: number, total: number) =>
    total > 0 ? `${((value / total) * 100).toFixed(2)}%` : "0.00%";

  // Core calculations
  const metrics = useMemo(() => {
    const T = Number(totalCost) || 0;
    const matPct = Math.max(0, Math.min(100, Number(materialPercent) || 0));
    const materialCost = (matPct / 100) * T;

    const workerTotal =
      Number(workers || 0) *
      Number(workerSalary || 0) *
      Number(months || 0);
    const designerTotal = Number(designerSalary || 0);
    const contractorTotal = Number(contractorSalary || 0) ;
    const salariesTotal = workerTotal + designerTotal + contractorTotal;

    let profitAmount: number; 
    let profitPercentCalculated: number;

    if (Number(desiredProfitPercent) > 0) {
      profitAmount = (Number(desiredProfitPercent) / 100) * T;
      profitPercentCalculated = Number(desiredProfitPercent);
    } else {
      profitAmount = T - (materialCost + salariesTotal);
      profitPercentCalculated = T > 0 ? (profitAmount / T) * 100 : 0;
    }

    const allocated = materialCost + salariesTotal + Math.max(0, profitAmount);
    const remainingPool =
      T - (materialCost + salariesTotal + (desiredProfitPercent > 0 ? profitAmount : 0));
    const deficit = allocated > T ? allocated - T : 0;

    return {
      total: T,
      materialCost,
      workerTotal,
      designerTotal,
      contractorTotal,
      salariesTotal,
      profitAmount,
      profitPercentCalculated,
      remainingPool,
      deficit,
      allocated,
      spentBeforeProfit: materialCost + salariesTotal,
    };
  }, [
    totalCost,
    materialPercent,
    desiredProfitPercent,
    workers,
    workerSalary,
    designerSalary,
    contractorSalary,
    months,
  ]);

  // Chart data
  const chartData = useMemo(() => {
    const slices: { name: string; value: number }[] = [
      { name: "Material", value: Math.max(0, metrics.materialCost) },
      { name: "Workers", value: Math.max(0, metrics.workerTotal) },
      { name: "Designer", value: Math.max(0, metrics.designerTotal) },
      { name: "Contractor", value: Math.max(0, metrics.contractorTotal) },
      { name: "Profit", value: Math.max(0, metrics.profitAmount) },
    ];

    if (metrics.remainingPool > 0) {
      slices.push({ name: "Remaining/Admin", value: metrics.remainingPool });
    }

    if (metrics.deficit > 0) {
      slices.push({ name: "Deficit", value: metrics.deficit });
    }

    return slices.filter((s) => s.value > 0 || s.name === "Profit");
  }, [metrics]);

  const COLORS = [
    "#60a5fa", // material
    "#4ade80", // workers
    "#fbbf24", // designer
    "#f87171", // contractor
    "#a78bfa", // profit
    "#f0abfc", // remaining
    "#ef4444", // deficit
  ];

  const categories = [
    { key: "Material", value: metrics.materialCost },
    { key: "Workers", value: metrics.workerTotal },
    { key: "Designer", value: metrics.designerTotal },
    { key: "Contractor", value: metrics.contractorTotal },
    { key: "Profit", value: metrics.profitAmount },
    { key: "Remaining Pool", value: metrics.remainingPool },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: KPIs + Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Project Financial Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-5 h-5 text-green-600" />                <div>
                  <p className="text-xs text-slate-500">Total Cost</p>
                  <p className="text-lg font-semibold">{fmt(metrics.total)}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Allocated (Mat + Salaries)</p>
                  <p className="text-lg font-semibold">
                    {fmt(metrics.spentBeforeProfit)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <Percent className="w-6 h-6 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Profit</p>
                  <p className="text-lg font-semibold">
                    {fmt(Math.max(0, metrics.profitAmount))}{" "}
                    <span className="text-sm text-slate-500">
                      ({metrics.profitPercentCalculated?.toFixed(2)}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${metrics.deficit > 0 ? "bg-red-50" : "bg-slate-50"
                }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">
                    {metrics.deficit > 0 ? "Deficit" : "Remaining Pool"}
                  </p>
                  <p className="text-lg font-semibold">
                    {fmt(
                      metrics.deficit > 0
                        ? -metrics.deficit
                        : metrics.remainingPool
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={4}
                  label={({ name, value }) =>
                    `${name} — ${value >= 1000
                      ? Math.round(value).toLocaleString()
                      : Math.round(value)
                    }`
                  }
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={`c-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${fmt(val)}`, "Amount"]}
                  contentStyle={{ fontSize: 13 }}
                  itemSorter={(item) => -item.value}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Right: Inputs + Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Configure & Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm text-slate-600">
                Total Project Cost (₹)
              </label>
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value || 0))}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Material %</label>
              <input
                type="number"
                value={materialPercent}
                onChange={(e) =>
                  setMaterialPercent(Number(e.target.value || 0))
                }
                className="w-full border p-2 rounded mt-1"
                min={0}
                max={100}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Desired Profit % (0 = auto)
              </label>
              <input
                type="number"
                value={desiredProfitPercent}
                onChange={(e) =>
                  setDesiredProfitPercent(Number(e.target.value || 0))
                }
                className="w-full border p-2 rounded mt-1"
                min={0}
                max={100}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Contract Duration (months)
              </label>
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value || 1))}
                className="w-full border p-2 rounded mt-1"
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600"># Workers</label>
              <input
                type="number"
                value={workers}
                onChange={(e) => setWorkers(Number(e.target.value || 0))}
                className="w-full border p-2 rounded mt-1"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">
                Worker salary (₹ / Month)
              </label>
              <input
                type="number"
                value={workerSalary}
                onChange={(e) =>
                  setWorkerSalary(Number(e.target.value || 0))
                }
                className="w-full border p-2 rounded mt-1"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Designer salary (₹ / Total)
              </label>
              <input
                type="number"
                value={designerSalary}
                onChange={(e) =>
                  setDesignerSalary(Number(e.target.value || 0))
                }
                className="w-full border p-2 rounded mt-1"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600">
                Contractor salary (₹ / Total)
              </label>
              <input
                type="number"
                value={contractorSalary}
                onChange={(e) =>
                  setContractorSalary(Number(e.target.value || 0))
                }
                className="w-full border p-2 rounded mt-1"
                min={0}
              />
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2 border">Category</th>
                  <th className="text-right p-2 border">Amount (₹)</th>
                  <th className="text-right p-2 border">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.key} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2 border">{c.key}</td>
                    <td className="p-2 text-right border">{fmt(c.value)}</td>
                    <td className="p-2 text-right border">
                      {pct(c.value, metrics.total)}
                    </td>
                  </tr>
                ))}

                <tr className="bg-slate-100 font-medium">
                  <td className="p-2 border">
                    Allocated (Material + Salaries)
                  </td>
                  <td className="p-2 text-right border">
                    {fmt(metrics.spentBeforeProfit)}
                  </td>
                  <td className="p-2 text-right border">
                    {pct(metrics.spentBeforeProfit, metrics.total)}
                  </td>
                </tr>

                <tr
                  className={
                    metrics.deficit > 0
                      ? "bg-red-50 text-red-700 font-semibold"
                      : "bg-green-50 font-semibold"
                  }
                >
                  <td className="p-2 border">
                    {metrics.deficit > 0 ? "Deficit (over budget)" : "Remaining Pool"}
                  </td>
                  <td className="p-2 text-right border">
                    {fmt(
                      metrics.deficit > 0
                        ? -metrics.deficit
                        : metrics.remainingPool
                    )}
                  </td>
                  <td className="p-2 text-right border">
                    {metrics.deficit > 0
                      ? pct(-metrics.deficit, metrics.total)
                      : pct(metrics.remainingPool, metrics.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
