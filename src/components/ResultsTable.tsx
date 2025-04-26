import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { SearchResult } from "@/types";

interface ResultsTableProps {
  results: SearchResult[];
  isSearching: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, isSearching }) => {
  if (results.length === 0 && !isSearching) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Search Results</h2>
        {results.length > 0 && (
          <span className="text-sm text-muted-foreground">
            Found {results.length} match{results.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[200px] font-medium">File Name</TableHead>
              <TableHead className="w-[100px] text-center font-medium">Page</TableHead>
              <TableHead className="font-medium">Context</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSearching ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <svg className="animate-spin h-8 w-8 text-purple mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching through PDFs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                    <span>No results found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              results.map((result, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium truncate max-w-[200px]">
                    {result.file}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 rounded-full bg-purple/10 text-purple text-xs font-medium">
                      {result.page}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div 
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      className="text-sm leading-relaxed"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResultsTable;