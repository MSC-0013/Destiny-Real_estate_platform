import React, { useState } from "react";
import { useJob } from "@/contexts/JobContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Search } from "lucide-react";

// -------------------- Filter & Search --------------------
const FilterSearch: React.FC<{
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ filterStatus, setFilterStatus, searchQuery, setSearchQuery }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
    <div className="flex gap-2 items-center">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name..."
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="flex gap-2">
      {["all", "pending", "approved", "rejected"].map(status => (
        <Button
          key={status}
          variant={filterStatus === status ? "default" : "outline"}
          onClick={() => setFilterStatus(status)}
          className="capitalize"
        >
          {status}
        </Button>
      ))}
    </div>
  </div>
);

// -------------------- Worker Card --------------------
const WorkerCard: React.FC<any> = ({ worker, approveJob, rejectJob }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 bg-white">
      <CardContent className="p-5 flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-lg">{worker.applicantName || "-"}</span> – <span className="italic">{worker.positionApplied || "-"}</span> ({worker.status})
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <table className="min-w-full table-auto text-sm border-collapse">
              <tbody className="divide-y divide-gray-300">
                <tr><td className="px-4 py-2 font-semibold">👤 Name</td><td>{worker.applicantName || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">💼 Position</td><td>{worker.positionApplied || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">⚡ Experience</td><td>{worker.experienceYears || "-"} {worker.experienceYears ? "years" : ""}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🛠 Skills</td><td>{worker.skillsServices?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🛠 Construction Skills</td><td>{worker.constructionSkills?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">📜 Certifications</td><td>{worker.certifications?.join(" | ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🎓 Education</td><td>{worker.educationLevel || "-"} in {worker.fieldOfStudy || "-"} ({worker.institutionName || "-"})</td></tr>
                <tr><td className="px-4 py-2 font-semibold">📝 Description</td><td>{worker.description || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">📅 Availability</td><td>{worker.availability || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">⏱ Overtime</td><td>{worker.overtime ? "Yes" : "No"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">📆 Weekends</td><td>{worker.weekends ? "Yes" : "No"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Employment Type</td><td>{worker.employmentType || "-"}</td></tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-3 mt-4">
              {worker.status === "pending" ? (
                <>
                  <Button onClick={() => approveJob(worker.id)} variant="outline" className="text-black border-black">
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => rejectJob(worker.id)} variant="outline" className="text-red-600 border-red-600">
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <span className={`font-bold px-4 py-2 rounded-full text-sm ${worker.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {worker.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// -------------------- Contractor Card --------------------
const ContractorCard: React.FC<any> = ({ contractor, approveJob, rejectJob }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 bg-white">
      <CardContent className="p-5 flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-lg">{contractor.applicantName || "-"}</span> – <span className="italic">{contractor.contractorType || "-"}</span> ({contractor.status})
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <table className="min-w-full table-auto text-sm border-collapse">
              <tbody className="divide-y divide-gray-300">
                <tr><td className="px-4 py-2 font-semibold">👤 Name</td><td>{contractor.applicantName || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🏢 Company</td><td>{contractor.companyName || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Type</td><td>{contractor.contractorType || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">License #</td><td>{contractor.licenseNumber || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">License Expiry</td><td>{contractor.licenseExpiry || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Experience (Years)</td><td>{contractor.experienceYears || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Skills</td><td>{contractor.skillsServices?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Certifications</td><td>{contractor.certifications?.join(" | ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Insurance</td><td>{contractor.insurance?.join(" | ") || "-"}</td></tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-3 mt-4">
              {contractor.status === "pending" ? (
                <>
                  <Button onClick={() => approveJob(contractor.id)} variant="outline" className="text-black border-black">
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => rejectJob(contractor.id)} variant="outline" className="text-red-600 border-red-600">
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <span className={`font-bold px-4 py-2 rounded-full text-sm ${contractor.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {contractor.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// -------------------- Designer Card --------------------
const DesignerCard: React.FC<any> = ({ designer, approveJob, rejectJob }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 bg-white">
      <CardContent className="p-5 flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-lg">{designer.applicantName || "-"}</span> – <span className="italic">{designer.positionAppliedDesigner || "-"}</span> ({designer.status})
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <table className="min-w-full table-auto text-sm border-collapse">
              <tbody className="divide-y divide-gray-300">
                <tr><td className="px-4 py-2 font-semibold">👤 Name</td><td>{designer.applicantName || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Position</td><td>{designer.positionAppliedDesigner || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Design Skills</td><td>{designer.designSkills?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Tools</td><td>{designer.tools?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Portfolio</td><td>{designer.portfolio || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Certifications</td><td>{designer.certifications?.join(" | ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Education</td><td>{designer.educationLevelDesigner || "-"} in {designer.fieldOfStudyDesigner || "-"} ({designer.institutionDesigner || "-"})</td></tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-3 mt-4">
              {designer.status === "pending" ? (
                <>
                  <Button onClick={() => approveJob(designer.id)} variant="outline" className="text-black border-black">
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => rejectJob(designer.id)} variant="outline" className="text-red-600 border-red-600">
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <span className={`font-bold px-4 py-2 rounded-full text-sm ${designer.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {designer.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// -------------------- Main Dashboard --------------------
const JobDashboard: React.FC = () => {
  const { workerApplications, contractorApplications, designerApplications, approveJob, rejectJob } = useJob();
  const [activeTab, setActiveTab] = useState<"workers" | "contractors" | "designers">("workers");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filterAndSearch = (applications: any[]) =>
    applications.filter(app =>
      (filterStatus === "all" || app.status === filterStatus) &&
      (app.applicantName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["workers", "contractors", "designers"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filter & Search */}
      <FilterSearch
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Applications */}
      <div className="space-y-6">
        {activeTab === "workers" &&
          (filterAndSearch(workerApplications).length > 0
            ? filterAndSearch(workerApplications).map(w => <WorkerCard key={w.id} worker={w} approveJob={approveJob} rejectJob={rejectJob} />)
            : <p className="text-gray-500 italic">No worker applications</p>)
        }

        {activeTab === "contractors" &&
          (filterAndSearch(contractorApplications).length > 0
            ? filterAndSearch(contractorApplications).map(c => <ContractorCard key={c.id} contractor={c} approveJob={approveJob} rejectJob={rejectJob} />)
            : <p className="text-gray-500 italic">No contractor applications</p>)
        }

        {activeTab === "designers" &&
          (filterAndSearch(designerApplications).length > 0
            ? filterAndSearch(designerApplications).map(d => <DesignerCard key={d.id} designer={d} approveJob={approveJob} rejectJob={rejectJob} />)
            : <p className="text-gray-500 italic">No designer applications</p>)
        }
      </div>
    </div>
  );
};

export default JobDashboard;
