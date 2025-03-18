import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Clock, MapPin, Search, ArrowUpRightIcon, BookmarkIcon, BriefcaseIcon, Building2, BadgeIndianRupee, Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const mockJobs = [
  {
    id: 1,
    company: 'Microsoft',
    role: 'Software Development Engineer',
    location: 'Pune, Maharashtra',
    salary: '18-24 LPA',
    postedDate: '2023-05-15',
    deadline: '2023-05-30',
    type: 'Full-time',
    eligibility: {
      cgpa: 8.0,
      branch: ['Computer', 'IT'],
      backlogs: 0,
    },
    description: 'Microsoft is seeking a talented Software Development Engineer to join our team. The ideal candidate will have strong programming skills and a passion for building innovative solutions.',
    skills: ['C++', 'Java', 'Data Structures', 'Algorithms', 'Cloud Computing'],
  },
  {
    id: 2,
    company: 'Google',
    role: 'Associate Product Manager',
    location: 'Bengaluru, Karnataka',
    salary: '25-32 LPA',
    postedDate: '2023-05-10',
    deadline: '2023-05-25',
    type: 'Full-time',
    eligibility: {
      cgpa: 8.5,
      branch: ['Computer', 'IT', 'Electronics'],
      backlogs: 0,
    },
    description: 'Google is looking for an Associate Product Manager to help define and launch innovative products. You will work closely with engineering teams to drive product development.',
    skills: ['Product Management', 'Data Analysis', 'UX Design', 'Technical Writing'],
  },
  {
    id: 3,
    company: 'Amazon',
    role: 'Software Development Engineer',
    location: 'Hyderabad, Telangana',
    salary: '20-28 LPA',
    postedDate: '2023-05-12',
    deadline: '2023-05-27',
    type: 'Full-time',
    eligibility: {
      cgpa: 7.5,
      branch: ['Computer', 'IT', 'Electronics'],
      backlogs: 0,
    },
    description: 'Amazon is seeking a Software Development Engineer to help build scalable, distributed systems. You will design and implement innovative solutions that directly impact Amazon customers.',
    skills: ['Java', 'Python', 'AWS', 'Distributed Systems'],
  },
  {
    id: 4,
    company: 'Adobe',
    role: 'UI/UX Designer',
    location: 'Noida, Uttar Pradesh',
    salary: '15-22 LPA',
    postedDate: '2023-05-14',
    deadline: '2023-05-29',
    type: 'Full-time',
    eligibility: {
      cgpa: 7.0,
      branch: ['Computer', 'IT'],
      backlogs: 0,
    },
    description: 'Adobe is looking for a talented UI/UX Designer to create engaging user experiences. You will work on designing intuitive interfaces for Adobe products.',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research'],
  },
];

const JobListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredJobs = mockJobs.filter((job) => 
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (job: typeof mockJobs[0]) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Job Listings</h1>
        <p className="text-muted-foreground">
          Browse available job opportunities from top companies
        </p>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by company, role, or location..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1.5">
            <Filter size={16} /> Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="eligible">Eligible For</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="animate-fade-in space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center p-10 glass-card">
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or check back later for new opportunities.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden transition-all duration-300 hover:shadow-elevation-medium">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 items-start">
                      <div className="bg-muted rounded-md h-10 w-10 flex items-center justify-center text-lg font-medium text-primary">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{job.role}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Building2 size={14} className="mr-1 text-muted-foreground" /> 
                          {job.company}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BookmarkIcon size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin size={14} className="mr-1.5" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <BadgeIndianRupee size={14} className="mr-1.5" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <BriefcaseIcon size={14} className="mr-1.5" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock size={14} className="mr-1.5" />
                      Deadline: {formatDate(job.deadline)}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="font-normal">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 4 && (
                      <Badge variant="secondary" className="font-normal">
                        +{job.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="pt-3 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Posted on {formatDate(job.postedDate)}
                  </div>
                  <Dialog open={showJobDetails && selectedJob?.id === job.id} onOpenChange={setShowJobDetails}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="btn-effect"
                        onClick={() => handleViewDetails(job)}
                      >
                        View Details <ArrowUpRightIcon size={14} className="ml-1.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      {selectedJob && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-xl">{selectedJob.role}</DialogTitle>
                            <DialogDescription className="flex items-center text-base font-medium">
                              <Building2 size={16} className="mr-1.5" /> 
                              {selectedJob.company}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Location</span>
                                <p className="font-medium flex items-center">
                                  <MapPin size={14} className="mr-1.5 text-primary" />
                                  {selectedJob.location}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Salary</span>
                                <p className="font-medium flex items-center">
                                  <BadgeIndianRupee size={14} className="mr-1.5 text-primary" />
                                  {selectedJob.salary}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Employment Type</span>
                                <p className="font-medium flex items-center">
                                  <BriefcaseIcon size={14} className="mr-1.5 text-primary" />
                                  {selectedJob.type}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Application Deadline</span>
                                <p className="font-medium flex items-center">
                                  <CalendarIcon size={14} className="mr-1.5 text-primary" />
                                  {formatDate(selectedJob.deadline)}
                                </p>
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="text-lg font-medium mb-2">Eligibility Criteria</h3>
                              <ul className="space-y-1">
                                <li className="text-sm flex items-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                                  Minimum CGPA: {selectedJob.eligibility.cgpa}
                                </li>
                                <li className="text-sm flex items-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                                  Eligible Branches: {selectedJob.eligibility.branch.join(', ')}
                                </li>
                                <li className="text-sm flex items-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                                  Active Backlogs: {selectedJob.eligibility.backlogs}
                                </li>
                              </ul>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">Job Description</h3>
                              <p className="text-sm">{selectedJob.description}</p>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedJob.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="font-normal">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowJobDetails(false)}>
                              Close
                            </Button>
                            <Button className="btn-effect">Check Eligibility</Button>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="eligible" className="animate-fade-in">
          <div className="text-center p-10 glass-card">
            <h3 className="text-lg font-medium">Eligible Jobs</h3>
            <p className="text-muted-foreground">
              Jobs for which you meet the eligibility criteria will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="applied" className="animate-fade-in">
          <div className="text-center p-10 glass-card">
            <h3 className="text-lg font-medium">Applied Jobs</h3>
            <p className="text-muted-foreground">
              Jobs that you have applied for will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="animate-fade-in">
          <div className="text-center p-10 glass-card">
            <h3 className="text-lg font-medium">Saved Jobs</h3>
            <p className="text-muted-foreground">
              Jobs that you have saved for later will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobListings;
