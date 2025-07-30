import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-blog.jpg";

export function AuthScreen() {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (isSignUp?: boolean) => {
    if (email && password) {
      setLoading(true);
      try {
        if (isSignUp) {
          await signup(email, password);
        } else {
          await login(email, password);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Multi-tenant blog platform" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-primary-foreground">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Build Beautiful
              <br />
              <span className="text-primary-glow">Multi-Tenant Blogs</span>
            </h1>
            <p className="text-xl opacity-90 max-w-md">
              Create and manage multiple organizations with dedicated blog spaces. 
              Perfect for teams, agencies, and growing businesses.
            </p>
            <div className="flex space-x-6 pt-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-primary-glow" />
                <span>Multiple Organizations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-primary-glow" />
                <span>Team Collaboration</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-primary-glow" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-subtle">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome to BlogSpace</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your account or create a new one
            </p>
          </div>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader className="text-center pb-4">
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Join thousands of teams building amazing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    onClick={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}