
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Loader2, AwardIcon, CalendarIcon, ExternalLinkIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  credential_url: string;
  created_at: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const ProfileCertifications = ({ profileId }: { profileId: string }) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCertification, setCurrentCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCertifications();
  }, [profileId]);

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('profile_id', profileId)
        .order('issue_date', { ascending: false });
        
      if (error) throw error;
      
      setCertifications(data || []);
    } catch (error: any) {
      console.error('Error fetching certifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load certifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      credential_url: '',
    });
    setIsEditMode(false);
    setCurrentCertification(null);
  };

  const handleOpenCertificationDialog = (certification?: Certification) => {
    if (certification) {
      setIsEditMode(true);
      setCurrentCertification(certification);
      setFormData({
        name: certification.name,
        issuer: certification.issuer || '',
        issue_date: certification.issue_date ? new Date(certification.issue_date).toISOString().split('T')[0] : '',
        expiry_date: certification.expiry_date ? new Date(certification.expiry_date).toISOString().split('T')[0] : '',
        credential_url: certification.credential_url || '',
      });
    } else {
      resetForm();
    }
    setCertificationDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.issuer || !formData.issue_date) {
      toast({
        title: 'Missing information',
        description: 'Certification name, issuer, and issue date are required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditMode && currentCertification) {
        // Update existing certification
        const { error } = await supabase
          .from('certifications')
          .update({
            name: formData.name,
            issuer: formData.issuer,
            issue_date: formData.issue_date,
            expiry_date: formData.expiry_date || null,
            credential_url: formData.credential_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentCertification.id);
          
        if (error) throw error;
        
        toast({
          title: 'Certification updated',
          description: 'Your certification has been updated successfully.',
        });
      } else {
        // Create new certification
        const { error } = await supabase
          .from('certifications')
          .insert({
            profile_id: profileId,
            name: formData.name,
            issuer: formData.issuer,
            issue_date: formData.issue_date,
            expiry_date: formData.expiry_date || null,
            credential_url: formData.credential_url,
          });
          
        if (error) throw error;
        
        toast({
          title: 'Certification added',
          description: 'Your certification has been added successfully.',
        });
      }
      
      fetchCertifications();
      setCertificationDialogOpen(false);
      resetForm();
      
    } catch (error: any) {
      console.error('Error saving certification:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} certification.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (certificationId: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', certificationId);
        
      if (error) throw error;
      
      setCertifications(certifications.filter(cert => cert.id !== certificationId));
      
      toast({
        title: 'Certification deleted',
        description: 'The certification has been removed from your profile.',
      });
    } catch (error: any) {
      console.error('Error deleting certification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete certification.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Certifications</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleOpenCertificationDialog()}
        >
          <PlusIcon size={16} className="mr-1.5" />
          Add Certification
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : certifications.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No certifications added yet. Showcase your credentials by adding certifications.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {certifications.map((certification) => (
            <Card key={certification.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{certification.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <AwardIcon size={14} className="mr-1" /> 
                      {certification.issuer}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleOpenCertificationDialog(certification)}
                    >
                      <PencilIcon size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(certification.id)}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-1.5" />
                    Issued: {formatDate(certification.issue_date)}
                    {certification.expiry_date && (
                      <span className="ml-2">· Expires: {formatDate(certification.expiry_date)}</span>
                    )}
                  </div>
                </div>
              </CardContent>
              {certification.credential_url && (
                <CardFooter className="pt-2 border-t">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={certification.credential_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <ExternalLinkIcon size={14} /> View Credential
                    </a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Certification' : 'Add New Certification'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Certification Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuing Organization *</Label>
              <Input 
                id="issuer" 
                name="issuer" 
                value={formData.issuer} 
                onChange={handleInputChange} 
                placeholder="e.g. Amazon Web Services"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input 
                  id="issueDate" 
                  name="issue_date" 
                  type="date"
                  value={formData.issue_date} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                <Input 
                  id="expiryDate" 
                  name="expiry_date" 
                  type="date"
                  value={formData.expiry_date} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential URL</Label>
              <Input 
                id="credentialUrl" 
                name="credential_url" 
                value={formData.credential_url} 
                onChange={handleInputChange} 
                placeholder="https://www.credential.net/..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.name || !formData.issuer || !formData.issue_date || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-1.5 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Certification' : 'Add Certification'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileCertifications;
