import { create } from 'zustand';
import type { SceneState, VisualStep } from '../types/demo';
import { composeScene } from './SceneComposer';

interface PlaybackState {
  steps: VisualStep[];
  initialScene: SceneState | null;
  currentIndex: number;
  isPlaying: boolean;
  speedMs: number;
  intervalId: ReturnType<typeof setInterval> | null;
  load: (initialScene: SceneState, steps: VisualStep[]) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  goTo: (index: number) => void;
  setSpeed: (speedMs: number) => void;
  getScene: () => SceneState | null;
  getCurrentStep: () => VisualStep | null;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  steps: [],
  initialScene: null,
  currentIndex: -1,
  isPlaying: false,
  speedMs: 600,
  intervalId: null,

  load: (initialScene, steps) => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({
      initialScene,
      steps,
      currentIndex: steps.length > 0 ? 0 : -1,
      isPlaying: false,
      intervalId: null,
    });
  },

  play: () => {
    const state = get();
    if (state.intervalId) clearInterval(state.intervalId);
    if (state.steps.length === 0) return;

    const intervalId = setInterval(() => {
      const { currentIndex, steps, intervalId: id } = get();
      if (currentIndex >= steps.length - 1) {
        if (id) clearInterval(id);
        set({ isPlaying: false, intervalId: null });
        return;
      }
      set({ currentIndex: currentIndex + 1 });
    }, state.speedMs);

    set({ isPlaying: true, intervalId });
  },

  pause: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ isPlaying: false, intervalId: null });
  },

  stepForward: () => {
    const { currentIndex, steps, isPlaying } = get();
    if (isPlaying) get().pause();
    if (currentIndex < steps.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  stepBackward: () => {
    const { currentIndex, isPlaying } = get();
    if (isPlaying) get().pause();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  reset: () => {
    get().pause();
    set({ currentIndex: get().steps.length > 0 ? 0 : -1 });
  },

  goTo: (index) => {
    const { steps, isPlaying } = get();
    if (isPlaying) get().pause();
    const clamped = Math.max(0, Math.min(index, steps.length - 1));
    set({ currentIndex: clamped });
  },

  setSpeed: (speedMs) => {
    const wasPlaying = get().isPlaying;
    if (wasPlaying) get().pause();
    set({ speedMs });
    if (wasPlaying) get().play();
  },

  getScene: () => {
    const { initialScene, steps, currentIndex } = get();
    if (!initialScene || currentIndex < 0) return initialScene;
    return composeScene(initialScene, steps, currentIndex);
  },

  getCurrentStep: () => {
    const { steps, currentIndex } = get();
    if (currentIndex < 0 || currentIndex >= steps.length) return null;
    return steps[currentIndex];
  },
}));
