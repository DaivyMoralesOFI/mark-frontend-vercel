import { EdgeProps, getSmoothStepPath } from "reactflow";

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0, // Sharp right-angle corners, n8n style
  });

  const markerId = `arrow-${id}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#3a3a3aff" />
        </marker>
      </defs>

      {/* Sharp rectangular connector line */}
      <path
        d={edgePath}
        fill="none"
        stroke="#484848ff"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        markerEnd={`url(#${markerId})`}
      />
    </>
  );
}
