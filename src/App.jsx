import { useState, useMemo, useCallback } from 'react';
import { ReactFlow, Background, MiniMap, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodes as rawNodes, edges as rawEdges, NODE_COLORS, hubspotTable } from './funnelData';
import { getLayoutedElements } from './layoutEngine';
import { nodeTypes } from './CustomNodes';
import { edgeTypes } from './CustomEdges';

// ─── Priority levels ────────────────────────────────────────────────────
const PRIORITY_LEVELS = {
  'P1 Only': ['P1'],
  'P1 + P2': ['P1', 'P2'],
  'All': ['P1', 'P2', 'P3'],
};

// ─── Convert raw data to ReactFlow nodes/edges ─────────────────────────
function buildFlowNodes(rawNodes) {
  return rawNodes.map((n) => ({
    id: n.id,
    type: n.type,
    data: {
      ...n,
      nodeType: n.type,
    },
    position: { x: 0, y: 0 },
  }));
}

function buildFlowEdges(rawEdges) {
  return rawEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'funnel',
    data: {
      edgeType: e.edgeType,
      isLoop: e.isLoop,
      loopLabel: e.loopLabel,
    },
    priority: e.priority,
  }));
}

// ─── Compute layout once ────────────────────────────────────────────────
const initialFlowNodes = buildFlowNodes(rawNodes);
const initialFlowEdges = buildFlowEdges(rawEdges);
const layoutedNodes = getLayoutedElements(initialFlowNodes, initialFlowEdges);

