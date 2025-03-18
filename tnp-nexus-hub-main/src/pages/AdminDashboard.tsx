
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  BarChart3Icon, 
  SearchIcon,
  PlusIcon,
  Loader2, 
  ArrowRightIcon,
  FilterIcon,
  XIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewStudentDialog, setViewStudentDialog] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: [],
    year: [],
    minCgpa: '',
    maxCgpa: '',
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [addJobDialog, setAddJobDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    role: '',
    company_id: '',
    location: '',
    description: '',
    type: 'Full-time',
    salary_range: '',
    deadline: '',
    required_skills: [],
    eligibility_criteria: {
      cgpa: 0,
      branch: [],
      backlogs: 0
    },
    is_active: true
  });
  const [companies, setCompanies] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Fetch students
  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab]);

  // Fetch jobs
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
      fetchCompanies();
    }
  }, [activeTab]);

  // Fetch stats for analytics
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to load student data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      
      // Start building the query
      let query = supabase.from('profiles').select('*');
      
      // Apply department filter
      if (filters.department.length > 0) {
        query = query.in('department', filters.department);
      }
      
      // Apply year filter
      if (filters.year.length > 0) {
        query = query.in('year', filters.year);
      }
      
      // Apply CGPA range filter
      if (filters.minCgpa !== '') {
        query = query.gte('cgpa', filters.minCgpa);
      }
      
      if (filters.maxCgpa !== '') {
        query = query.lte('cgpa', filters.maxCgpa);
      }
      
      // Execute the query
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setStudents(data || []);
      
      // Build active filters array for display
      const newActiveFilters = [];
      
      if (filters.department.length > 0) {
        newActiveFilters.push({
          id: 'department',
          label: `Department: ${filters.department.join(', ')}`
        });
      }
      
      if (filters.year.length > 0) {
        newActiveFilters.push({
          id: 'year',
          label: `Year: ${filters.year.join(', ')}`
        });
      }
      
      if (filters.minCgpa !== '' || filters.maxCgpa !== '') {
        const cgpaRange = `CGPA: ${filters.minCgpa || '0'} - ${filters.maxCgpa || 'Any'}`;
        newActiveFilters.push({
          id: 'cgpa',
          label: cgpaRange
        });
      }
      
      setActiveFilters(newActiveFilters);
      setFilterOpen(false);
      
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply filters',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      department: [],
      year: [],
      minCgpa: '',
      maxCgpa: '',
    });
    setActiveFilters([]);
    fetchStudents();
  };

  const removeFilter = (filterId) => {
    setActiveFilters(activeFilters.filter(filter => filter.id !== filterId));
    
    // Reset the corresponding filter
    setFilters(prev => {
      const newFilters = { ...prev };
      if (filterId === 'department') {
        newFilters.department = [];
      } else if (filterId === 'year') {
        newFilters.year = [];
      } else if (filterId === 'cgpa') {
        newFilters.minCgpa = '';
        newFilters.maxCgpa = '';
      }
      return newFilters;
    });
    
    // Reapply remaining filters
    fetchStudents().then(() => {
      if (activeFilters.length > 1) {
        applyFilters();
      }
    });
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_listings')
        .select(`
          *,
          companies(id, name, logo_url)
        `)
        .order('posted_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job listings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total students count
      const { count: studentsCount, error: studentsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get total jobs count
      const { count: jobsCount, error: jobsError } = await supabase
        .from('job_listings')
        .select('*', { count: 'exact', head: true });
      
      // Get total applications count
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true });
      
      if (studentsError || jobsError || applicationsError) {
        throw new Error('Error fetching statistics');
      }
      
      setStats({
        totalStudents: studentsCount || 0,
        totalJobs: jobsCount || 0,
        totalApplications: applicationsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const viewStudentDetails = async (student) => {
    setSelectedStudent(student);
    setViewStudentDialog(true);
  };

  const toggleDepartmentFilter = (department) => {
    setFilters(prev => {
      if (prev.department.includes(department)) {
        return {
          ...prev,
          department: prev.department.filter(d => d !== department)
        };
      } else {
        return {
          ...prev,
          department: [...prev.department, department]
        };
      }
    });
  };

  const toggleYearFilter = (year) => {
    setFilters(prev => {
      if (prev.year.includes(year)) {
        return {
          ...prev,
          year: prev.year.filter(y => y !== year)
        };
      } else {
        return {
          ...prev,
          year: [...prev.year, year]
        };
      }
    });
  };

  const addSkillToNewJob = () => {
    if (newSkill && !newJob.required_skills.includes(newSkill)) {
      setNewJob({
        ...newJob,
        required_skills: [...newJob.required_skills, newSkill]
      });
      setNewSkill('');
    }
  };

  const removeSkillFromNewJob = (skill) => {
    setNewJob({
      ...newJob,
      required_skills: newJob.required_skills.filter(s => s !== skill)
    });
  };

  const handleNewJobChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., eligibility_criteria.cgpa)
      const [parent, child] = name.split('.');
      setNewJob({
        ...newJob,
        [parent]: {
          ...newJob[parent],
          [child]: value
        }
      });
    } else {
      setNewJob({
        ...newJob,
        [name]: value
      });
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('job_listings')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);

      if (error) throw error;
      
      // Refresh the jobs list
      fetchJobs();
      
      toast({
        title: 'Success',
        description: `Job ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling job status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      });
    }
  };

  const handleEligibleBranchChange = (branch) => {
    setNewJob(prev => {
      const currentBranches = prev.eligibility_criteria.branch || [];
      let updatedBranches;
      
      if (currentBranches.includes(branch)) {
        updatedBranches = currentBranches.filter(b => b !== branch);
      } else {
        updatedBranches = [...currentBranches, branch];
      }
      
      return {
        ...prev,
        eligibility_criteria: {
          ...prev.eligibility_criteria,
          branch: updatedBranches
        }
      };
    });
  };

  const submitNewJob = async () => {
    try {
      // Validate required fields
      if (!newJob.role || !newJob.company_id || !newJob.description) {
        toast({
          title: 'Missing Fields',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('job_listings')
        .insert([{
          role: newJob.role,
          company_id: newJob.company_id,
          location: newJob.location,
          description: newJob.description,
          type: newJob.type,
          salary_range: newJob.salary_range,
          deadline: newJob.deadline || null,
          required_skills: newJob.required_skills.length > 0 ? newJob.required_skills : null,
          eligibility_criteria: Object.keys(newJob.eligibility_criteria).length > 0 
            ? newJob.eligibility_criteria 
            : null,
          is_active: newJob.is_active
        }]);

      if (error) throw error;
      
      // Reset the form and close dialog
      setNewJob({
        role: '',
        company_id: '',
        location: '',
        description: '',
        type: 'Full-time',
        salary_range: '',
        deadline: '',
        required_skills: [],
        eligibility_criteria: {
          cgpa: 0,
          branch: [],
          backlogs: 0
        },
        is_active: true
      });
      setAddJobDialog(false);
      
      // Refresh the jobs list
      fetchJobs();
      
      toast({
        title: 'Success',
        description: 'Job listing created successfully',
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job listing',
        variant: 'destructive',
      });
    }
  };

  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter(job => 
    job.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.companies?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // List of departments and years for filters (could be from API)
  const departmentOptions = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const jobTypeOptions = ['Full-time', 'Part-time', 'Internship', 'Contract'];
  const eligibleBranchOptions = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="students" className="flex items-center gap-1.5">
              <UsersIcon size={16} /> Students
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-1.5">
              <BriefcaseIcon size={16} /> Jobs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5">
              <BarChart3Icon size={16} /> Analytics
            </TabsTrigger>
          </TabsList>
          
          {(activeTab === 'students' || activeTab === 'jobs') && (
            <div className="relative w-full sm:w-auto">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        <TabsContent value="students" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <FilterIcon size={16} /> Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Students</h4>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Department</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {departmentOptions.map(department => (
                          <div key={department} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`department-${department}`} 
                              checked={filters.department.includes(department)}
                              onCheckedChange={() => toggleDepartmentFilter(department)}
                            />
                            <Label 
                              htmlFor={`department-${department}`}
                              className="text-sm"
                            >
                              {department}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Year</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {yearOptions.map(year => (
                          <div key={year} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`year-${year}`} 
                              checked={filters.year.includes(year)}
                              onCheckedChange={() => toggleYearFilter(year)}
                            />
                            <Label 
                              htmlFor={`year-${year}`}
                              className="text-sm"
                            >
                              {year}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">CGPA Range</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="min-cgpa" className="text-xs">Minimum</Label>
                          <Input
                            id="min-cgpa"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="Min"
                            value={filters.minCgpa}
                            onChange={e => setFilters({...filters, minCgpa: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="max-cgpa" className="text-xs">Maximum</Label>
                          <Input
                            id="max-cgpa"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="Max"
                            value={filters.maxCgpa}
                            onChange={e => setFilters({...filters, maxCgpa: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Reset
                      </Button>
                      <Button size="sm" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  {activeFilters.map((filter) => (
                    <Badge 
                      key={filter.id} 
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-1 bg-muted/50"
                    >
                      {filter.label}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => removeFilter(filter.id)}
                      >
                        <XIcon size={12} />
                      </Button>
                    </Badge>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={resetFilters}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading students...</span>
              </div>
            ) : (
              <>
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No students found matching your search criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>CGPA</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.full_name || 'N/A'}</TableCell>
                            <TableCell>{student.roll_number || 'N/A'}</TableCell>
                            <TableCell>{student.department || 'N/A'}</TableCell>
                            <TableCell>{student.year || 'N/A'}</TableCell>
                            <TableCell>{student.cgpa || 'N/A'}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewStudentDetails(student)}
                                className="flex items-center gap-1"
                              >
                                View <ArrowRightIcon size={14} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Job Listings</h2>
            <Button 
              className="flex items-center gap-1.5"
              onClick={() => setAddJobDialog(true)}
            >
              <PlusIcon size={16} /> Add New Job
            </Button>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading jobs...</span>
              </div>
            ) : (
              <>
                {filteredJobs.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No job listings found matching your search criteria.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                      <Card key={job.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{job.role}</CardTitle>
                              <CardDescription>
                                {job.companies?.name || 'Unknown Company'}
                              </CardDescription>
                            </div>
                            <div className={`px-2 py-1 text-xs rounded-full ${job.is_active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {job.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Location:</span>
                              <span>{job.location || 'Remote/Flexible'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Type:</span>
                              <span>{job.type || 'Full-time'}</span>
                            </div>
                            {job.salary_range && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Salary:</span>
                                <span>{job.salary_range}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex justify-between w-full">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleJobStatus(job.id, job.is_active)}
                            >
                              {job.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Students</CardTitle>
                <CardDescription>Registered students in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    stats.totalStudents
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Job Listings</CardTitle>
                <CardDescription>Active and inactive jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    stats.totalJobs
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Applications</CardTitle>
                <CardDescription>Total job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    stats.totalApplications
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Placement Statistics</CardTitle>
              <CardDescription>
                Overview of the placement process and student participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics coming soon. This section will include charts and graphs
                showing placement rates, company participation, and student performance metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Student details dialog */}
      <Dialog open={viewStudentDialog} onOpenChange={setViewStudentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>
              Detailed information about the selected student.
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
                    {selectedStudent.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{selectedStudent.full_name || 'N/A'}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email || 'No email'}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Roll Number</p>
                    <p>{selectedStudent.roll_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p>{selectedStudent.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Year</p>
                    <p>{selectedStudent.year || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">CGPA</p>
                    <p>{selectedStudent.cgpa || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{selectedStudent.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewStudentDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add new job dialog */}
      <Dialog open={addJobDialog} onOpenChange={setAddJobDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job Listing</DialogTitle>
            <DialogDescription>
              Create a new job opportunity for students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-right">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={newJob.role}
                  onChange={handleNewJobChange}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_id" className="text-right">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Select 
                  name="company_id"
                  value={newJob.company_id}
                  onValueChange={(value) => setNewJob({...newJob, company_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-right">
                  Job Type
                </Label>
                <Select 
                  name="type"
                  value={newJob.type}
                  onValueChange={(value) => setNewJob({...newJob, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={newJob.location}
                  onChange={handleNewJobChange}
                  placeholder="e.g. Bangalore, India"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary_range" className="text-right">
                  Salary Range
                </Label>
                <Input
                  id="salary_range"
                  name="salary_range"
                  value={newJob.salary_range}
                  onChange={handleNewJobChange}
                  placeholder="e.g. ₹10-15 LPA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-right">
                  Application Deadline
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={newJob.deadline}
                  onChange={handleNewJobChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newJob.description}
                onChange={handleNewJobChange}
                placeholder="Provide a detailed description of the job..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right">Required Skills</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="new-skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a required skill"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkillToNewJob();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addSkillToNewJob}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              
              {newJob.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newJob.required_skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => removeSkillFromNewJob(skill)}
                      >
                        <XIcon size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Eligibility Criteria</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eligibility_criteria.cgpa" className="text-right">
                    Minimum CGPA
                  </Label>
                  <Input
                    id="eligibility_criteria.cgpa"
                    name="eligibility_criteria.cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newJob.eligibility_criteria.cgpa}
                    onChange={handleNewJobChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eligibility_criteria.backlogs" className="text-right">
                    Maximum Allowed Backlogs
                  </Label>
                  <Input
                    id="eligibility_criteria.backlogs"
                    name="eligibility_criteria.backlogs"
                    type="number"
                    min="0"
                    value={newJob.eligibility_criteria.backlogs}
                    onChange={handleNewJobChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-right">Eligible Branches</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {eligibleBranchOptions.map((branch) => (
                    <div key={branch} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`branch-${branch}`}
                        checked={newJob.eligibility_criteria.branch?.includes(branch) || false}
                        onCheckedChange={() => handleEligibleBranchChange(branch)}
                      />
                      <Label 
                        htmlFor={`branch-${branch}`}
                        className="text-sm"
                      >
                        {branch}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="is_active"
                checked={newJob.is_active}
                onCheckedChange={(checked) => 
                  setNewJob({...newJob, is_active: checked === true})
                }
              />
              <Label htmlFor="is_active">Publish job immediately</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddJobDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitNewJob}>
              Create Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
