
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/App';

const Navbar = () => {
  const { session, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">TNP Nexus</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/jobs" className="text-foreground/80 hover:text-primary transition-colors">
            Jobs
          </Link>
          <Link to="/companies" className="text-foreground/80 hover:text-primary transition-colors">
            Companies
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/student-dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
