import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Building,
  Clock,
  Award,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  skills: string[];
  experienceLevel: string;
  createdAt: string;
}

interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  cvText: string;
  score?: number;
  analysis?: string;
  submittedAt: string;
  // AI fields
  skillsMatch?: string[];
  experienceYears?: number;
  status?: string;
  summary?: string;
  appliedDate?: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBkIAgT8SBMwpitI-rOM-jrBLnCn2KTxf8';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [graded, setGraded] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [deadlineReached, setDeadlineReached] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const foundJob = jobs.find((j: Job) => j.id === id);
    setJob(foundJob || null);
    // Check if deadline reached (assume job.createdAt + 7 days for demo)
    if (foundJob) {
      const deadline = new Date(foundJob.createdAt);
      deadline.setDate(deadline.getDate() + 7);
      setDeadlineReached(new Date() >= deadline);
    }
    if (user?.isAdmin) {
      const allApplications = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );
      const jobApplications = allApplications.filter(
        (app: Application) => app.jobId === id
      );
      setApplications(jobApplications);
      // Load sorted/graded list from localStorage if exists
      const gradedKey = `graded_${id}`;
      const gradedList = JSON.parse(localStorage.getItem(gradedKey) || "null");
      if (gradedList && Array.isArray(gradedList)) {
        setGraded(gradedList);
        setSorted(true);
      } else {
        setGraded([]);
        setSorted(false);
      }
    } else if (user) {
      // For applicants, find their own application
      const allApplications = JSON.parse(localStorage.getItem("applications") || "[]");
      const myApp = allApplications.find((app: Application) => app.jobId === id && app.applicantEmail === user.email);
      setSelectedApplicant(myApp || null);
      // Check if sorted
      const gradedKey = `graded_${id}`;
      const gradedList = JSON.parse(localStorage.getItem(gradedKey) || "null");
      setSorted(!!gradedList && Array.isArray(gradedList) && gradedList.length > 0);
    }
  }, [id, user]);

  useEffect(() => {
    if (user?.isAdmin && applications.length > 0 && deadlineReached) {
      fetchAndGradeApplications();
    }
    // eslint-disable-next-line
  }, [applications.length, user, deadlineReached]);

  // Helper to summarize document types for prompt
  const summarizeDocuments = (documents: {fileName: string}[] = []) => {
    if (!documents.length) return "No documents provided.";
    // Try to classify by filename
    const sorted = [
      ...documents.filter(doc => /cv|resume/i.test(doc.fileName)),
      ...documents.filter(doc => /cover/i.test(doc.fileName)),
      ...documents.filter(doc => /cert/i.test(doc.fileName)),
      ...documents.filter(doc => !/cv|resume|cover|cert/i.test(doc.fileName)),
    ];
    return sorted.map(doc => `${doc.fileName}`).join("; ");
  };

  const aiPrompt = (job: Job, app: Application) => `You are an AI assistant helping a company evaluate applicants for a job.\n\nHere is the job description:\nTitle: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description}\nRequirements: ${job.requirements}\nSkills: ${job.skills.join(", ")}\nExperience Level: ${job.experienceLevel}\n\nThe applicant submitted these files: ${summarizeDocuments((app as any).documents)}\n\nEvaluate the applicant based on:\n- Required experience\n- Relevant skills\n- Education\n- Certifications\n- Cover letter relevance (if present)\n\nGive a score from 0 to 100 and explain why.\n\nReturn a JSON object: {score: number, skillsMatch: string[], experienceYears: number, status: string, summary: string}`;

  // Store sorted/graded applicants in localStorage
  const fetchAndGradeApplications = async () => {
    setLoading(true);
    const results: Application[] = [];
    for (const app of applications) {
      const prompt = aiPrompt(job!, app);
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt }
                  ]
                }
              ]
            })
          }
        );
        const data = await res.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          const match = content.match(/\{[\s\S]*\}/);
          parsed = match ? JSON.parse(match[0]) : null;
        }
        if (parsed) {
          results.push({
            ...app,
            ...parsed,
            appliedDate: app.submittedAt
          });
        }
      } catch (e) {
        results.push({
          ...app,
          score: 0,
          skillsMatch: [],
          experienceYears: 0,
          status: "Unknown",
          summary: "Could not grade."
        });
      }
    }
    // Sort by AI score descending
    results.sort((a, b) => (b.score || 0) - (a.score || 0));
    setGraded(results);
    setSorted(true);
    setLoading(false);
    // Store graded list in localStorage
    const gradedKey = `graded_${id}`;
    localStorage.setItem(gradedKey, JSON.stringify(results));
  };

  // On mount or when job/applications change, load graded list from localStorage if exists
  useEffect(() => {
    if (user?.isAdmin) {
      const gradedList = localStorage.getItem(`graded_applicants_${id}`);
      if (gradedList) {
        setGraded(JSON.parse(gradedList));
        setSorted(true);
      }
    }
  }, [id, user]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 50) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return "🏆";
    if (score >= 70) return "🥈";
    if (score >= 60) return "🥉";
    if (score >= 50) return "⭐";
    return "📋";
  };

  // Handler for admin to view applicant details (redirect to details page)
  const handleViewApplicant = (app: Application) => {
    navigate(`/applicant/${app.id}`);
  };

  // Handler for applicant to view their own application
  const handleViewSelf = (app: Application) => {
    navigate(`/application/${app.id}`);
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-0">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Job Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg"
            asChild
          >
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-blue-150">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mr-4 text-gray-600 hover:bg-gray-100"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Job Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-0">
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building className="h-5 w-5 mr-2" />
                    <span className="text-lg font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {!user?.isAdmin && (
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg px-8 py-3 font-semibold"
                    asChild
                  >
                    <Link to={`/apply/${job.id}`}>Apply Now</Link>
                  </Button>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    About this role
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Admin-only Graded Scores Section */}

                <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 py-4 rounded-r-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What we're looking for
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.requirements}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-0 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Job Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Posted on</p>
                    <p className="text-gray-600">
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Experience Level
                    </p>
                    <p className="text-gray-600">{job.experienceLevel}</p>
                  </div>
                </div>

                {user?.isAdmin && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Applications
                      </p>
                      <p className="text-gray-600">
                        {applications.length} received
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!user?.isAdmin && (
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-lg text-white">
                <h3 className="text-lg font-bold mb-2">Ready to Apply?</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Join our team and make an impact with your skills and
                  expertise
                </p>
                <Button
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 border-0 rounded-lg font-semibold"
                  asChild
                >
                  <Link to={`/apply/${job.id}`}>Apply for this Job</Link>
                </Button>
              </div>
            )}

            {/* Applications (Admin Only) */}
            {user?.isAdmin && applications.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-0">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Recent Applications
                </h3>
                <div className="space-y-4">
                  {(sorted && graded.length > 0 ? graded.slice(0, 5) : applications.slice(0, 5)).map((app) => (
                    <div
                      key={app.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewApplicant(app)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-semibold text-gray-900">
                          {app.applicantName}
                        </p>
                        {app.score && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              app.score >= 70
                                ? "bg-green-100 text-green-800"
                                : app.score >= 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.score}% match
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {app.applicantEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        Applied on {new Date(app.submittedAt || app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {(sorted && graded.length > 5) || (!sorted && applications.length > 5) ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        +{(sorted ? graded.length : applications.length) - 5} more applications
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  {sorted ? (
                    <span className="font-semibold text-purple-700">Sorted & graded by AI.</span>
                  ) : (
                    <span>Not yet sorted. You can sort & grade at any time.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* AI Graded Candidates Section */}
        {user?.isAdmin && (
          <div className="bg-gradient-to-r mt-20 from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                Candidate Scores & Rankings
              </h3>
            </div>
            {/* Always show the Sort & Grade Now button for admins */}
            <div className="flex justify-end mb-6">
              <Button
                onClick={fetchAndGradeApplications}
                disabled={loading || applications.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
              >
                {loading ? "Sorting..." : "Sort & Grade Now"}
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-lg text-gray-600">Grading candidates with AI...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {graded.length === 0 ? (
                  <div className="col-span-2 text-center text-gray-500 py-8">
                    No applications have been graded yet.
                  </div>
                ) : (
                  graded.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewApplicant(candidate)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {candidate.applicantName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {candidate.applicantEmail}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(
                              candidate.score
                            )}`}
                          >
                            <span className="mr-1">
                              {getScoreIcon(candidate.score)}
                            </span>
                            {candidate.score}%
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">
                            {candidate.experienceYears} years
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-gray-900">
                            {candidate.status}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Skills Match:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {candidate.skillsMatch?.map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Applied:</span>
                          <span className="text-gray-500">
                            {new Date(candidate.appliedDate!).toLocaleDateString()}
                          </span>
                        </div>
                        {candidate.summary && (
                          <div className="bg-gray-50 p-2 rounded mt-2 text-xs text-gray-700">
                            {candidate.summary}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="mt-4 text-xs text-gray-500">
              {sorted ? (
                <span className="font-semibold text-purple-700">Sorted & graded by AI. You can re-sort at any time.</span>
              ) : (
                <span>Not yet sorted. You can sort & grade at any time.</span>
              )}
            </div>
          </div>
        )}
        {/* Applicant's own application status (if not admin) */}
        {!user?.isAdmin && user && selectedApplicant && (
          <div className="bg-white mt-12 p-6 rounded-2xl shadow-lg border-0 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Application Status</h3>
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {selectedApplicant.applicantName}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span> {selectedApplicant.applicantEmail}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Applied on:</span> {new Date(selectedApplicant.submittedAt).toLocaleDateString()}
            </div>
            {sorted ? (
              <div className="mt-4 text-green-700 font-semibold">Applications have been sorted and graded. You can view your status in the results.</div>
            ) : (
              <div className="mt-4 text-blue-700 font-semibold">Applications have not been sorted yet. Please wait for the deadline or for the admin to sort and grade applications.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;


