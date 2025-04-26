import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UploadedFile, SearchResult } from "@/types";
import * as pdfjs from 'pdfjs-dist';

interface SearchSectionProps {
  uploadedFiles: UploadedFile[];
  onSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ 
  uploadedFiles, 
  onSearchResults,
  isSearching,
  setIsSearching
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      toast.error("Please enter a search term");
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one PDF file");
      return;
    }

    setIsSearching(true);
    onSearchResults([]);

    try {
      const results = await searchPDFs(uploadedFiles, searchQuery);
      onSearchResults(results);
      
      if (results.length === 0) {
        toast.info(`No results found for "${searchQuery}"`);
      } else {
        toast.success(`Found ${results.length} results for "${searchQuery}"`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred during search");
    } finally {
      setIsSearching(false);
    }
  };

  const searchPDFs = async (files: UploadedFile[], query: string): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];
    const normalizedQuery = query.toLowerCase();
    
    for (const file of files) {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items
            .map(item => 'str' in item ? item.str : '')
            .join(' ')
            .toLowerCase();
          
          if (pageText.includes(normalizedQuery)) {
            const index = pageText.indexOf(normalizedQuery);
            const contextStart = Math.max(0, index - 50);
            const contextEnd = Math.min(pageText.length, index + normalizedQuery.length + 50);
            
            const beforeText = pageText.substring(contextStart, index);
            const matched = pageText.substring(index, index + normalizedQuery.length);
            const afterText = pageText.substring(index + normalizedQuery.length, contextEnd);
            
            results.push({
              file: file.name,
              page: pageNum,
              excerpt: `...${beforeText}<mark class="bg-yellow-200">${matched}</mark>${afterText}...`
            });
          }
        }
      } catch (error) {
        console.error(`Error searching PDF ${file.name}:`, error);
      }
    }
    
    return results;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Search in PDFs</h2>
        {uploadedFiles.length > 0 && (
          <span className="text-sm text-muted-foreground">
            Searching across {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Enter search term or phrase..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 h-11"
          disabled={isSearching || uploadedFiles.length === 0}
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || uploadedFiles.length === 0}
          className="bg-purple hover:bg-purple-dark transition-colors min-w-[100px] h-11"
        >
          {isSearching ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </>
          )}
        </Button>
      </div>
      
      {uploadedFiles.length === 0 && (
        <p className="text-sm text-muted-foreground mt-3">
          Upload PDF files above to enable search
        </p>
      )}
    </div>
  );
};

export default SearchSection;