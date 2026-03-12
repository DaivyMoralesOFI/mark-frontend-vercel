import { EdgeProps, getSmoothStepPath } from "reactflow";

export default function ImageEdge({
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
    borderRadius: 16,
  });

  return (
    <g>
      <defs>
        <marker
          id={`image-arrow-${id}`}
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <polyline
            points="0,0.5 5,3.5 0,6.5"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Rail */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(139,92,246,0.15)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Animated flowing dashes */}
      <path
        d={edgePath}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth={2}
        strokeDasharray="5 8"
        strokeLinecap="round"
        markerEnd={`url(#image-arrow-${id})`}
        style={{ animation: "imageFlow 1s linear infinite" }}
      />

      {/* Source dot */}
      <circle cx={sourceX} cy={sourceY} r={3.5} fill="#8b5cf6" stroke="white" strokeWidth={1.5} />

      <style>{`
        @keyframes imageFlow {
          from { stroke-dashoffset: 13; }
          to   { stroke-dashoffset: 0;  }
        }
      `}</style>
    </g>
  );
}
