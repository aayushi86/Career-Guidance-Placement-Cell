import { useEffect, useState } from "react";
import { request } from "../services/api";

console.log("🔥 INSIDE MY APPLICATIONS COMPONENT 🔥");

console.log("MyApplications Page Loaded");

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    console.log("🔥 USE EFFECT RUNNING 🔥");
    
    const fetchApplications = async () => {
      try {

        const user = JSON.parse(localStorage.getItem("user"));
        const res = await request(`/jobs/my-applications?email=${user.email}`);       
        console.log("MY APPLICATION API FULL:", JSON.stringify(res, null, 2));
        if (res.success) {
          setApplications(res.applications || []);
        }
      } catch (error) {
        console.log("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

    {/* HEADER */}
    <div className="bg-slate-900 text-white rounded-3xl p-6 flex justify-between items-center shadow-xl">
      <div>
        <h1 className="text-3xl font-black">My Applications</h1>
        <p className="text-sm text-slate-300 mt-1">
          Track your job applications & status
        </p>
      </div>
    </div>

    {/* TABLE */}
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      
      {applications.length === 0 ? (
        <p className="text-slate-500 text-base">No applications found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">

            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100 text-sm">
              <tr>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Interview</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition">

                  {/* ROLE */}
                  <td className="py-3 px-4 font-bold text-slate-900 text-base">
                    {app.jobTitle}
                  </td>

                  {/* COMPANY */}
                  <td className="py-3 px-4 text-blue-600 font-semibold text-base">
                    {app.companyName}
                  </td>

                  {/* STATUS */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full font-bold text-xs
                        ${
                          app.status === "Selected"
                            ? "bg-green-50 text-green-600"
                            : app.status === "Rejected"
                            ? "bg-red-50 text-red-500"
                            : app.status === "Interview Scheduled"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {app.status}
                    </span>

                    {/* EXTRA MESSAGE */}
                    {app.status === "Selected" && (
                      <p className="text-green-600 text-sm mt-1 font-bold">
                        🎉 Selected
                      </p>
                    )}
                  </td>

                  {/* INTERVIEW */}
                  <td className="py-3 px-4 text-sm">

                    {app.status === "Interview Scheduled" ? (
                      <>
                        <p className="font-medium">{app.interviewDate}</p>
                        <p className="text-slate-500">{app.interviewTime}</p>

                        {app.interviewLink && (
                          <a
                            href={app.interviewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline font-bold"
                          >
                            Join Interview
                          </a>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  </div>
);
};

export default MyApplications;