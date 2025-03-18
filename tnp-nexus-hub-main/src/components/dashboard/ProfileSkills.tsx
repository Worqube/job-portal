
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, Loader2, XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProfileSkills = ({ profileId }: { profileId: string }) => {
  const [skills, setSkills] = useState<any[]>([]);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('Intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
    fetchAllSkills();
  }, [profileId]);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_skills')
        .select(`
          id,
          proficiency_level,
          skills (
            id,
            name
          )
        `)
        .eq('profile_id', profileId);
        
      if (error) throw error;
      
      setSkills(data || []);
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load skills.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setAllSkills(data || []);
    } catch (error: any) {
      console.error('Error fetching all skills:', error);
    }
  };

  const addSkill = async () => {
    if (!selectedSkill) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if skill already exists for this user
      const { data: existingSkill } = await supabase
        .from('user_skills')
        .select('id')
        .eq('profile_id', profileId)
        .eq('skill_id', selectedSkill)
        .maybeSingle();
        
      if (existingSkill) {
        toast({
          title: 'Skill already added',
          description: 'You already have this skill in your profile.',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('user_skills')
        .insert({
          profile_id: profileId,
          skill_id: selectedSkill,
          proficiency_level: proficiencyLevel
        });
        
      if (error) throw error;
      
      toast({
        title: 'Skill added',
        description: 'Your skill has been added successfully.',
      });
      
      fetchSkills();
      setAddSkillOpen(false);
      setSelectedSkill(null);
      setProficiencyLevel('Intermediate');
      
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to add skill.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId);
        
      if (error) throw error;
      
      setSkills(skills.filter(skill => skill.id !== skillId));
      
      toast({
        title: 'Skill removed',
        description: 'The skill has been removed from your profile.',
      });
    } catch (error: any) {
      console.error('Error removing skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove skill.',
        variant: 'destructive',
      });
    }
  };

  // Filter out skills that the user already has
  const availableSkills = allSkills.filter(skill => 
    !skills.some(userSkill => userSkill.skills.id === skill.id)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAddSkillOpen(true)}
          disabled={isLoading}
        >
          <PlusIcon size={16} className="mr-1.5" />
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : skills.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No skills added yet. Add skills to showcase your expertise.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge 
              key={skill.id} 
              className="flex items-center px-3 py-1.5 gap-1.5"
              variant="secondary"
            >
              {skill.skills.name}
              <span className="text-xs text-muted-foreground">({skill.proficiency_level})</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeSkill(skill.id)}
              >
                <XIcon size={12} />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <Dialog open={addSkillOpen} onOpenChange={setAddSkillOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a new skill</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill</label>
              <Select value={selectedSkill || ''} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Proficiency Level</label>
              <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSkillOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addSkill} 
              disabled={!selectedSkill || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-1.5 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Skill'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSkills;
