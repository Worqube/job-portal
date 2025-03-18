
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Loader2, MapPinIcon, CalendarIcon, BriefcaseIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  created_at: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const ProfileExperience = ({ profileId }: { profileId: string }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    description: '',
    start_date: '',
    end_date: '',
    current: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, [profileId]);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('profile_id', profileId)
        .order('start_date', { ascending: false });
        
      if (error) throw error;
      
      setExperiences(data || []);
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load experiences.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      location: '',
      description: '',
      start_date: '',
      end_date: '',
      current: false,
    });
    setIsEditMode(false);
    setCurrentExperience(null);
  };

  const handleOpenExperienceDialog = (experience?: Experience) => {
    if (experience) {
      setIsEditMode(true);
      setCurrentExperience(experience);
      setFormData({
        company: experience.company,
        role: experience.role,
        location: experience.location || '',
        description: experience.description || '',
        start_date: experience.start_date ? new Date(experience.start_date).toISOString().split('T')[0] : '',
        end_date: experience.end_date ? new Date(experience.end_date).toISOString().split('T')[0] : '',
        current: experience.current || false,
      });
    } else {
      resetForm();
    }
    setExperienceDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, current: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.company || !formData.role || !formData.start_date) {
      toast({
        title: 'Missing information',
        description: 'Company, role, and start date are required.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.current && !formData.end_date) {
      toast({
        title: 'Missing information',
        description: 'Please provide an end date or mark as current position.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const experienceData = {
        company: formData.company,
        role: formData.role,
        location: formData.location,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.current ? null : formData.end_date,
        current: formData.current,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditMode && currentExperience) {
        // Update existing experience
        const { error } = await supabase
          .from('experience')
          .update(experienceData)
          .eq('id', currentExperience.id);
          
        if (error) throw error;
        
        toast({
          title: 'Experience updated',
          description: 'Your experience has been updated successfully.',
        });
      } else {
        // Create new experience
        const { error } = await supabase
          .from('experience')
          .insert({
            ...experienceData,
            profile_id: profileId,
          });
          
        if (error) throw error;
        
        toast({
          title: 'Experience added',
          description: 'Your experience has been added successfully.',
        });
      }
      
      fetchExperiences();
      setExperienceDialogOpen(false);
      resetForm();
      
    } catch (error: any) {
      console.error('Error saving experience:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} experience.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (experienceId: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', experienceId);
        
      if (error) throw error;
      
      setExperiences(experiences.filter(exp => exp.id !== experienceId));
      
      toast({
        title: 'Experience deleted',
        description: 'The experience has been removed from your profile.',
      });
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete experience.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Experience</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleOpenExperienceDialog()}
        >
          <PlusIcon size={16} className="mr-1.5" />
          Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : experiences.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No experiences added yet. Add your work history to showcase your professional background.
        </p>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{experience.role}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <BriefcaseIcon size={14} className="mr-1" /> 
                      {experience.company}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleOpenExperienceDialog(experience)}
                    >
                      <PencilIcon size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(experience.id)}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground space-y-2">
                  {experience.location && (
                    <div className="flex items-center">
                      <MapPinIcon size={14} className="mr-1.5" />
                      {experience.location}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-1.5" />
                    {formatDate(experience.start_date)} - {experience.current ? 'Present' : formatDate(experience.end_date)}
                  </div>
                  
                  {experience.description && (
                    <p className="mt-2 whitespace-pre-line">
                      {experience.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input 
                id="company" 
                name="company" 
                value={formData.company} 
                onChange={handleInputChange} 
                placeholder="Company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role / Position *</Label>
              <Input 
                id="role" 
                name="role" 
                value={formData.role} 
                onChange={handleInputChange} 
                placeholder="Your job title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
                placeholder="City, Country or Remote"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input 
                  id="startDate" 
                  name="start_date" 
                  type="date"
                  value={formData.start_date} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  name="end_date" 
                  type="date"
                  value={formData.end_date} 
                  onChange={handleInputChange} 
                  disabled={formData.current}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="current" 
                checked={formData.current}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="current">
                I currently work here
              </Label>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExperienceDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.company || !formData.role || !formData.start_date || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-1.5 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Experience' : 'Add Experience'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileExperience;
