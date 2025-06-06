import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Briefcase,
  Users,
  Star,
  Building,
  Clock,
  Zap,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  skills: string[];
  experienceLevel: string;
  createdAt: string;
  applications?: number;
  aiGrading?: boolean;
  applicationDeadline?: string;
}

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    skills: "",
    experienceLevel: "Mid-level",
    aiGrading: true,
    applicationDeadline: "",
  });

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const storedApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    const jobsWithApplications = storedJobs.map((job: Job) => ({
      ...job,
      applications: storedApplications.filter(
        (app: any) => app.jobId === job.id
      ).length,
    }));

    setJobs(jobsWithApplications);
  }, []);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();

    const job: Job = {
      id: Date.now().toString(),
      title: newJob.title,
      company: newJob.company,
      description: newJob.description,
      requirements: newJob.requirements,
      skills: newJob.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experienceLevel: newJob.experienceLevel,
      createdAt: new Date().toISOString(),
      applications: 0,
      aiGrading: newJob.aiGrading,
      applicationDeadline: newJob.applicationDeadline,
    };

    const updatedJobs = [...jobs, job];
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    setNewJob({
      title: "",
      company: "",
      description: "",
      requirements: "",
      skills: "",
      experienceLevel: "Mid-level",
      aiGrading: true,
      applicationDeadline: "",
    });

    setShowCreateDialog(false);

    toast({
      title: "🎉 Job created successfully!",
      description:
        "Your job posting is now live and ready to receive applications",
    });
  };

  const totalApplications = jobs.reduce(
    (sum, job) => sum + (job.applications || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              >
                AI CV Grader
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-lg font-semibold text-gray-700">
                Admin Dashboard
              </span>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              <Link to="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalApplications}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Avg. Applications
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.length > 0
                    ? Math.round(totalApplications / jobs.length)
                    : 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header with Create Button */}
    <div className="flex justify-between items-center mb-8 ">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
            <p className="text-gray-600 mt-1">
              Manage and create job opportunities
            </p>
          </div>
          <div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Job
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] bg-white rounded-2xl border-0 shadow-2xl overflow-hidden">
              <div className="max-h-[85vh] overflow-y-auto">
                <DialogHeader className="pb-6 px-6 pt-6">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Create New Job Posting
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Fill in the details to create an attractive job posting that
                    will attract top talent
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateJob} className="space-y-6 px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Job Title
                      </Label>
                      <Input
                        id="title"
                        value={newJob.title}
                        onChange={(e) =>
                          setNewJob({ ...newJob, title: e.target.value })
                        }
                        required
                        className="h-12  border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Senior React Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={newJob.company}
                        onChange={(e) =>
                          setNewJob({ ...newJob, company: e.target.value })
                        }
                        required
                        className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Tech Innovations Inc."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Job Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newJob.description}
                      onChange={(e) =>
                        setNewJob({ ...newJob, description: e.target.value })
                      }
                      required
                      className="min-h-[100px] border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="requirements"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Requirements & Qualifications
                    </Label>
                    <Textarea
                      id="requirements"
                      value={newJob.requirements}
                      onChange={(e) =>
                        setNewJob({ ...newJob, requirements: e.target.value })
                      }
                      required
                      className="min-h-[100px] border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="List the required skills, experience, and qualifications..."
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="skills"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Skills & Technologies
                      </Label>
                      <Input
                        id="skills"
                        value={newJob.skills}
                        onChange={(e) =>
                          setNewJob({ ...newJob, skills: e.target.value })
                        }
                        placeholder="React, TypeScript, Node.js, MongoDB"
                        className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500">
                        Separate skills with commas
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="experienceLevel"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Experience Level
                      </Label>
                      <select
                        id="experienceLevel"
                        value={newJob.experienceLevel}
                        onChange={(e) =>
                          setNewJob({
                            ...newJob,
                            experienceLevel: e.target.value,
                          })
                        }
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Entry-level">Entry-level</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior">Senior</option>
                        <option value="Lead">Lead</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="applicationDeadline"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Application Deadline
                    </Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={newJob.applicationDeadline}
                      onChange={(e) =>
                        setNewJob({
                          ...newJob,
                          applicationDeadline: e.target.value,
                        })
                      }
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-xs"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-gray-500">
                      AI grading will start automatically after this deadline
                    </p>
                  </div>

                  {/* AI Grading Toggle */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                          <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            AI-Powered Grading
                          </h3>
                          <p className="text-sm text-gray-600">
                            Automatically evaluate and score applications using AI
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">
                          {newJob.aiGrading ? "Enabled" : "Manual"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setNewJob({ ...newJob, aiGrading: !newJob.aiGrading })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            newJob.aiGrading ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              newJob.aiGrading ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                      className="px-6 py-3 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Create Job Posting
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
          </div>
      
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-0 p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No jobs posted yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first job posting to start receiving applications from
              talented candidates
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        job.applications && job.applications > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {job.applications || 0} applications
                    </span>
                    {job.aiGrading && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Zap className="h-3 w-3 mr-1" />
                        AI Grading
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-gray-700">
                      {job.experienceLevel}
                    </span>
                    {job.applicationDeadline && (
                      <span
                        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          new Date(job.applicationDeadline) > new Date()
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        Deadline:{" "}
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg px-4 py-2 font-medium"
                  >
                    <Link to={`/job/${job.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
