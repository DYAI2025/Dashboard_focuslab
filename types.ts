
export interface ProjectModule {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'STABLE';
  tags: string[];
  imageUrl: string;
  repoUrl: string;
  detailsUrl: string;
  stability?: number;
  logChannel?: string;
}

export interface Principle {
  id: number;
  label: string;
  title: string;
  description: string;
}
