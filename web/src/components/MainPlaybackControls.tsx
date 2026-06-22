import { usePlaybackStore } from '../engine/playbackStore';
import { PlaybackControls as PlaybackControlsBase } from './PlaybackControls';

export function MainPlaybackControls() {
  return <PlaybackControlsBase useStore={usePlaybackStore} />;
}
