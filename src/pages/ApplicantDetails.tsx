import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ApplicantDetails = () => {
  const { id } = useParams<{ id: string }>();
  // Get all applications from localStorage
  const allApplications = JSON.parse(localStorage.getItem("applications") || "[]");
  // Find the applicant by id
  const applicant = allApplications.find((app: any) => app.id === id);
   console.log("Applicant Details:", applicant);
  if (!applicant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-0">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Applicant Not Found</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 from-gray-200 to-blue-150 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-900 flex items-center gap-3">
          <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-lg font-bold">Applicant Details</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-2 text-gray-700"><span className="font-semibold">Name:</span> {applicant.applicantName}</div>
            <div className="mb-2 text-gray-700"><span className="font-semibold">Email:</span> {applicant.applicantEmail}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-700"><span className="font-semibold">Applied:</span> {new Date(applicant.appliedDate || applicant.submittedAt).toLocaleDateString()}</div>
          </div>
        </div>
        {/* AI Grading Analysis Section */}
        {applicant.analysis && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-blue-900 mb-4 text-xl flex items-center gap-2">
              <span className="inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-base">AI Grading Analysis</span>
              {applicant.analysis.category && (
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  applicant.analysis.category === 'Excellent' ? 'bg-green-100 text-green-800' :
                  applicant.analysis.category === 'Good' ? 'bg-blue-100 text-blue-800' :
                  applicant.analysis.category === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                  applicant.analysis.category === 'Poor' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {applicant.analysis.category}
                </span>
              )}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Skills</span>
                <span className="text-lg font-bold text-blue-800">{applicant.analysis.skillsScore ?? 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Experience</span>
                <span className="text-lg font-bold text-blue-800">{applicant.analysis.experienceScore ?? 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Education</span>
                <span className="text-lg font-bold text-blue-800">{applicant.analysis.educationScore ?? 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Cover Letter</span>
                <span className="text-lg font-bold text-blue-800">{applicant.analysis.coverLetterScore ?? 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center col-span-2 md:col-span-1">
                <span className="text-xs text-gray-500">Overall</span>
                <span className="text-2xl font-extrabold text-purple-700">{applicant.analysis.overallScore ?? 'N/A'}</span>
              </div>
            </div>
            {applicant.analysis.strengths && applicant.analysis.strengths.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-green-800">Strengths:</span>
                <ul className="list-disc list-inside ml-4 text-green-800 text-sm">
                  {applicant.analysis.strengths.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {applicant.analysis.weaknesses && applicant.analysis.weaknesses.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-red-800">Weaknesses:</span>
                <ul className="list-disc list-inside ml-4 text-red-800 text-sm">
                  {applicant.analysis.weaknesses.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            {applicant.analysis.recommendation && (
              <div className="mt-2 p-3 bg-blue-100 rounded text-blue-900 font-semibold">
                <span className="font-semibold">Recommendation:</span> {applicant.analysis.recommendation}
              </div>
            )}
          </div>
        )}
        {/* Documents Section */}
        <div className="mb-4">
          <span className="font-semibold">Documents:</span>
          <div className="space-y-2 mt-2">
            {applicant.documents && applicant.documents.length > 0 ? (
              (applicant.documents as {fileName: string; base64Data: string}[]).map((doc, idx) => (
                <div key={idx} className="bg-gray-50 p-2 rounded border flex flex-col gap-2 mb-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H4zm8 1.414L16.586 8H14a2 2 0 01-2-2V3.414z" /></svg>
                      {doc.fileName}
                    </span>
                    {doc.base64Data && doc.base64Data.startsWith("data:application/pdf") && (
                      <a
                        href={doc.base64Data}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-2 font-semibold"
                      >
                        Open PDF
                      </a>
                    )}
                  </div>
                  {doc.base64Data && doc.base64Data.startsWith("data:application/pdf") && (
                    <iframe
                      src={doc.base64Data}
                      title={doc.fileName}
                      className="w-full h-screen border rounded shadow"
                    />
                  )}
                </div>
              ))
            ) : (
              <span className="text-gray-500">No documents uploaded.</span>
            )}
          </div>
        </div>
        <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg shadow">
          <Link to={applicant.jobId ? `/job/${applicant.jobId}` : "/"}>Back to Job Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default ApplicantDetails;
