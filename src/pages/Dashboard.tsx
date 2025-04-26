import React from "react";
import Layout from "@/components/Layout";
import UploadSection from "@/components/UploadSection";
import SearchSection from "@/components/SearchSection";
import ResultsTable from "@/components/ResultsTable";
import { UploadedFile, SearchResult } from "@/types";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to PDF Scribe</h1>
          <p className="text-muted-foreground">
            Upload your PDF files and search through them instantly
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="overflow-hidden border-t-4 border-t-purple bg-white/50 backdrop-blur-sm">
            <div className="p-6">
              <UploadSection
                uploadedFiles={uploadedFiles}
                onFilesUploaded={setUploadedFiles}
              />
            </div>
          </Card>

          <Card className="overflow-hidden bg-white/50 backdrop-blur-sm">
            <div className="p-6">
              <SearchSection
                uploadedFiles={uploadedFiles}
                onSearchResults={setSearchResults}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
              />

              <ResultsTable 
                results={searchResults} 
                isSearching={isSearching} 
              />
            </div>
          </Card>

          {!uploadedFiles.length && !searchResults.length && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple/10 mb-4">
                <svg 
                  className="w-8 h-8 text-purple" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M9 18v-6"></path>
                  <path d="M12 18v-3"></path>
                  <path d="M15 18v-6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                Get Started with PDF Search
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload your PDF files above and use the search bar to find specific text across all your documents instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;