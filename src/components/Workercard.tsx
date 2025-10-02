import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface WorkerCardProps {
  worker: any;
  approveJob: (id: string) => void;
  rejectJob: (id: string) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, approveJob, rejectJob }) => {
  const [expanded, setExpanded] = useState(false);
  const {
    id,
    fullName,
    email,
    phone,
    positionApplied,
    experienceYears,
    skillsServices = [],
    constructionSkills = [],
    certifications = [],
    description,
    educationLevel,
    fieldOfStudy,
    institutionName,
    status,
  } = worker;

  return (
    <Card key={id} className="border border-gray-300 rounded-xl shadow-sm bg-white">
      <CardContent className="p-4 flex flex-col space-y-3">
        {/* Compact summary row */}
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">{fullName}</span> – {positionApplied} ({status})
          </div>
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Details" : "View Details"}
          </Button>
        </div>

        {/* Expanded full details */}
        {expanded && (
          <div className="mt-4 space-y-4">
            <table className="min-w-full table-auto text-sm border-collapse">
              <tbody className="divide-y divide-gray-300">
                <tr><td className="px-4 py-2 font-semibold">👤 Full Name</td><td>{fullName}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">✉ Email</td><td>{email}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">📞 Phone</td><td>{phone || '-'}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">💼 Position Applied</td><td>{positionApplied}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">📝 Description</td><td>{description || '-'}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🎓 Education</td><td>{educationLevel} in {fieldOfStudy} ({institutionName})</td></tr>
                <tr><td className="px-4 py-2 font-semibold">⚡ Experience</td><td>{experienceYears} {experienceYears > 1 ? 'years' : 'year'}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🛠 Construction Skills</td><td>{constructionSkills.length > 0 ? constructionSkills.join(', ') : '-'}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">🛠 Other Skills / Services</td><td>{skillsServices.length > 0 ? skillsServices.join(', ') : '-'}</td></tr>
                <tr><td className="px-4 py-2 font-semibold">📜 Certifications</td><td>{certifications.length > 0 ? certifications.join(' | ') : '-'}</td></tr>
              </tbody>
            </table>

            {/* Approve / Reject */}
            <div className="flex justify-end gap-3 mt-4">
              {status === 'pending' ? (
                <>
                  <Button
                    onClick={() => approveJob(id)}
                    variant="outline"
                    className="text-black border-black"
                  >
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>

                  <Button
                    onClick={() => rejectJob(id)}
                    variant="outline"
                    className="text-red-600 border-red-600"
                  >
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <span
                  className={`font-bold px-4 py-2 rounded-full text-sm ${
                    status === 'approved' ? 'bg-gray-200 text-black' : 'bg-gray-300 text-black'
                  }`}
                >
                  {status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default WorkerCard;