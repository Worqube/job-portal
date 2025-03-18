
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  BriefcaseIcon,
  CheckCircle2,
  FileIcon,
  GithubIcon,
  GraduationCap,
  LinkedinIcon,
  Paperclip,
  SaveIcon,
  UserIcon,
  Loader2,
  CogIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ProfileSkills from './ProfileSkills';
import ProfileProjects from './ProfileProjects';
import ProfileExperience from './ProfileExperience';
import ProfileCertifications from './ProfileCertifications';
import UserSettings from './UserSettings';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [studentData, setStudentData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch student profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Redirect to login if not authenticated
          navigate('/login');
          return;
        }

        // Fetch profile data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (profile) {
          // Transform profile data to component state
          setStudentData({
            id: profile.id,
            rollNumber: profile.roll_number || '',
            name: profile.full_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            year: profile.year || '',
            department: profile.department || '',
            cgpa: profile.cgpa ? profile.cgpa.toString() : '',
            links: {
              github: '',
              linkedin: '',
              leetcode: '',
              codechef: '',
            }
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error fetching profile",
          description: "Could not load your profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [navigate, toast]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Get the user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: studentData.name,
          roll_number: studentData.rollNumber,
          email: studentData.email,
          phone: studentData.phone,
          year: studentData.year,
          department: studentData.department,
          cgpa: studentData.cgpa ? parseFloat(studentData.cgpa) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no data is found, show a placeholder
  if (!studentData) {
    return (
      <div className="text-center p-10 glass-card">
        <h3 className="text-lg font-medium">Profile Not Found</h3>
        <p className="text-muted-foreground">
          Please complete your profile information.
        </p>
        <Button 
          className="mt-4"
          onClick={() => {
            setStudentData({
              rollNumber: '',
              name: '',
              email: '',
              phone: '',
              year: '',
              department: '',
              cgpa: '',
              links: {
                github: '',
                linkedin: '',
                leetcode: '',
                codechef: '',
              }
            });
            setIsEditing(true);
          }}
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal and professional information
          </p>
        </div>
        {activeTab === 'basic' && (
          <Button
            variant={isEditing ? "outline" : "default"}
            className="btn-effect"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSaving}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        )}
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center text-2xl text-primary font-medium">
            {studentData.name
              ? studentData.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
              : '?'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-medium">{studentData.name || 'Add Your Name'}</h2>
            <p className="text-primary font-medium">{studentData.rollNumber || 'Add Your Roll Number'}</p>
            <p className="text-muted-foreground">
              {studentData.department || 'Department'} • {studentData.year || 'Year'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                <GraduationCap size={12} className="mr-1" /> CGPA: {studentData.cgpa || 'N/A'}
              </div>
              {studentData.links?.github && (
                <a
                  href={studentData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-900 text-white text-xs px-2 py-1 rounded-full flex items-center transition-transform hover:scale-105"
                >
                  <GithubIcon size={12} className="mr-1" /> GitHub
                </a>
              )}
              {studentData.links?.linkedin && (
                <a
                  href={studentData.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0077B5] text-white text-xs px-2 py-1 rounded-full flex items-center transition-transform hover:scale-105"
                >
                  <LinkedinIcon size={12} className="mr-1" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="basic"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="basic" className="flex items-center gap-1.5">
            <UserIcon size={16} /> Basic Info
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1.5">
            <GraduationCap size={16} /> Education
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1.5">
            <CheckCircle2 size={16} /> Skills & Certs
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1.5">
            <FileIcon size={16} /> Projects
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-1.5">
            <BriefcaseIcon size={16} /> Experience
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1.5">
            <CogIcon size={16} /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="glass-card p-6 animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={studentData.name}
                disabled={!isEditing || isSaving}
                onChange={(e) => 
                  setStudentData({...studentData, name: e.target.value})
                }
              />
            </div>
            <div>
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input 
                id="rollNumber" 
                value={studentData.rollNumber}
                disabled={!isEditing || isSaving}
                onChange={(e) => 
                  setStudentData({...studentData, rollNumber: e.target.value})
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={studentData.email}
                disabled={!isEditing || isSaving}
                onChange={(e) => 
                  setStudentData({...studentData, email: e.target.value})
                }
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={studentData.phone}
                disabled={!isEditing || isSaving}
                onChange={(e) => 
                  setStudentData({...studentData, phone: e.target.value})
                }
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={studentData.department}
                disabled={!isEditing || isSaving}
                onChange={(e) => 
                  setStudentData({...studentData, department: e.target.value})
                }
              />
            </div>
            <div>
              <Label htmlFor="year">Current Year</Label>
              <Input 
                id="year" 
                value={studentData.year}
                disabled={!isEditing || isSaving}
                onChange={(e) => 
                  setStudentData({...studentData, year: e.target.value})
                }
              />
            </div>
            <div>
              <Label htmlFor="cgpa">CGPA</Label>
              <Input 
                id="cgpa" 
                value={studentData.cgpa}
                disabled={!isEditing || isSaving}
                onChange={(e) => 
                  setStudentData({...studentData, cgpa: e.target.value})
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Online Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="github" className="flex items-center gap-1.5">
                  <GithubIcon size={16} /> GitHub
                </Label>
                <Input 
                  id="github" 
                  value={studentData.links?.github || ''}
                  disabled={!isEditing || isSaving}
                  onChange={(e) => 
                    setStudentData({
                      ...studentData, 
                      links: {...studentData.links, github: e.target.value}
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="flex items-center gap-1.5">
                  <LinkedinIcon size={16} /> LinkedIn
                </Label>
                <Input 
                  id="linkedin" 
                  value={studentData.links?.linkedin || ''}
                  disabled={!isEditing || isSaving}
                  onChange={(e) => 
                    setStudentData({
                      ...studentData, 
                      links: {...studentData.links, linkedin: e.target.value}
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="leetcode">LeetCode</Label>
                <Input 
                  id="leetcode" 
                  value={studentData.links?.leetcode || ''}
                  disabled={!isEditing || isSaving}
                  onChange={(e) => 
                    setStudentData({
                      ...studentData, 
                      links: {...studentData.links, leetcode: e.target.value}
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="codechef">CodeChef</Label>
                <Input 
                  id="codechef" 
                  value={studentData.links?.codechef || ''}
                  disabled={!isEditing || isSaving}
                  onChange={(e) => 
                    setStudentData({
                      ...studentData, 
                      links: {...studentData.links, codechef: e.target.value}
                    })
                  }
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button 
                className="btn-effect" 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="mr-1.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon size={16} className="mr-1.5" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="education" className="glass-card p-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Educational Information</h3>
          <p className="text-muted-foreground mb-4">More education details coming soon...</p>
        </TabsContent>

        <TabsContent value="skills" className="glass-card p-6 animate-fade-in space-y-8">
          <ProfileSkills profileId={studentData.id} />
          <Separator />
          <ProfileCertifications profileId={studentData.id} />
        </TabsContent>

        <TabsContent value="projects" className="glass-card p-6 animate-fade-in">
          <ProfileProjects profileId={studentData.id} />
        </TabsContent>

        <TabsContent value="experience" className="glass-card p-6 animate-fade-in">
          <ProfileExperience profileId={studentData.id} />
        </TabsContent>

        <TabsContent value="settings" className="animate-fade-in">
          <UserSettings profileId={studentData.id} />
        </TabsContent>
      </Tabs>

      <div className="glass-card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Resume</h3>
          <Button variant="outline" className="text-sm" disabled={!isEditing || isSaving}>
            <Paperclip size={14} className="mr-1" /> Upload Resume
          </Button>
        </div>
        <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/50">
          <FileIcon size={32} className="text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            No resume uploaded yet. Upload your resume to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
