
import React, { useState } from "react";
import Layout from "@/components/Layout";
import UploadSection from "@/components/UploadSection";
import SearchSection from "@/components/SearchSection";
import ResultsTable from "@/components/ResultsTable";
import { UploadedFile, SearchResult } from "@/types";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 shadow-sm mb-8">
          <UploadSection
            uploadedFiles={uploadedFiles}
            onFilesUploaded={setUploadedFiles}
          />
        </Card>

        <Card className="p-6 shadow-sm">
          <SearchSection
            uploadedFiles={uploadedFiles}
            onSearchResults={setSearchResults}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
          />

          <ResultsTable results={searchResults} isSearching={isSearching} />
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
