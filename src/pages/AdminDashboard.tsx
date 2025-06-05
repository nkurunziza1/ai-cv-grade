
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Briefcase, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
}

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    skills: '',
    experienceLevel: 'Mid-level'
  });

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    const jobsWithApplications = storedJobs.map((job: Job) => ({
      ...job,
      applications: storedApplications.filter((app: any) => app.jobId === job.id).length
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
      skills: newJob.skills.split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel: newJob.experienceLevel,
      createdAt: new Date().toISOString(),
      applications: 0
    };

    const updatedJobs = [...jobs, job];
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));

    setNewJob({
      title: '',
      company: '',
      description: '',
      requirements: '',
      skills: '',
      experienceLevel: 'Mid-level'
    });
    
    setShowCreateDialog(false);
    
    toast({
      title: "Job created successfully",
      description: "The job posting is now live",
    });
  };

  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-large font-bold text-primary">
                AI CV Grader
              </Link>
              <span className="text-small text-muted-foreground">/ Admin Dashboard</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-small font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-large font-bold">{jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-small font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-large font-bold">{totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-small font-medium">Avg. Applications</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-large font-bold">
                {jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-large font-bold">Job Postings</h1>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-medium">Create New Job</DialogTitle>
                <DialogDescription className="text-small">
                  Fill in the details for the new job posting
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-small">Job Title</Label>
                    <Input
                      id="title"
                      value={newJob.title}
                      onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                      required
                      className="text-small"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-small">Company</Label>
                    <Input
                      id="company"
                      value={newJob.company}
                      onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                      required
                      className="text-small"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-small">Description</Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    required
                    className="text-small min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-small">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                    required
                    className="text-small min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-small">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                    placeholder="e.g., React, TypeScript, Node.js"
                    className="text-small"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel" className="text-small">Experience Level</Label>
                  <select
                    id="experienceLevel"
                    value={newJob.experienceLevel}
                    onChange={(e) => setNewJob({...newJob, experienceLevel: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-small ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Job</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-medium font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-small text-muted-foreground text-center mb-4">
                Create your first job posting to start receiving applications
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-medium">{job.title}</CardTitle>
                      <CardDescription className="text-small">{job.company}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-small">
                      {job.applications} applications
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-small text-muted-foreground mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-small">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="outline" className="text-small">
                        +{job.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-small text-muted-foreground">
                      {job.experienceLevel}
                    </span>
                    <Button asChild size="sm">
                      <Link to={`/job/${job.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
