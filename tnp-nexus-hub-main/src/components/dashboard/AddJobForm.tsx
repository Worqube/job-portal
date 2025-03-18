
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  PlusIcon, 
  XIcon 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Company {
  id: string;
  name: string;
}

interface AddJobFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

const AddJobForm = ({ onSuccess, onCancel, initialData }: AddJobFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    company_id: '',
    role: '',
    location: '',
    type: 'Full-time',
    salary_range: '',
    description: '',
    deadline: '',
    is_active: true,
    skills: [] as string[],
    eligibility_criteria: {
      cgpa: '7.0',
      branch: [] as string[],
      backlogs: '0',
    },
  });
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
    if (initialData) {
      populateFormWithInitialData();
    }
  }, [initialData]);

  const populateFormWithInitialData = () => {
    setFormData({
      company_id: initialData.company_id || '',
      role: initialData.role || '',
      location: initialData.location || '',
      type: initialData.type || 'Full-time',
      salary_range: initialData.salary_range || '',
      description: initialData.description || '',
      deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
      is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      skills: initialData.required_skills || [],
      eligibility_criteria: {
        cgpa: initialData.eligibility_criteria?.cgpa || '7.0',
        branch: initialData.eligibility_criteria?.branch || [],
        backlogs: initialData.eligibility_criteria?.backlogs || '0',
      },
    });
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      
      setCompanies(data || []);
      
      // If no company is selected and we have companies, select the first one
      if (!formData.company_id && data && data.length > 0) {
        setFormData(prev => ({ ...prev, company_id: data[0].id }));
      }
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load companies.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEligibilityChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      eligibility_criteria: {
        ...prev.eligibility_criteria,
        [field]: value
      }
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
    }
    
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const toggleBranch = (branch: string) => {
    const branches = [...formData.eligibility_criteria.branch];
    
    if (branches.includes(branch)) {
      // Remove branch
      handleEligibilityChange('branch', branches.filter(b => b !== branch));
    } else {
      // Add branch
      handleEligibilityChange('branch', [...branches, branch]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role || !formData.company_id || !formData.description) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const jobData = {
        company_id: formData.company_id,
        role: formData.role,
        location: formData.location,
        type: formData.type,
        salary_range: formData.salary_range,
        description: formData.description,
        deadline: formData.deadline || null,
        is_active: formData.is_active,
        required_skills: formData.skills,
        eligibility_criteria: formData.eligibility_criteria,
      };
      
      if (initialData?.id) {
        // Update existing job
        const { error } = await supabase
          .from('job_listings')
          .update({
            ...jobData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id);
          
        if (error) throw error;
        
        toast({
          title: 'Job updated',
          description: 'The job listing has been updated successfully.',
        });
      } else {
        // Create new job
        const { error } = await supabase
          .from('job_listings')
          .insert(jobData);
          
        if (error) throw error;
        
        toast({
          title: 'Job created',
          description: 'The job listing has been created successfully.',
        });
      }
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast({
        title: 'Error',
        description: `Failed to ${initialData ? 'update' : 'create'} job listing.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Select 
              value={formData.company_id} 
              onValueChange={(value) => handleSelectChange('company_id', value)}
            >
              <SelectTrigger id="company">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Job Title / Role *</Label>
            <Input 
              id="role" 
              name="role" 
              value={formData.role} 
              onChange={handleInputChange} 
              placeholder="e.g. Software Engineer"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              name="location" 
              value={formData.location} 
              onChange={handleInputChange} 
              placeholder="e.g. Pune, India"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary_range">Salary Range</Label>
            <Input 
              id="salary_range" 
              name="salary_range" 
              value={formData.salary_range} 
              onChange={handleInputChange} 
              placeholder="e.g. 10-15 LPA"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description *</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Describe the job role, responsibilities, and requirements..."
            rows={6}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input 
              id="deadline" 
              name="deadline" 
              type="date"
              value={formData.deadline} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="space-y-2 flex items-end">
            <Select 
              value={formData.is_active.toString()} 
              onValueChange={(value) => handleSelectChange('is_active', value === 'true')}
            >
              <SelectTrigger id="is_active">
                <SelectValue placeholder="Job status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Required Skills</h3>
        
        <div className="flex gap-2">
          <Input 
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill e.g. React, Java, AWS"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
          />
          <Button 
            type="button"
            variant="outline"
            onClick={handleAddSkill}
          >
            <PlusIcon size={16} />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <Badge key={index} className="px-3 py-1.5 flex items-center gap-1.5">
              {skill}
              <button 
                type="button"
                className="w-4 h-4 rounded-full hover:bg-primary/20 flex items-center justify-center"
                onClick={() => handleRemoveSkill(skill)}
              >
                <XIcon size={12} />
              </button>
            </Badge>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Eligibility Criteria</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cgpa">Minimum CGPA</Label>
            <Input 
              id="cgpa" 
              value={formData.eligibility_criteria.cgpa} 
              onChange={(e) => handleEligibilityChange('cgpa', e.target.value)} 
              placeholder="e.g. 7.0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backlogs">Maximum Backlogs</Label>
            <Input 
              id="backlogs" 
              value={formData.eligibility_criteria.backlogs} 
              onChange={(e) => handleEligibilityChange('backlogs', e.target.value)} 
              placeholder="e.g. 0"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Eligible Branches</Label>
          <div className="flex flex-wrap gap-2">
            {['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical', 'Civil'].map((branch) => (
              <Badge 
                key={branch}
                variant={formData.eligibility_criteria.branch.includes(branch) ? 'default' : 'outline'}
                className="px-3 py-1.5 cursor-pointer"
                onClick={() => toggleBranch(branch)}
              >
                {branch}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-1.5 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Job' : 'Create Job'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddJobForm;
