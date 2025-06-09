import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Zap } from "lucide-react";

const Index = () => {
  const { user, logout } = useAuth();

  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI-Based-Document-verification
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 font-medium">
                    Welcome, {user.name}
                  </span>
                  {user.isAdmin && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-0 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <Link to="/admin">Admin Dashboard</Link>
                    </Button>
                  )}
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-6"
                  >
                    <Link to="/register">Join now</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Document Verification Platform
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Streamline your recruitment process with intelligent CV analysis.
            Our AI evaluates candidates against job specifications and provides
            detailed scoring.
          </p>
          {!user && (
            <div className="flex justify-center space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-8 py-3 text-lg font-semibold"
              >
                <Link to="/register">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features of our ai
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need to manage recruitment efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border-0">
              <div className="bg-blue-100 p-3 rounded-xl w-fit mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Job Management
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Create detailed job postings with specific requirements and
                qualifications.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border-0">
              <div className="bg-purple-100 p-3 rounded-xl w-fit mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                AI Analysis
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI powered by Gemini analyzes CVs against job
                specifications.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border-0">
              <div className="bg-green-100 p-3 rounded-xl w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Scoring
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Get detailed scores and rankings for all applicants
                automatically.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border-0">
              <div className="bg-orange-100 p-3 rounded-xl w-fit mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Dashboard
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Intuitive admin interface to manage jobs and review
                applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Job Opportunities
              </h3>
              <p className="text-lg text-gray-600">
                Explore current openings and apply today
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border-0 group"
                >
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 py-2 font-semibold"
                  >
                    <Link to={`/job/${job.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 AI CV Grader. Powered by advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
