import { Handle, Position } from '@xyflow/react';
import { NODE_COLORS } from './funnelData';

// --- Priority badge colors ---
const PRIORITY_BADGE = {
  P1: 'bg-red-100 text-red-700 border-red-300',
  P2: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  P3: 'bg-blue-100 text-blue-700 border-blue-300',
};

function PriorityBadge({ priority }) {
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${PRIORITY_BADGE[priority] || ''}`}>
      {priority}
    </span>
  );
}

function SegmentPills() {
  return (
    <div className="flex gap-1 mt-1">
      <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">WB</span>
      <span className="text-[9px] px-1 py-0.5 rounded bg-sky-100 text-sky-700 font-medium">BIZ</span>
    </div>
  );
}

function EmailCountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-200 text-purple-800 font-semibold">
      {count} {count === 1 ? 'email' : 'emails'}
    </span>
  );
}

function WarningBadge() {
  return (
    <span className="text-[10px] px-1 py-0.5 rounded bg-amber-200 text-amber-800 font-bold" title="Has reschedule limits or timeouts">
      ⚠
    </span>
  );
}

// --- Base wrapper for all non-decision nodes ---
function BaseNode({ data, colors, children }) {
  return (
    <div
      className="rounded-lg border-2 shadow-sm px-3 py-2 min-w-[220px] max-w-[260px] cursor-pointer transition-shadow hover:shadow-md"
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2" />
      <div className="flex items-center justify-between gap-1 mb-1">
        <PriorityBadge priority={data.priority} />
        <div className="flex gap-1 items-center">
          {data.warnings?.length > 0 && <WarningBadge />}
          {data.emailer?.emailCount > 0 && <EmailCountBadge count={data.emailer.emailCount} />}
        </div>
      </div>
      <div className="text-xs font-semibold text-gray-800 leading-tight">{data.label}</div>
      {data.emailer?.sequence && data.emailer.sequence !== 'None' && <SegmentPills />}
      {children}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
}

// --- Decision diamond node ---
export function DecisionNode({ data }) {
  const colors = NODE_COLORS.decision;
  return (
    <div className="flex items-center justify-center" style={{ width: 240, height: 100 }}>
      <div
        className="relative cursor-pointer transition-shadow hover:shadow-md"
        style={{ width: 170, height: 85 }}
      >
        <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2" style={{ top: -4 }} />
        <svg viewBox="0 0 170 85" className="absolute inset-0 w-full h-full drop-shadow-sm">
          <polygon
            points="85,2 168,42.5 85,83 2,42.5"
            fill={colors.bg}
            stroke={colors.border}
            strokeWidth="2"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-1 text-center">
          <PriorityBadge priority={data.priority} />
          <div className="text-[10px] font-semibold text-gray-800 leading-tight mt-0.5">{data.label}</div>
          {data.warnings?.length > 0 && <WarningBadge />}
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2" style={{ bottom: -4 }} />
      </div>
    </div>
  );
}

// --- Typed node components ---
export function EntryNode({ data }) {
  return <BaseNode data={data} colors={NODE_COLORS.entry} />;
}

export function PositiveNode({ data }) {
  return <BaseNode data={data} colors={NODE_COLORS.positive} />;
}

export function LostNode({ data }) {
  return <BaseNode data={data} colors={NODE_COLORS.lost} />;
}

export function SequenceNode({ data }) {
  return <BaseNode data={data} colors={NODE_COLORS.sequence} />;
}

export function SystemNode({ data }) {
  return <BaseNode data={data} colors={NODE_COLORS.system} />;
}

export function MeetingNode({ data }) {
  return <BaseNode data={data} colors={NODE_COLORS.meeting} />;
}

// --- Node type registry for ReactFlow ---
export const nodeTypes = {
  entry: EntryNode,
  positive: PositiveNode,
  lost: LostNode,
  decision: DecisionNode,
  sequence: SequenceNode,
  system: SystemNode,
  meeting: MeetingNode,
};
