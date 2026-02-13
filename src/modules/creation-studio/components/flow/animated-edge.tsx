import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  getBezierPath,
} from "reactflow";
import { motion } from "framer-motion";

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.isActive as boolean;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {isActive && (
        <motion.path
          d={edgePath}
          fill="none"
          stroke={data?.color || "#ff0072"}
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0], // Draw, fill, erase
            opacity: [0, 1, 1, 0],
            strokeDashoffset: [0, 0, -20, -20],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
          style={{ ...style, strokeDasharray: 5 }}
        />
      )}
      {/* Particle effect for flowing data */}
      {isActive && (
        <circle r="4" fill={data?.color || "#ff0072"}>
          <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
}
