import { useState, useMemo, useCallback, memo } from 'react';
import { ReactFlow, Background, MiniMap, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodes as rawNodes, edges as rawEdges, NODE_COLORS, EDGE_STYLES } from './funnelData';
import { getLayoutedElements } from './layoutEngine';
import { nodeTypes, edgeTypes } from './flowTypes';
import SidePanel from './SidePanel';
import HubSpotTable from './HubSpotTable';

// ─── Priority levels ────────────────────────────────────────────────────
const PRIORITY_LEVELS = {
  'P1 Only': ['P1'],
  'P1 + P2': ['P1', 'P2'],
  'All': ['P1', 'P2', 'P3'],
};

// ─── Resolve marker color for an edge ───────────────────────────────────
function markerColorForEdge(edge) {
  if (edge.edgeType === 'yes') return EDGE_STYLES.yes.stroke;
  if (edge.edgeType === 'no') return EDGE_STYLES.no.stroke;
  if (edge.isLoop) return EDGE_STYLES.loop.stroke;
  return EDGE_STYLES.default.stroke;
}

// ─── Convert raw data to ReactFlow format ───────────────────────────────
function toFlowNodes(dataNodes) {
  return dataNodes.map((n) => ({
    id: n.id,
    type: n.type,
    data: { ...n, nodeType: n.type },
    position: { x: 0, y: 0 },
  }));
}

function toFlowEdges(dataEdges) {
  return dataEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'funnel',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: markerColorForEdge(e),
    },
    data: {
      edgeType: e.edgeType,
      isLoop: e.isLoop,
      loopLabel: e.loopLabel,
    },
    priority: e.priority,
  }));
}

// ─── Compute layout once at module level ────────────────────────────────
const flowNodes = toFlowNodes(rawNodes);
const flowEdges = toFlowEdges(rawEdges);
const layoutedNodes = getLayoutedElements(flowNodes, flowEdges);

// ─── Segmentation Legend ────────────────────────────────────────────────
const SegmentationLegend = memo(function SegmentationLegend() {
  return (
    <div className="absolute top-16 right-4 z-40 bg-white rounded-lg border border-gray-200 shadow-sm p-3 w-56">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Segmentation</h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">_WB</span>
          <span className="text-gray-600">Well-being</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 font-semibold">_BIZ</span>
          <span className="text-gray-600">Business</span>
        </div>
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
          <strong>Fallback rule:</strong> If Ad Campaign field is empty → assign _BIZ segment automatically. Organic/referral leads with no campaign tag default to BIZ.
        </div>
      </div>
    </div>
  );
});

// ─── Node Color Legend ──────────────────────────────────────────────────
const LEGEND_ITEMS = [
  { color: NODE_COLORS.entry, label: 'Lead Source / Entry' },
  { color: NODE_COLORS.positive, label: 'Positive Outcome' },
  { color: NODE_COLORS.lost, label: 'Lost / No-Show' },
  { color: NODE_COLORS.decision, label: 'Decision (Yes/No)' },
  { color: NODE_COLORS.sequence, label: 'Email Sequence' },
  { color: NODE_COLORS.system, label: 'HubSpot Action' },
  { color: NODE_COLORS.meeting, label: 'Call / Meeting' },
];

const ColorLegend = memo(function ColorLegend() {
  return (
    <div className="absolute bottom-14 left-4 z-40 bg-white rounded-lg border border-gray-200 shadow-sm p-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Node Types</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-sm border" style={{ backgroundColor: item.color.bg, borderColor: item.color.border }} />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Priority Filter ────────────────────────────────────────────────────
function PriorityFilter({ active, onChange }) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {Object.keys(PRIORITY_LEVELS).map((label) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            active === label
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── MiniMap node color helper ──────────────────────────────────────────
function minimapNodeColor(n) {
  return NODE_COLORS[n.type]?.border || '#6b7280';
}

// ─── Main App ───────────────────────────────────────────────────────────
export default function App() {
  const [priorityFilter, setPriorityFilter] = useState('P1 Only');
  const [selectedNode, setSelectedNode] = useState(null);

  const allowedPriorities = PRIORITY_LEVELS[priorityFilter];

  const visibleNodeIds = useMemo(() => {
    return new Set(rawNodes.filter((n) => allowedPriorities.includes(n.priority)).map((n) => n.id));
  }, [allowedPriorities]);

  const visibleNodes = useMemo(() => {
    return layoutedNodes.map((n) => ({
      ...n,
      hidden: !visibleNodeIds.has(n.id),
    }));
  }, [visibleNodeIds]);

  const visibleEdges = useMemo(() => {
    return flowEdges.map((e) => ({
      ...e,
      hidden: !visibleNodeIds.has(e.source) || !visibleNodeIds.has(e.target),
    }));
  }, [visibleNodeIds]);

  const onNodeClick = useCallback((_event, node) => {
    setSelectedNode(node.data);
  }, []);

  const closePanel = useCallback(() => setSelectedNode(null), []);

  return (
    <div className="w-full h-screen bg-gray-50 relative">
      <PriorityFilter active={priorityFilter} onChange={setPriorityFilter} />
      <SegmentationLegend />
      <ColorLegend />

      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color="#e2e8f0" gap={20} />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(0,0,0,0.08)"
          className="!bottom-12 !right-4"
        />
        <Controls className="!bottom-12 !left-auto !right-64" />
      </ReactFlow>

      <HubSpotTable />

      {selectedNode && (
        <>
          <div className="fixed inset-0 z-40" onClick={closePanel} />
          <SidePanel node={selectedNode} onClose={closePanel} />
        </>
      )}
    </div>
  );
}
