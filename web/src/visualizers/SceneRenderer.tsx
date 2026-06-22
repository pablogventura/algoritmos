import type { SceneState, VisualFamily } from '../types/demo';
import { ArrayBars } from './ArrayBars/ArrayBars';
import { GraphView } from './GraphView/GraphView';

interface SceneRendererProps {
  scene: SceneState | null;
  visualFamily: VisualFamily;
}

export function SceneRenderer({ scene, visualFamily }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        No scene loaded
      </div>
    );
  }

  if (scene.kind === 'array' || visualFamily === 'array-bars') {
    if (scene.kind === 'array') return <ArrayBars scene={scene} />;
  }

  if (scene.kind === 'graph' || visualFamily === 'graph-view') {
    if (scene.kind === 'graph') return <GraphView scene={scene} />;
  }

  return (
    <div className="flex h-full items-center justify-center text-slate-500">
      Visualizer not implemented for this family yet
    </div>
  );
}
