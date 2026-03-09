import dagre from '@dagrejs/dagre';

const NODE_WIDTH = 260;
const NODE_HEIGHT = 80;
const DECISION_WIDTH = 240;
const DECISION_HEIGHT = 100;

/**
 * Compute dagre layout for nodes and edges (top-to-bottom).
 * Returns positioned ReactFlow nodes.
 */
export function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    nodesep: 60,
    ranksep: 80,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    const isDecision = node.data?.nodeType === 'decision';
    g.setNode(node.id, {
      width: isDecision ? DECISION_WIDTH : NODE_WIDTH,
      height: isDecision ? DECISION_HEIGHT : NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    const isDecision = node.data?.nodeType === 'decision';
    const w = isDecision ? DECISION_WIDTH : NODE_WIDTH;
    const h = isDecision ? DECISION_HEIGHT : NODE_HEIGHT;
    return {
      ...node,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    };
  });

  return layoutedNodes;
}
