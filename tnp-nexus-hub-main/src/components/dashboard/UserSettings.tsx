
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, SaveIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserSettingsProps {
  profileId: string;
  isAdmin?: boolean;
}

interface UserSettings {
  email_notifications: boolean;
  theme: string;
  language: string;
}

const UserSettings = ({ profileId, isAdmin = false }: UserSettingsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    theme: 'light',
    language: 'en',
  });
  const [passwordChange, setPasswordChange] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, [profileId]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications, theme, language')
        .eq('id', profileId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        // Use the data or default values if null
        setSettings({
          email_notifications: data.email_notifications ?? true,
          theme: data.theme || 'light',
          language: data.language || 'en',
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (name: string, value: any) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordChange(prev => ({ ...prev, [name]: value }));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: settings.email_notifications,
          theme: settings.theme,
          language: settings.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId);
      
      if (error) throw error;
      
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    // Validate password
    if (!passwordChange.current) {
      toast({
        title: 'Current password required',
        description: 'Please enter your current password.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!passwordChange.new) {
      toast({
        title: 'New password required',
        description: 'Please enter a new password.',
        variant: 'destructive',
      });
      return;
    }
    
    if (passwordChange.new !== passwordChange.confirm) {
      toast({
        title: 'Passwords do not match',
        description: 'Your new password and confirmation do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        password: passwordChange.new
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      
      // Reset form
      setPasswordChange({
        current: '',
        new: '',
        confirm: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications from the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about new job postings, applications, and other important updates.
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleSettingsChange('email_notifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Customize how the application looks for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => handleSettingsChange('theme', value)}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingsChange('language', value)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="mr">Marathi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={saveSettings} 
            disabled={isSaving}
            className="ml-auto"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon size={16} className="mr-1.5" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input 
              id="currentPassword" 
              name="current"
              type="password" 
              value={passwordChange.current}
              onChange={handlePasswordInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              name="new"
              type="password" 
              value={passwordChange.new}
              onChange={handlePasswordInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirm"
              type="password" 
              value={passwordChange.confirm}
              onChange={handlePasswordInputChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={changePassword} 
            disabled={isSaving}
            variant="outline"
            className="ml-auto"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="mr-1.5 animate-spin" />
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>Additional settings for administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Admin-specific settings and controls will be added here in future updates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSettings;
