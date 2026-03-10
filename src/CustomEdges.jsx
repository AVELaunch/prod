import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath } from '@xyflow/react';
import { EDGE_STYLES } from './funnelData';

export function FunnelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) {
  const edgeType = data?.edgeType;
  const isLoop = data?.isLoop;
  const style = edgeType === 'yes' ? EDGE_STYLES.yes : edgeType === 'no' ? EDGE_STYLES.no : EDGE_STYLES.default;

  const pathFn = isLoop ? getBezierPath : getSmoothStepPath;
  const [edgePath, labelX, labelY] = pathFn({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    ...(isLoop ? { curvature: 0.6 } : {}),
  });

  const strokeDasharray = isLoop ? EDGE_STYLES.loop.strokeDasharray : undefined;
  const strokeColor = isLoop && !edgeType ? EDGE_STYLES.loop.stroke : style.stroke;
  const label = data?.loopLabel || style.label;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth: 2,
          strokeDasharray,
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
              backgroundColor: edgeType === 'yes' ? '#dcfce7' : edgeType === 'no' ? '#fee2e2' : '#f1f5f9',
              color: edgeType === 'yes' ? '#166534' : edgeType === 'no' ? '#991b1b' : '#475569',
              borderColor: edgeType === 'yes' ? '#86efac' : edgeType === 'no' ? '#fca5a5' : '#cbd5e1',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
