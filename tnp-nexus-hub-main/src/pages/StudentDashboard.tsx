
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BellIcon, 
  BriefcaseIcon, 
  FileText, 
  HomeIcon, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Settings, 
  UserIcon, 
  X
} from 'lucide-react';
import StudentProfile from '@/components/dashboard/StudentProfile';
import JobListings from '@/components/dashboard/JobListings';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here we would normally handle the logout logic
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-border h-screen sticky top-0">
        <div className="p-4 border-b border-border flex items-center">
          <Link to="/student-dashboard" className="text-primary font-semibold text-xl flex items-center space-x-2">
            <span className="bg-primary text-white rounded-md p-1">T&P</span>
            <span>PICT</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem 
            icon={<UserIcon size={18} />} 
            label="My Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <NavItem 
            icon={<BriefcaseIcon size={18} />} 
            label="Job Listings" 
            active={activeTab === 'jobs'} 
            onClick={() => setActiveTab('jobs')} 
          />
          <NavItem 
            icon={<BellIcon size={18} />} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
          />
          <NavItem 
            icon={<FileText size={18} />} 
            label="Resume" 
            active={activeTab === 'resume'} 
            onClick={() => setActiveTab('resume')} 
          />
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Messages" 
            active={activeTab === 'messages'} 
            onClick={() => setActiveTab('messages')} 
          />
        </nav>
        
        <div className="p-4 border-t border-border">
          <NavItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-2" 
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <Link to="/student-dashboard" className="text-primary font-semibold text-xl flex items-center space-x-2">
              <span className="bg-primary text-white rounded-md p-1">T&P</span>
              <span>PICT</span>
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-foreground p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="mt-4 space-y-2 animate-fade-in">
              <MobileNavItem 
                icon={<UserIcon size={18} />} 
                label="My Profile" 
                active={activeTab === 'profile'} 
                onClick={() => {
                  setActiveTab('profile');
                  setMobileMenuOpen(false);
                }} 
              />
              <MobileNavItem 
                icon={<BriefcaseIcon size={18} />} 
                label="Job Listings" 
                active={activeTab === 'jobs'} 
                onClick={() => {
                  setActiveTab('jobs');
                  setMobileMenuOpen(false);
                }} 
              />
              <MobileNavItem 
                icon={<BellIcon size={18} />} 
                label="Notifications" 
                active={activeTab === 'notifications'} 
                onClick={() => {
                  setActiveTab('notifications');
                  setMobileMenuOpen(false);
                }} 
              />
              <MobileNavItem 
                icon={<FileText size={18} />} 
                label="Resume" 
                active={activeTab === 'resume'} 
                onClick={() => {
                  setActiveTab('resume');
                  setMobileMenuOpen(false);
                }} 
              />
              <MobileNavItem 
                icon={<MessageSquare size={18} />} 
                label="Messages" 
                active={activeTab === 'messages'} 
                onClick={() => {
                  setActiveTab('messages');
                  setMobileMenuOpen(false);
                }} 
              />
              <Separator className="my-2" />
              <MobileNavItem 
                icon={<Settings size={18} />} 
                label="Settings" 
                active={activeTab === 'settings'} 
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }} 
              />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:bg-destructive/10" 
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </nav>
          )}
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-4 md:p-6 container mx-auto">
          <div className="py-4">
            {activeTab === 'profile' && <StudentProfile />}
            {activeTab === 'jobs' && <JobListings />}
            {activeTab === 'notifications' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-medium mb-6">Notifications</h1>
                <div className="glass-card p-10 text-center">
                  <BellIcon size={32} className="mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-lg font-medium">No new notifications</h2>
                  <p className="text-muted-foreground mt-2">
                    You'll see updates about job applications and messages here.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'resume' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-medium mb-6">Resume</h1>
                <div className="glass-card p-10 text-center">
                  <FileText size={32} className="mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-lg font-medium">Resume Builder Coming Soon</h2>
                  <p className="text-muted-foreground mt-2">
                    Our resume builder will help you create a professional resume.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'messages' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-medium mb-6">Messages</h1>
                <div className="glass-card p-10 text-center">
                  <MessageSquare size={32} className="mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-lg font-medium">No messages yet</h2>
                  <p className="text-muted-foreground mt-2">
                    Messages from recruiters and T&P cell will appear here.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-medium mb-6">Settings</h1>
                <div className="glass-card p-10 text-center">
                  <Settings size={32} className="mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-lg font-medium">Account Settings Coming Soon</h2>
                  <p className="text-muted-foreground mt-2">
                    You'll be able to manage your account preferences here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
}) => {
  return (
    <button
      className={`w-full flex items-center p-2 rounded-md transition-colors ${
        active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

const MobileNavItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
}) => {
  return (
    <button
      className={`w-full flex items-center p-3 rounded-md transition-colors ${
        active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

export default StudentDashboard;
