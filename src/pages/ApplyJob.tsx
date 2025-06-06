import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, FileText, User, Mail, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  skills: string[];
  experienceLevel: string;
}

const ApplyJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cvText: "",
  });

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const foundJob = jobs.find((j: Job) => j.id === id);
    setJob(foundJob || null);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create application without AI analysis
      const application = {
        id: Date.now().toString(),
        jobId: id!,
        applicantName: formData.name,
        applicantEmail: formData.email,
        cvText: formData.cvText,
        submittedAt: new Date().toISOString(),
      };

      // Store application
      const applications = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );
      applications.push(application);
      localStorage.setItem("applications", JSON.stringify(applications));

      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      });

      navigate(`/job/${id}`);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error submitting application",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border-0">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Job Not Found
          </h1>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg"
          >
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
              <Link to={`/job/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Job
              </Link>
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Apply for Position
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-0">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Submit Your Application
                </h2>
                <p className="text-gray-600">
                  Tell us about yourself and why you're perfect for this role
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-12 pl-10 border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="h-12 pl-10 border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <Textarea
                    placeholder="Paste your CV content here or describe your experience, skills, and qualifications..."
                    value={formData.cvText}
                    onChange={(e) =>
                      setFormData({ ...formData, cvText: e.target.value })
                    }
                    required
                    className="min-h-[300px] pl-10 pt-3 border-gray-300 rounded-lg bg-gray-50 focus:bg-white transition-colors resize-none"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">
                        Application Tips
                      </h4>
                      <ul className="text-blue-800 text-sm mt-1 space-y-1">
                        <li>
                          • Highlight relevant experience and achievements
                        </li>
                        <li>
                          • Mention specific skills that match the job
                          requirements
                        </li>
                        <li>• Include quantifiable results when possible</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Job Summary */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border-0 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Building className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600 font-medium">
                    {job.company}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {job.title}
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Experience Level
                  </h4>
                  <p className="text-gray-600">{job.experienceLevel}</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-green-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Application Process
                  </h4>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center">
                      <span className="bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center mr-3 font-medium">
                        1
                      </span>
                      Complete application form
                    </li>
                    <li className="flex items-center">
                      <span className="bg-gray-300 text-gray-600 rounded-full text-xs w-5 h-5 flex items-center justify-center mr-3 font-medium">
                        2
                      </span>
                      Initial review by HR team
                    </li>
                    <li className="flex items-center">
                      <span className="bg-gray-300 text-gray-600 rounded-full text-xs w-5 h-5 flex items-center justify-center mr-3 font-medium">
                        3
                      </span>
                      Interview with hiring manager
                    </li>
                    <li className="flex items-center">
                      <span className="bg-gray-300 text-gray-600 rounded-full text-xs w-5 h-5 flex items-center justify-center mr-3 font-medium">
                        4
                      </span>
                      Final decision & offer
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
