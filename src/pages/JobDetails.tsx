
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const foundJob = jobs.find((j: Job) => j.id === id);
    setJob(foundJob || null);

    if (user?.isAdmin) {
      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const jobApplications = allApplications.filter((app: Application) => app.jobId === id);
      setApplications(jobApplications);
    }
  }, [id, user]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-large font-bold mb-4">Job Not Found</h1>
          <p className="text-medium text-muted-foreground mb-4">
            The job you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-large font-bold text-primary">Job Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-large">{job.title}</CardTitle>
                    <CardDescription className="text-medium mt-2">{job.company}</CardDescription>
                  </div>
                  {!user?.isAdmin && (
                    <Button asChild>
                      <Link to={`/apply/${job.id}`}>Apply Now</Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-medium font-semibold mb-3">Job Description</h3>
                  <p className="text-small text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-medium font-semibold mb-3">Requirements</h3>
                  <p className="text-small text-muted-foreground leading-relaxed">
                    {job.requirements}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-medium font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-small">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-medium">Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-small font-medium">Posted</p>
                    <p className="text-small text-muted-foreground">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-small font-medium">Experience Level</p>
                    <p className="text-small text-muted-foreground">{job.experienceLevel}</p>
                  </div>
                </div>
                {user?.isAdmin && (
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-small font-medium">Applications</p>
                      <p className="text-small text-muted-foreground">
                        {applications.length} received
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {!user?.isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-medium">Ready to Apply?</CardTitle>
                  <CardDescription className="text-small">
                    Submit your CV and let our AI analyze your fit for this role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to={`/apply/${job.id}`}>Apply Now</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Applications (Admin Only) */}
            {user?.isAdmin && applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-medium">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-small font-medium">{app.applicantName}</p>
                        {app.score && (
                          <Badge variant={app.score >= 70 ? "default" : app.score >= 50 ? "secondary" : "destructive"}>
                            {app.score}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-small text-muted-foreground">{app.applicantEmail}</p>
                      <p className="text-small text-muted-foreground">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <p className="text-small text-muted-foreground text-center">
                      +{applications.length - 5} more applications
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
