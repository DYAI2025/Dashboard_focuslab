
export const SYSTEM_LABEL = 'NEXUS';
export const DIVISION_LABEL = 'STATUS_DIVISION';
export const HERO_TITLE_1 = 'System';
export const HERO_TITLE_2 = 'Intelligence';
export const HERO_SUBTITLE = 'Real-time health monitoring for the Nexus AI workspace';

export const PHILOSOPHIE_TEXT = `Nexus is a personal AI control plane combining multi-channel messaging, voice interaction, and autonomous agent capabilities. This dashboard provides real-time visibility into every running service — from the Clawdbot Gateway to Agent Zero, from Whisper STT to the Marvin watchdog. No fake numbers, no placeholders — just live system telemetry.`;

export const NAV_ITEMS = ['Services', 'Resources', 'Operations'];

export const SERVICE_TAGS: Record<string, string[]> = {
  'Clawdbot Gateway': ['WS', 'Multi-Channel', 'TypeScript'],
  'Agent Zero': ['Docker', 'Agentic-AI', 'Python'],
  'Whisper STT': ['Speech-to-Text', 'uvicorn', 'Local'],
  'Planka': ['Docker', 'Kanban', 'Project-Mgmt'],
  'Kanban API': ['Node.js', 'REST', 'systemd'],
  'Ollama': ['LLM', 'Local-Inference', 'CPU'],
  'Marvin Cron': ['Watchdog', 'Auto-Heal', 'Cron'],
  'Claude Processes': ['CLI', 'Anthropic', 'Agent'],
};
