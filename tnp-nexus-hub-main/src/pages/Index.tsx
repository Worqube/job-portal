
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BriefcaseIcon, Building2, CheckCircle2, ChevronRight, GraduationCap, LineChart, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 page-container">
        <div className="max-w-3xl mx-auto text-center space-y-6 page-transition">
          <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-2">
            <span className="bg-primary rounded-full w-2 h-2 mr-2"></span>
            PICT Training & Placement Cell
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
            Your Gateway to <span className="text-primary">Career Excellence</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-balance">
            Connecting talented students with industry-leading opportunities to build the future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="btn-effect">
              <Link to="/login">
                Student Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn-effect">
              <Link to="/jobs">
                Browse Opportunities
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <StatCard
            number="500+"
            label="Companies"
            icon={<Building2 className="h-5 w-5 text-primary" />}
          />
          <StatCard
            number="95%"
            label="Placement Rate"
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
          />
          <StatCard
            number="₹36 LPA"
            label="Highest Package"
            icon={<LineChart className="h-5 w-5 text-primary" />}
          />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-muted/50 to-background">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers powerful tools to help students showcase their skills and connect with top employers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Users size={24} className="text-primary" />}
              title="Smart Profile Management"
              description="Build and manage your comprehensive profile showcasing your skills, projects, and achievements."
            />
            <FeatureCard
              icon={<BriefcaseIcon size={24} className="text-primary" />}
              title="Job Listings"
              description="Browse through a curated list of opportunities from leading technology companies."
            />
            <FeatureCard
              icon={<GraduationCap size={24} className="text-primary" />}
              title="Education Tracking"
              description="Keep your academic credentials, certifications, and coursework organized in one place."
            />
          </div>
        </div>
      </section>
      
      {/* Companies Section */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Our Recruiters</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We partner with leading companies across the globe to provide the best opportunities for our students.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            <CompanyLogo name="Microsoft" />
            <CompanyLogo name="Google" />
            <CompanyLogo name="Amazon" />
            <CompanyLogo name="Adobe" />
            <CompanyLogo name="Oracle" />
            <CompanyLogo name="IBM" />
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="btn-effect">
              View All Recruiters <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="page-container">
          <div className="glass-card p-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Ready to Start Your Career Journey?</h2>
            <p className="text-muted-foreground mb-8">
              Log in to your student account to access job listings, update your profile, and stay connected with the latest opportunities.
            </p>
            <Button asChild size="lg" className="btn-effect">
              <Link to="/login">
                Login Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const StatCard = ({ number, label, icon }: { number: string; label: string; icon: React.ReactNode }) => {
  return (
    <div className="glass-card p-6 flex items-center hover-scale">
      <div className="mr-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{number}</div>
        <div className="text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <Card className="hover-scale overflow-hidden h-full">
      <CardHeader>
        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const CompanyLogo = ({ name }: { name: string }) => {
  return (
    <div className="h-10 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200">
      {/* In a real implementation, we'd use actual logos */}
      <div className="font-semibold text-muted-foreground/70 hover:text-primary transition-colors">
        {name}
      </div>
    </div>
  );
};

export default Index;
