
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
    name: '',
    email: '',
    cvText: '',
    geminiApiKey: ''
  });

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const foundJob = jobs.find((j: Job) => j.id === id);
    setJob(foundJob || null);
  }, [id]);

  const analyzeCV = async (cvText: string, jobRequirements: string, jobSkills: string[], apiKey: string) => {
    try {
      const prompt = `
        Please analyze this CV against the job requirements and provide a detailed assessment:

        JOB REQUIREMENTS:
        ${jobRequirements}

        REQUIRED SKILLS:
        ${jobSkills.join(', ')}

        CV CONTENT:
        ${cvText}

        Please provide:
        1. A compatibility score (0-100)
        2. Detailed analysis of strengths and weaknesses
        3. Missing skills or qualifications
        4. Recommendations for improvement

        Format your response as JSON with the following structure:
        {
          "score": <number>,
          "analysis": "<detailed analysis>",
          "strengths": ["<strength1>", "<strength2>"],
          "weaknesses": ["<weakness1>", "<weakness2>"],
          "missingSkills": ["<skill1>", "<skill2>"],
          "recommendations": ["<recommendation1>", "<recommendation2>"]
        }
      `;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze CV with Gemini API');
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      
      try {
        const cleanedText = analysisText.replace(/```json\n?/, '').replace(/```\n?$/, '');
        return JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError);
        return {
          score: 50,
          analysis: analysisText,
          strengths: [],
          weaknesses: [],
          missingSkills: [],
          recommendations: []
        };
      }
    } catch (error) {
      console.error('Error analyzing CV:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.geminiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to analyze the CV",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Analyze CV with Gemini
      const analysis = await analyzeCV(
        formData.cvText,
        job!.requirements,
        job!.skills,
        formData.geminiApiKey
      );

      // Create application
      const application = {
        id: Date.now().toString(),
        jobId: id!,
        applicantName: formData.name,
        applicantEmail: formData.email,
        cvText: formData.cvText,
        score: analysis.score,
        analysis: JSON.stringify(analysis),
        submittedAt: new Date().toISOString()
      };

      // Store application
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      applications.push(application);
      localStorage.setItem('applications', JSON.stringify(applications));

      toast({
        title: "Application submitted successfully!",
        description: `Your CV scored ${analysis.score}% compatibility with this role`,
      });

      navigate(`/job/${id}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error submitting application",
        description: "Failed to analyze CV. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-large font-bold mb-4">Job Not Found</h1>
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
              <Link to={`/job/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Job
              </Link>
            </Button>
            <h1 className="text-large font-bold text-primary">Apply for Job</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-medium">Submit Your Application</CardTitle>
                <CardDescription className="text-small">
                  Fill in your details and paste your CV text for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-small">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="text-small"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-small">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="text-small"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geminiApiKey" className="text-small">Gemini API Key</Label>
                    <Input
                      id="geminiApiKey"
                      type="password"
                      value={formData.geminiApiKey}
                      onChange={(e) => setFormData({...formData, geminiApiKey: e.target.value})}
                      placeholder="Enter your Gemini API key for CV analysis"
                      required
                      className="text-small"
                    />
                    <p className="text-small text-muted-foreground">
                      Your API key is used only for this analysis and is not stored
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvText" className="text-small">
                      CV Content
                      <span className="text-muted-foreground ml-2">(paste your CV text here)</span>
                    </Label>
                    <Textarea
                      id="cvText"
                      value={formData.cvText}
                      onChange={(e) => setFormData({...formData, cvText: e.target.value})}
                      placeholder="Paste your CV content here..."
                      required
                      className="text-small min-h-[300px]"
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing CV...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Job Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-medium">{job.title}</CardTitle>
                <CardDescription className="text-small">{job.company}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-small font-semibold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded text-small"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-small font-semibold mb-2">Experience Level</h4>
                  <p className="text-small text-muted-foreground">{job.experienceLevel}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="text-small font-semibold mb-2">How it works</h4>
                  <ol className="text-small text-muted-foreground space-y-1">
                    <li>1. Enter your details</li>
                    <li>2. Provide Gemini API key</li>
                    <li>3. Paste your CV text</li>
                    <li>4. AI analyzes your fit</li>
                    <li>5. Get instant scoring</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
