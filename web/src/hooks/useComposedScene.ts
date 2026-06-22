import { useMemo } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { PlaybackState } from '../engine/createPlaybackStore';
import { composeScene } from '../engine/SceneComposer';
import type { SceneState, VisualStep } from '../types/demo';

type PlaybackStore = UseBoundStore<StoreApi<PlaybackState>>;

export function useComposedScene(useStore: PlaybackStore): SceneState | null {
  const initialScene = useStore((s) => s.initialScene);
  const steps = useStore((s) => s.steps);
  const currentIndex = useStore((s) => s.currentIndex);

  return useMemo(() => {
    if (!initialScene || currentIndex < 0) return initialScene;
    return composeScene(initialScene, steps, currentIndex);
  }, [initialScene, steps, currentIndex]);
}

export function useCurrentStep(useStore: PlaybackStore): VisualStep | null {
  const steps = useStore((s) => s.steps);
  const currentIndex = useStore((s) => s.currentIndex);

  return useMemo(() => {
    if (currentIndex < 0 || currentIndex >= steps.length) return null;
    return steps[currentIndex];
  }, [steps, currentIndex]);
}
