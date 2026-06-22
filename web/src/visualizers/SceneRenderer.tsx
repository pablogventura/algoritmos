import type { SceneState, VisualFamily } from '../types/demo';
import { ArrayBars } from './ArrayBars/ArrayBars';
import { GraphView } from './GraphView/GraphView';
import { TreeView } from './TreeView/TreeView';
import { MatrixGrid } from './MatrixGrid/MatrixGrid';
import { StringSceneView } from './StringScene/StringSceneView';
import { TimelineView } from './TimelineView/TimelineView';

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

  switch (scene.kind) {
    case 'array':
      return <ArrayBars scene={scene} />;
    case 'graph':
      return <GraphView scene={scene} />;
    case 'tree':
      return <TreeView scene={scene} />;
    case 'matrix':
      return <MatrixGrid scene={scene} />;
    case 'string':
      return <StringSceneView scene={scene} />;
    case 'timeline':
      return <TimelineView scene={scene} />;
    default:
      return (
        <div className="flex h-full items-center justify-center text-slate-500">
          Visualizer not available ({visualFamily})
        </div>
      );
  }
}
