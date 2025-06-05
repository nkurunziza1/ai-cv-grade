
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, TrendingUp, Zap } from 'lucide-react';

const Index = () => {
  const { user, logout } = useAuth();

  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-large font-bold text-primary">AI CV Grader</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-small text-muted-foreground">Welcome, {user.name}</span>
                  {user.isAdmin && (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/admin">Admin Dashboard</Link>
                    </Button>
                  )}
                  <Button onClick={logout} variant="ghost" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            AI-Powered CV Grading Platform
          </h2>
          <p className="text-large text-muted-foreground mb-8 max-w-3xl mx-auto">
            Streamline your recruitment process with intelligent CV analysis. 
            Our AI evaluates candidates against job specifications and provides detailed scoring.
          </p>
          {!user && (
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-large font-bold text-foreground mb-4">
              Powerful Features
            </h3>
            <p className="text-medium text-muted-foreground">
              Everything you need to manage recruitment efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Briefcase className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-medium">Job Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-small">
                  Create detailed job postings with specific requirements and qualifications.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-medium">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-small">
                  Advanced AI powered by Gemini analyzes CVs against job specifications.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-medium">Smart Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-small">
                  Get detailed scores and rankings for all applicants automatically.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-medium">Easy Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-small">
                  Intuitive admin interface to manage jobs and review applications.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <section className="py-16 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-large font-bold text-foreground mb-4">
                Latest Job Opportunities
              </h3>
              <p className="text-medium text-muted-foreground">
                Explore current openings and apply today
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job: any) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-medium">{job.title}</CardTitle>
                    <CardDescription className="text-small">{job.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-small text-muted-foreground mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link to={`/job/${job.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-small text-muted-foreground">
            © 2024 AI CV Grader. Powered by advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
