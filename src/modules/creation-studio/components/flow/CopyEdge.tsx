import { EdgeProps, getSmoothStepPath } from "reactflow";

export default function CopyEdge({
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
          id={`copy-arrow-${id}`}
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <polyline
            points="0,0.5 5,3.5 0,6.5"
            fill="none"
            stroke="#D946EF"
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
        stroke="rgba(217,70,239,0.15)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Animated flowing dashes */}
      <path
        d={edgePath}
        fill="none"
        stroke="#D946EF"
        strokeWidth={2}
        strokeDasharray="4 7"
        strokeLinecap="round"
        markerEnd={`url(#copy-arrow-${id})`}
        style={{ animation: "copyFlow 1s linear infinite" }}
      />

      {/* Source dot */}
      <circle cx={sourceX} cy={sourceY} r={3.5} fill="#D946EF" stroke="white" strokeWidth={1.5} />

      <style>{`
        @keyframes copyFlow {
          from { stroke-dashoffset: 11; }
          to   { stroke-dashoffset: 0;  }
        }
      `}</style>
    </g>
  );
}
