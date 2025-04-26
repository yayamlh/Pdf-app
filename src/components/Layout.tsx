import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-purple flex items-center gap-2 transition-transform hover:scale-105">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 18v-6"></path>
              <path d="M12 18v-3"></path>
              <path d="M15 18v-6"></path>
            </svg>
            PDF Scribe
            <span className="ml-1 text-sm font-normal text-muted-foreground">Search</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:block">{user.email}</span>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-purple hover:bg-purple-dark transition-colors"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="bg-white py-6 border-t">
        <div className="container text-sm text-center text-muted-foreground">
          <p className="mb-2">PDF Scribe Search - Find text in your PDFs quickly and efficiently</p>
          <p className="text-xs">© {new Date().getFullYear()} PDF Scribe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;