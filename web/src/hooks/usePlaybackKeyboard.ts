import { useEffect } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { PlaybackState } from '../engine/createPlaybackStore';

type PlaybackStore = UseBoundStore<StoreApi<PlaybackState>>;

export function usePlaybackKeyboard(useStore: PlaybackStore, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      const state = useStore.getState();
      if (state.steps.length === 0) return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (state.isPlaying) state.pause();
          else state.play();
          break;
        case 'ArrowRight':
          event.preventDefault();
          state.stepForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          state.stepBackward();
          break;
        case 'Home':
          event.preventDefault();
          state.goTo(0);
          break;
        case 'r':
        case 'R':
          if (event.metaKey || event.ctrlKey) break;
          event.preventDefault();
          state.reset();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, useStore]);
}
