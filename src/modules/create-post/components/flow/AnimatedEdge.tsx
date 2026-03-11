import { EdgeProps, getBezierPath } from "reactflow";

export default function AnimatedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="var(--outline-variant)"
        strokeWidth={1.5}
        strokeDasharray="6 4"
        strokeLinecap="round"
        style={{
          animation: "edgeFlow 0.5s linear infinite",
          opacity: 0.7,
        }}
      />
      <style>{`
        @keyframes edgeFlow {
          from { stroke-dashoffset: 10; }
          to   { stroke-dashoffset: 0;  }
        }
      `}</style>
    </>
  );
}
