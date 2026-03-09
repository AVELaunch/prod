import { ReactFlow, Background, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function App() {
  return (
    <div className="w-full h-screen bg-gray-50">
      <ReactFlow nodes={[]} edges={[]}>
        <Background />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
