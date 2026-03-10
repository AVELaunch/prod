import { EntryNode, PositiveNode, LostNode, DecisionNode, SequenceNode, SystemNode, MeetingNode } from './CustomNodes';
import { FunnelEdge } from './CustomEdges';

export const nodeTypes = {
  entry: EntryNode,
  positive: PositiveNode,
  lost: LostNode,
  decision: DecisionNode,
  sequence: SequenceNode,
  system: SystemNode,
  meeting: MeetingNode,
};

export const edgeTypes = {
  funnel: FunnelEdge,
};
