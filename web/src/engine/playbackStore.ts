import { createPlaybackStore } from './createPlaybackStore';

export const usePlaybackStore = createPlaybackStore();

export { createPlaybackStore };
export type { PlaybackState } from './createPlaybackStore';
