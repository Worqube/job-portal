
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Loader2, ExternalLinkIcon, GithubIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  project_url: string;
  github_url: string;
  created_at: string;
}

const ProfileProjects = ({ profileId }: { profileId: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    project_url: '',
    github_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [profileId]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      project_url: '',
      github_url: '',
    });
    setIsEditMode(false);
    setCurrentProject(null);
  };

  const handleOpenProjectDialog = (project?: Project) => {
    if (project) {
      setIsEditMode(true);
      setCurrentProject(project);
      setFormData({
        title: project.title,
        description: project.description || '',
        technologies: project.technologies?.join(', ') || '',
        project_url: project.project_url || '',
        github_url: project.github_url || '',
      });
    } else {
      resetForm();
    }
    setProjectDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: 'Missing information',
        description: 'Project title is required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const technologies = formData.technologies
        ? formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
        : [];
      
      if (isEditMode && currentProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            technologies,
            project_url: formData.project_url,
            github_url: formData.github_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentProject.id);
          
        if (error) throw error;
        
        toast({
          title: 'Project updated',
          description: 'Your project has been updated successfully.',
        });
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert({
            profile_id: profileId,
            title: formData.title,
            description: formData.description,
            technologies,
            project_url: formData.project_url,
            github_url: formData.github_url,
          });
          
        if (error) throw error;
        
        toast({
          title: 'Project added',
          description: 'Your project has been added successfully.',
        });
      }
      
      fetchProjects();
      setProjectDialogOpen(false);
      resetForm();
      
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} project.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== projectId));
      
      toast({
        title: 'Project deleted',
        description: 'The project has been removed from your profile.',
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Projects</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleOpenProjectDialog()}
        >
          <PlusIcon size={16} className="mr-1.5" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No projects added yet. Showcase your work by adding projects.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.description || 'No description provided.'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <div className="flex gap-2">
                  {project.project_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                        <ExternalLinkIcon size={14} /> Demo
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                        <GithubIcon size={14} /> Code
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => handleOpenProjectDialog(project)}
                  >
                    <PencilIcon size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(project.id)}
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="My Awesome Project"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="A brief description of your project..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies Used</Label>
              <Input 
                id="technologies" 
                name="technologies" 
                value={formData.technologies} 
                onChange={handleInputChange} 
                placeholder="React, Node.js, MongoDB (comma separated)"
              />
              <p className="text-xs text-muted-foreground">
                Separate technologies with commas
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input 
                id="projectUrl" 
                name="project_url" 
                value={formData.project_url} 
                onChange={handleInputChange} 
                placeholder="https://myproject.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input 
                id="githubUrl" 
                name="github_url" 
                value={formData.github_url} 
                onChange={handleInputChange} 
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.title || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-1.5 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Project' : 'Add Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileProjects;
