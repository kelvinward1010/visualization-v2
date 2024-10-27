import React from "react";
import { useRecoilValue } from "recoil";
import {
    EdgeProps,
    EdgeLabelRenderer,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    getSimpleBezierPath,
} from "@xyflow/react";
import { edges } from "@/store/edges/stateRecoil";
import useThemeMode from "@/hooks/useThemeMode";

interface EdgesContainerProps extends EdgeProps {
    style?: React.CSSProperties;
}

const EdgesContainer: React.FC<EdgesContainerProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
}) => {
    const { isDarkMode } = useThemeMode();
    const typeEdge = useRecoilValue(edges);

    const getEdgePath = () => {
        switch (typeEdge) {
            case "getBezierPath":
                return getBezierPath;
            case "getSmoothStepPath":
                return getSmoothStepPath;
            case "getStraightPath":
                return getStraightPath;
            case "getSimpleBezierPath":
                return getSimpleBezierPath;
            default:
                return getBezierPath;
        }
    };

    const [edgePath, labelX, labelY] = getEdgePath()({
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
                id={id}
                style={{
                    stroke: isDarkMode ? "white" : "white",
                    strokeWidth: 3,
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        background: "teal",
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "white",
                    }}
                    className="nodrag nopan"
                >
                    Connected
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default EdgesContainer;
