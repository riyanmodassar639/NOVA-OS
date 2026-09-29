// ============================================================
// useBootSequence — Custom Hook
// Controls the NOVA OS boot animation timeline
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { BOOT_SEQUENCE, BootStep } from "../data/bootSequence";

export type BootPhase =
  | "black"        // 0.0s  – pure black
  | "particles"    // 0.2s  – particles appear
  | "circuits"     // 0.5s  – circuit traces illuminate
  | "core"         // 1.0s  – circular core begins forming
  | "outerring"    // 1.5s  – outer ring appears
  | "innerring"    // 2.0s  – inner ring appears
  | "radials"      // 2.5s  – radial lines activate
  | "logo"         // 3.0s  – NOVA logo fades in
  | "ostext"       // 3.5s  – OS text appears
  | "booting"      // 4.0s  – boot progress begins
  | "ready"        // 100%  – NOVA OS READY
  | "complete";    // after completion animation

export interface BootState {
  phase: BootPhase;
  progress: number;           // 0–100
  currentStep: BootStep | null;
  completedSteps: string[];
  isReady: boolean;
}

interface UseBootSequenceOptions {
  onBootComplete?: () => void;
  autoStart?: boolean;
}

// Phase timings (ms from boot start)
const PHASE_TIMINGS: Record<BootPhase, number> = {
  black:     0,
  particles: 0,
  circuits:  0,
  core:      0,
  outerring: 0,
  innerring: 0,
  radials:   0,
  logo:      0,
  ostext:    0,
  booting:   0,
  ready:     0,     // driven by progress
  complete:  0,     // driven by progress
};

export function useBootSequence({ onBootComplete, autoStart = true }: UseBootSequenceOptions = {}) {
  const [phase, setPhase] = useState<BootPhase>("black");
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const bootStartRef = useRef<number | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const perfMultiplier = useRef<number>(1);

  const cleanup = useCallback(() => {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  const measureSystemPerformance = () => {
    // Quick synthetic benchmark to determine system capability
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 5000000; i++) {
      result += Math.sqrt(i);
    }
    const timeTaken = performance.now() - start;
    
    // Baseline: Assume a very fast system takes ~5ms for this loop
    // Slower systems might take 50ms+
    let multiplier = timeTaken / 5.0;
    
    // Clamp multiplier to reasonable bounds (0.2x to 6.0x)
    if (multiplier < 0.2) multiplier = 0.2;
    if (multiplier > 6.0) multiplier = 6.0;
    
    return multiplier;
  };

  const startBootSequence = useCallback(() => {
    cleanup();
    bootStartRef.current = performance.now();
    
    // Measure system performance once at the start of boot
    perfMultiplier.current = measureSystemPerformance();

    // Schedule phases instantly
    setPhase("booting");

    // Immediately start the step-by-step boot messages
    runBootSteps(0);
  }, [cleanup]);

  const runBootSteps = useCallback((stepIdx: number) => {
    if (stepIdx >= BOOT_SEQUENCE.length) return;

    const step = BOOT_SEQUENCE[stepIdx];
    setCurrentStepIndex(stepIdx);

    // Smoothly animate progress to target
    const targetProgress = step.progress;
    const startProgress = BOOT_SEQUENCE[stepIdx - 1]?.progress ?? 0;
    
    // Multiply the hardcoded duration by the system performance multiplier
    const duration = step.duration * perfMultiplier.current;
    
    const startTime = performance.now();

    const animateProgress = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startProgress + (targetProgress - startProgress) * eased;
      setProgress(Math.round(current));

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        setProgress(targetProgress);
        setCompletedSteps((prev) => [...prev, step.id]);

        if (step.id === "ready") {
          setPhase("ready");
          setIsReady(true);
          setTimeout(() => {
            setPhase("complete");
            onBootComplete?.();
          }, 1800 * perfMultiplier.current); // Scale the final delay too!
        } else {
          stepTimerRef.current = setTimeout(() => {
            runBootSteps(stepIdx + 1);
          }, 50);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animateProgress);
  }, [onBootComplete]);

  useEffect(() => {
    if (autoStart) startBootSequence();
    return cleanup;
  }, []);

  const currentStep = currentStepIndex >= 0 ? BOOT_SEQUENCE[currentStepIndex] : null;

  return {
    phase,
    progress,
    currentStep,
    completedSteps,
    isReady,
    startBootSequence,
  } as const;
}
