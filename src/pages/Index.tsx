import { useAuth } from "@/contexts/AuthContext";
import { AuthScreen } from "@/components/AuthScreen";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default Index;
