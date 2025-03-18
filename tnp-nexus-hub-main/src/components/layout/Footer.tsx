
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="text-primary font-semibold text-xl flex items-center space-x-2 mb-4">
              <span className="bg-primary text-white rounded-md p-1">T&P</span>
              <span>PICT</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 max-w-xs">
              Training & Placement Cell at Pune Institute of Computer Technology, connecting talented students with industry-leading organizations.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/about" label="About" />
              <FooterLink to="/jobs" label="Jobs" />
              <FooterLink to="/login" label="Student Login" />
              <FooterLink to="/contact" label="Contact" />
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Survey No. 27, Near Trimurti Chowk, Bharati Vidyapeeth Campus, Dhankawadi, Pune, Maharashtra 411043
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm text-muted-foreground">+91 20 2437 1101</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm text-muted-foreground">placement@pict.edu</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pict.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Official Website
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://pictsctr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  PICT Student Council
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  Placement Statistics
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PICT Training & Placement Cell. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {label}
    </Link>
  </li>
);

export default Footer;
