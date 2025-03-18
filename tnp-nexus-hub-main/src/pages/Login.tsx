
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/ui/AuthForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/App';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'student' | 'admin'>('student');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  
  // If user is already logged in, redirect to dashboard based on user type
  React.useEffect(() => {
    if (session) {
      // Check if user has admin metadata or role
      const isAdmin = session.user.user_metadata?.is_admin === true;
      if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  }, [session, navigate]);

  const handleSignUp = async (data: { email: string; password: string; fullName: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign up with email and password
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            is_admin: userType === 'admin', // Set admin flag based on selection
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        setError(error.message);
        throw error;
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message || "An unexpected error occurred.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign in with email and password
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        throw error;
      }

      // Check if the user is an admin
      const isAdmin = authData.user?.user_metadata?.is_admin === true;

      toast({
        title: "Logged in successfully!",
      });
      
      // Redirect based on user type
      if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your TNP account</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="mb-4">
                <Tabs defaultValue="student" onValueChange={(v) => setUserType(v as 'student' | 'admin')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="admin">Admin/College</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <AuthForm 
                type="login"
                onSubmit={handleSignIn}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="register">
              <div className="mb-4">
                <Tabs defaultValue="student" onValueChange={(v) => setUserType(v as 'student' | 'admin')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="admin">Admin/College</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <AuthForm 
                type="register" 
                onSubmit={handleSignUp}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
