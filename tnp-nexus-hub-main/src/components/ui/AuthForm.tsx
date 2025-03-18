
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlignCenter, Eye, EyeOff, LockKeyhole, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  type: 'login' | 'register' | 'student' | 'admin';
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string; fullName?: string}>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const errors: {email?: string; password?: string; fullName?: string} = {};
    let isValid = true;

    // Basic email validation
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Full name validation for register form
    if (type === 'register' && !fullName) {
      errors.fullName = "Full name is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    // If onSubmit is provided, use it
    if (onSubmit) {
      const data = type === 'register' 
        ? { email, password, fullName } 
        : { email, password };
      
      try {
        await onSubmit(data);
      } catch (error: any) {
        // If we have a specific error message from Supabase, display it
        const errorMessage = error?.message || "An unexpected error occurred";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      return;
    }
    
    // Legacy behavior if no onSubmit provided
    if (type === 'student' || type === 'admin') {
      setTimeout(() => {
        if (type === 'student') {
          navigate('/student-dashboard');
          toast({
            title: "Success",
            description: "You have successfully logged in",
          });
        } else {
          navigate('/admin-dashboard');
          toast({
            title: "Success",
            description: "You have successfully logged in as admin",
          });
        }
      }, 1500);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User size={18} />
              </span>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`pl-10 ${validationErrors.fullName ? 'border-destructive' : ''}`}
                required
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-sm text-destructive">{validationErrors.fullName}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail size={18} />
            </span>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
              autoComplete="email"
              required
            />
          </div>
          {validationErrors.email && (
            <p className="text-sm text-destructive">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <LockKeyhole size={18} />
            </span>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 ${validationErrors.password ? 'border-destructive' : ''}`}
              autoComplete={type === 'register' ? 'new-password' : 'current-password'}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-sm text-destructive">{validationErrors.password}</p>
          )}
        </div>

        {type === 'login' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary border-input rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-primary hover:text-primary/80 font-medium">
                Forgot password?
              </a>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading 
            ? (type === 'register' ? 'Creating account...' : 'Logging in...') 
            : (type === 'register' ? 'Create account' : 'Log in')}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