// ─── Side Panel ─────────────────────────────────────────────────────────
function SidePanel({ node, onClose }) {
  if (!node) return null;
  const d = node;
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-gray-900 leading-tight pr-4">{d.label}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold shrink-0">×</button>
        </div>

        <div className="flex gap-2 mb-4">
          <span className={`text-xs font-bold px-2 py-1 rounded border ${
            d.priority === 'P1' ? 'bg-red-100 text-red-700 border-red-300' :
            d.priority === 'P2' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
            'bg-blue-100 text-blue-700 border-blue-300'
          }`}>{d.priority}</span>
          <span className="text-xs px-2 py-1 rounded border capitalize" style={{
            backgroundColor: NODE_COLORS[d.type]?.bg,
            borderColor: NODE_COLORS[d.type]?.border,
          }}>{NODE_COLORS[d.type]?.label || d.type}</span>
        </div>

        {d.detail?.description && (
          <Section title="Description">
            <p className="text-sm text-gray-600">{d.detail.description}</p>
          </Section>
        )}

        {d.hubspot && (
          <Section title="HubSpot Properties">
            {d.hubspot.dealStage && <Prop label="Deal Stage" value={d.hubspot.dealStage} />}
            {d.hubspot.leadStatus && <Prop label="Lead Status" value={d.hubspot.leadStatus} />}
            {d.hubspot.lifecycleStage && <Prop label="Lifecycle Stage" value={d.hubspot.lifecycleStage} />}
            {d.hubspot.note && <Prop label="Note" value={d.hubspot.note} />}
            {d.hubspot.trigger && <Prop label="Trigger" value={d.hubspot.trigger} />}
          </Section>
        )}

        {d.detail?.updatedBy && (
          <Section title="Updated By">
            <p className="text-sm text-gray-600">{d.detail.updatedBy}</p>
          </Section>
        )}

        {d.detail?.trigger && (
          <Section title="Trigger Mechanism">
            <p className="text-sm text-gray-600">{d.detail.trigger}</p>
          </Section>
        )}

        {d.emailer && d.emailer.sequence !== 'None' && (
          <Section title="Emailer Integration">
            <Prop label="Sequence" value={d.emailer.sequence} />
            {d.emailer.variants && (
              <div className="flex gap-1 my-1">
                {d.emailer.variants.map((v) => (
                  <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{v}</span>
                ))}
              </div>
            )}
            <Prop label="Email Count" value={d.emailer.emailCount} />
            {d.emailer.timing && <Prop label="Timing" value={d.emailer.timing} />}
            {d.emailer.goal && <Prop label="Goal" value={d.emailer.goal} />}
            {d.emailer.cta && <Prop label="CTA" value={d.emailer.cta} />}
            {d.emailer.subjects?.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-gray-500">Email Subjects:</span>
                <ul className="mt-1 space-y-1">
                  {d.emailer.subjects.map((s, i) => (
                    <li key={i} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {d.emailer.contentAngle && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-gray-500">Content Angle:</span>
                <div className="mt-1 space-y-1">
                  <div className="text-xs text-gray-600"><strong>WB:</strong> {d.emailer.contentAngle.WB}</div>
                  <div className="text-xs text-gray-600"><strong>BIZ:</strong> {d.emailer.contentAngle.BIZ}</div>
                </div>
              </div>
            )}
          </Section>
        )}

        {d.emailer?.note && (
          <Section title="Emailer Note">
            <p className="text-sm text-gray-600">{d.emailer.note}</p>
          </Section>
        )}

        {d.detail?.owner && (
          <Section title="Content Owner">
            <p className="text-sm text-gray-600">{d.detail.owner}</p>
          </Section>
        )}

        {d.warnings?.length > 0 && (
          <Section title="Warnings">
            {d.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 mb-1">
                <span>⚠</span>
                <span>{w}</span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</h3>
      {children}
    </div>
  );
}

function Prop({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-0.5">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-800 font-medium text-right max-w-[60%]">{String(value)}</span>
    </div>
  );
}

// ─── Segmentation Legend ────────────────────────────────────────────────
function SegmentationLegend() {
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
}

// ─── Node Color Legend ──────────────────────────────────────────────────
function ColorLegend() {
  const items = [
    { color: NODE_COLORS.entry, label: 'Lead Source / Entry' },
    { color: NODE_COLORS.positive, label: 'Positive Outcome' },
    { color: NODE_COLORS.lost, label: 'Lost / No-Show' },
    { color: NODE_COLORS.decision, label: 'Decision (Yes/No)' },
    { color: NODE_COLORS.sequence, label: 'Email Sequence' },
    { color: NODE_COLORS.system, label: 'HubSpot Action' },
    { color: NODE_COLORS.meeting, label: 'Call / Meeting' },
  ];
  return (
    <div className="absolute bottom-4 left-4 z-40 bg-white rounded-lg border border-gray-200 shadow-sm p-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Node Types</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-sm border" style={{ backgroundColor: item.color.bg, borderColor: item.color.border }} />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HubSpot Table Panel ────────────────────────────────────────────────
function HubSpotTablePanel() {
  const [open, setOpen] = useState(false);

  const exportCSV = useCallback(() => {
    const header = ['#', 'Deal Stage', 'Lead Status', 'Lifecycle', 'Emailer Sequence', 'Updated By', 'Trigger', 'Priority'];
    const rows = hubspotTable.map((r) =>
      [r.num, r.dealStage, r.leadStatus, r.lifecycle, r.emailerSequence, r.updatedBy, r.trigger, r.priority].join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    navigator.clipboard.writeText(csv).then(() => {
      alert('CSV copied to clipboard!');
    });
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white border-t border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
      >
        <span>HubSpot Tagging Summary ({hubspotTable.length} stages)</span>
        <span>{open ? '▼' : '▲'}</span>
      </button>
      {open && (
        <div className="bg-white border-t border-gray-100 max-h-64 overflow-y-auto">
          <div className="flex justify-end px-4 py-2">
            <button
              onClick={exportCSV}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded border border-gray-300 font-medium"
            >
              Export CSV to Clipboard
            </button>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['#', 'Deal Stage', 'Lead Status', 'Lifecycle', 'Emailer Sequence', 'Updated By', 'Trigger', 'Priority'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-gray-500 font-semibold border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hubspotTable.map((row) => (
                <tr key={row.num} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-3 py-1.5 text-gray-400">{row.num}</td>
                  <td className="px-3 py-1.5 font-medium text-gray-800">{row.dealStage}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.leadStatus}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.lifecycle}</td>
                  <td className="px-3 py-1.5 font-mono text-purple-700">{row.emailerSequence}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.updatedBy}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.trigger}</td>
                  <td className="px-3 py-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      row.priority === 'P1' ? 'bg-red-100 text-red-700 border-red-300' :
                      row.priority === 'P2' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                      'bg-blue-100 text-blue-700 border-blue-300'
                    }`}>{row.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

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

// ─── Main App ───────────────────────────────────────────────────────────
export default function App() {
  const [priorityFilter, setPriorityFilter] = useState('P1 Only');
  const [selectedNode, setSelectedNode] = useState(null);

  const allowedPriorities = PRIORITY_LEVELS[priorityFilter];

  // Apply priority visibility (hide, don't re-layout)
  const visibleNodes = useMemo(() => {
    return layoutedNodes.map((n) => ({
      ...n,
      hidden: !allowedPriorities.includes(n.data.priority),
    }));
  }, [allowedPriorities]);

  const visibleEdges = useMemo(() => {
    return initialFlowEdges.map((e) => ({
      ...e,
      hidden: !allowedPriorities.includes(e.priority),
    }));
  }, [allowedPriorities]);

  const onNodeClick = useCallback((_event, node) => {
    setSelectedNode(node.data);
  }, []);

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
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <MiniMap
          nodeColor={(n) => NODE_COLORS[n.type]?.border || '#6b7280'}
          maskColor="rgba(0,0,0,0.08)"
          className="!bottom-12 !right-4"
        />
        <Controls className="!bottom-12 !left-auto !right-64" />
      </ReactFlow>

      <HubSpotTablePanel />

      {selectedNode && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSelectedNode(null)} />
          <SidePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        </>
      )}
    </div>
  );
}
