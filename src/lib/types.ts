export type Category = "Games" | "Productivity" | "Development" | "Browsers" | "Media" | "Graphics" | "Security" | "System Tools" | "Other";

export interface AppFile {
  id: string;
  name: string;
  path: string;
  size: number; // in bytes
  type: string;
  lastModified: Date;
  hash: string;
  category: Category;
}

export interface DuplicateGroup {
  hash: string;
  files: AppFile[];
  totalSize: number;
}
