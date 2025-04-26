export interface UploadedFile {
  id: string;
  name: string;
  url: string; // This would be the Supabase URL in a real implementation
  size: number;
  type: string;
  uploadedAt: Date;
  pages: number; // Added field for number of pages
}

export interface SearchResult {
  file: string;
  page: number;
  excerpt: string;
}
