import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
}

// Dummy graded scores data
const dummyGradedScores = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    score: 92,
    skillsMatch: ["React", "JavaScript", "Node.js"],
    experienceYears: 5,
    appliedDate: "2024-01-15",
    status: "Excellent",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    score: 87,
    skillsMatch: ["Python", "Machine Learning", "SQL"],
    experienceYears: 4,
    appliedDate: "2024-01-14",
    status: "Very Good",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@email.com",
    score: 76,
    skillsMatch: ["Java", "Spring Boot", "AWS"],
    experienceYears: 3,
    appliedDate: "2024-01-13",
    status: "Good",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    score: 68,
    skillsMatch: ["HTML", "CSS", "JavaScript"],
    experienceYears: 2,
    appliedDate: "2024-01-12",
    status: "Fair",
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    score: 54,
    skillsMatch: ["PHP", "MySQL"],
    experienceYears: 1,
    appliedDate: "2024-01-11",
    status: "Needs Improvement",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa.t@email.com",
    score: 83,
    skillsMatch: ["TypeScript", "React", "GraphQL"],
    experienceYears: 4,
    appliedDate: "2024-01-10",
    status: "Very Good",
  },
];

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const foundJob = jobs.find((j: Job) => j.id === id);
    setJob(foundJob || null);

    if (user?.isAdmin) {
      const allApplications = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );
      const jobApplications = allApplications.filter(
        (app: Application) => app.jobId === id
      );
      setApplications(jobApplications);
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
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
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
                        Applied on{" "}
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        +{applications.length - 5} more applications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {user?.isAdmin && (
          <div className="bg-gradient-to-r mt-20 from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                Candidate Scores & Rankings
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dummyGradedScores.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {candidate.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {candidate.email}
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
                        {candidate.skillsMatch.map((skill, index) => (
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
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
