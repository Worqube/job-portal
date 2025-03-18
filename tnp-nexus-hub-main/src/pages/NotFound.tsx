
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Footer from '@/components/layout/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Logo Header */}
      <header className="py-4 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="w-full flex justify-center">
            <Link 
              to="/" 
              className="text-primary font-semibold text-xl flex items-center space-x-2"
            >
              <span className="bg-primary text-white rounded-md p-1">T&P</span>
              <span>PICT</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="glass-card p-8 shadow-subtle">
            <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
            <h2 className="text-2xl font-medium mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline" className="btn-effect">
                <Link to="/" className="flex items-center">
                  <ArrowLeft size={16} className="mr-2" /> 
                  Go Back
                </Link>
              </Button>
              <Button asChild className="btn-effect">
                <Link to="/" className="flex items-center">
                  <Home size={16} className="mr-2" /> 
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
