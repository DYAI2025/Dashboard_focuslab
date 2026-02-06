
export interface ServiceCheck {
  name: string;
  port: number | null;
  status: 'up' | 'down' | 'degraded';
  detail: string;
}

export interface SystemResources {
  ram: { total: number; used: number; available: number; percent: number };
  disk: { total: string; used: string; available: string; percent: number };
  load: { avg1: number; avg5: number; avg15: number };
  uptime: string;
}

export interface NexusStatus {
  timestamp: string;
  services: ServiceCheck[];
  resources: SystemResources;
}
