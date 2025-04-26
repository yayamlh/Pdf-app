import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import AuthForm from "@/components/AuthForm";
import Layout from "@/components/Layout";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-8 shadow-lg border-t-4 border-t-purple">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? "Welcome Back!" : "Create Your Account"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? "Sign in to access your PDF search tools" 
                : "Join us to start searching through your PDFs"}
            </p>
          </div>
          
          <AuthForm 
            isLogin={isLogin} 
            onSuccess={() => navigate("/dashboard")} 
          />
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-purple hover:text-purple-dark transition-colors"
            >
              {isLogin 
                ? "Need an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;