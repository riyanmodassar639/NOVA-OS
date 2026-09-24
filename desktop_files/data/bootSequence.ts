// ============================================================
// NOVA OS Boot Sequence Configuration
// Architect: Modular — connect real kernel events here later
// ============================================================

export interface BootStep {
  id: string;
  message: string;
  duration: number;          // ms to display this message
  progress: number;          // 0–100 target progress
  status: "pending" | "active" | "complete" | "error";
}

export interface BootEvent {
  id: string;
  message: string;
  progress: number;
  status: "pending" | "active" | "complete" | "error";
}

export const BOOT_SEQUENCE: BootStep[] = [
  { id: "kernel",        message: "INITIALIZING NOVA KERNEL...",          duration: 1200, progress: 8,   status: "pending" },
  { id: "memory",        message: "LOADING MEMORY MANAGER...",            duration: 900,  progress: 18,  status: "pending" },
  { id: "interrupts",    message: "INITIALIZING INTERRUPT CONTROLLER...", duration: 800,  progress: 27,  status: "pending" },
  { id: "scheduler",     message: "STARTING PROCESS SCHEDULER...",        duration: 700,  progress: 36,  status: "pending" },
  { id: "filesystem",    message: "INITIALIZING FILESYSTEM...",           duration: 950,  progress: 47,  status: "pending" },
  { id: "drivers",       message: "LOADING DEVICE DRIVERS...",            duration: 1100, progress: 57,  status: "pending" },
  { id: "graphics",      message: "INITIALIZING GRAPHICS SUBSYSTEM...",   duration: 900,  progress: 67,  status: "pending" },
  { id: "services",      message: "STARTING SYSTEM SERVICES...",          duration: 800,  progress: 76,  status: "pending" },
  { id: "ai_init",       message: "INITIALIZING AI SUBSYSTEM...",         duration: 1000, progress: 84,  status: "pending" },
  { id: "nova_core",     message: "LOADING NOVA CORE AI...",              duration: 1200, progress: 91,  status: "pending" },
  { id: "integrity",     message: "SYSTEM INTEGRITY CHECK...",            duration: 700,  progress: 95,  status: "pending" },
  { id: "hardware",      message: "HARDWARE INITIALIZATION COMPLETE...",  duration: 600,  progress: 98,  status: "pending" },
  { id: "ready",         message: "NOVA OS READY",                        duration: 1500, progress: 100, status: "pending" },
];

export const TOTAL_BOOT_DURATION = BOOT_SEQUENCE.reduce((acc, s) => acc + s.duration, 0);
