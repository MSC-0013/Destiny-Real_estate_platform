import React, { useState } from "react";
import { useJob } from "@/contexts/JobContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

// -------------------- Worker Card --------------------
const WorkerCard: React.FC<any> = ({ worker, approveJob, rejectJob }) => {
  const [expanded, setExpanded] = useState(false);
  const {
    id,
    applicantName,
    status,
    positionApplied,
    experienceYears,
    skillsServices,
    constructionSkills,
    certifications,
    educationLevel,
    fieldOfStudy,
    institutionName,
    description,
    availability,
    overtime,
    weekends,
    employmentType,
  } = worker;

  return (
    <Card key={id} className="border border-gray-300 rounded-xl shadow-sm bg-white">
      <CardContent className="p-4 flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">{applicantName}</span> – {positionApplied || "-"} ({status})
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <table className="min-w-full table-auto text-sm border-collapse">
              <tbody className="divide-y divide-gray-300">
                <tr>
                  <td className="px-4 py-2 font-semibold">👤 Full Name</td>
                  <td>{applicantName}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">💼 Position</td>
                  <td>{positionApplied || "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">⚡ Experience</td>
                  <td>{experienceYears || "-"} {experienceYears ? "years" : ""}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">🛠 Skills</td>
                  <td>{skillsServices?.join(", ") || "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">🛠 Construction Skills</td>
                  <td>{constructionSkills?.join(", ") || "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">📜 Certifications</td>
                  <td>{certifications?.join(" | ") || "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">🎓 Education</td>
                  <td>{educationLevel || "-"} in {fieldOfStudy || "-"} ({institutionName || "-"})</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">📝 Description</td>
                  <td>{description || "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">📅 Availability</td>
                  <td>{availability || "-"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">⏱ Overtime</td>
                  <td>{overtime ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">📆 Weekends</td>
                  <td>{weekends ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Employment Type</td>
                  <td>{employmentType || "-"}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-3 mt-4">
              {status === "pending" ? (
                <>
                  <Button onClick={() => approveJob(id)} variant="outline" className="text-black border-black">
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => rejectJob(id)} variant="outline" className="text-red-600 border-red-600">
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <span className={`font-bold px-4 py-2 rounded-full text-sm ${status === "approved" ? "bg-gray-200 text-black" : "bg-gray-300 text-black"}`}>
                  {status === "approved" ? "✅ Approved" : "❌ Rejected"}
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
  const {
    id,
    applicantName,
    status,
    companyName,
    contractorType,
    licenseNumber,
    licenseExpiry,
    experienceYears,
    skillsServices,
    certifications,
    insurance,
  } = contractor;

  return (
    <Card key={id} className="border border-gray-300 rounded-xl shadow-sm bg-white">
      <CardContent className="p-4 flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">{applicantName}</span> – {contractorType || "-"} ({status})
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <table className="min-w-full table-auto text-sm border-collapse">
              <tbody className="divide-y divide-gray-300">
                <tr><td className="px-4 py-2 font-semibold">👤 Full Name</td><td>{applicantName}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🏢 Company</td><td>{companyName || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Type</td><td>{contractorType || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">License Number</td><td>{licenseNumber || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">License Expiry</td><td>{licenseExpiry || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Experience (Years)</td><td>{experienceYears || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Skills</td><td>{skillsServices?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Certifications</td><td>{certifications?.join(" | ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Insurance</td><td>{insurance?.join(" | ") || "-"}</td></tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-3 mt-4">
              {status === "pending" ? (
                <>
                  <Button onClick={() => approveJob(id)} variant="outline" className="text-black border-black">
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => rejectJob(id)} variant="outline" className="text-red-600 border-red-600">
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <span className={`font-bold px-4 py-2 rounded-full text-sm ${status === "approved" ? "bg-gray-200 text-black" : "bg-gray-300 text-black"}`}>
                  {status === "approved" ? "✅ Approved" : "❌ Rejected"}
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
  const {
    id,
    applicantName,
    status,
    positionAppliedDesigner,
    designSkills,
    tools,
    portfolio,
    certifications,
    educationLevelDesigner,
    fieldOfStudyDesigner,
    institutionDesigner,
  } = designer;

  return (
    <Card key={id} className="border border-gray-300 rounded-xl shadow-sm bg-white">
      <CardContent className="p-4 flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">{applicantName}</span> – {positionAppliedDesigner || "-"} ({status})
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            <table className="min-w-full table-auto text-sm border-collapse">
              <tbody className="divide-y divide-gray-300">
                <tr><td className="px-4 py-2 font-semibold">👤 Full Name</td><td>{applicantName}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Position Applied</td><td>{positionAppliedDesigner || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Design Skills</td><td>{designSkills?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Tools</td><td>{tools?.join(", ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Portfolio</td><td>{portfolio || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Certifications</td><td>{certifications?.join(" | ") || "-"}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">Education</td><td>{educationLevelDesigner || "-"} in {fieldOfStudyDesigner || "-"} ({institutionDesigner || "-"})</td></tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-3 mt-4">
              {status === "pending" ? (
                <>
                  <Button onClick={() => approveJob(id)} variant="outline" className="text-black border-black">
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => rejectJob(id)} variant="outline" className="text-red-600 border-red-600">
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <span className={`font-bold px-4 py-2 rounded-full text-sm ${status === "approved" ? "bg-gray-200 text-black" : "bg-gray-300 text-black"}`}>
                  {status === "approved" ? "✅ Approved" : "❌ Rejected"}
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

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["workers", "contractors", "designers"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-6">
        {activeTab === "workers" && (
          workerApplications.length > 0
            ? workerApplications.map(w => <WorkerCard key={w.id} worker={w} approveJob={approveJob} rejectJob={rejectJob} />)
            : <p className="text-gray-500 italic">No worker applications</p>
        )}

        {activeTab === "contractors" && (
          contractorApplications.length > 0
            ? contractorApplications.map(c => <ContractorCard key={c.id} contractor={c} approveJob={approveJob} rejectJob={rejectJob} />)
            : <p className="text-gray-500 italic">No contractor applications</p>
        )}

        {activeTab === "designers" && (
          designerApplications.length > 0
            ? designerApplications.map(d => <DesignerCard key={d.id} designer={d} approveJob={approveJob} rejectJob={rejectJob} />)
            : <p className="text-gray-500 italic">No designer applications</p>
        )}
      </div>
    </div>
  );
};

export default JobDashboard; 
