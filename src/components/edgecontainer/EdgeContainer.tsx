import React from "react";
import { useRecoilValue } from "recoil";
import {
    EdgeProps,
    EdgeLabelRenderer,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    getSimpleBezierPath,
    BaseEdge,
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
            <BaseEdge
                className="react-flow__edge-path"
                style={{
                    stroke: isDarkMode ? "white" : "white",
                    strokeWidth: 3,
                }}
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        background: "teal",
                        padding: 10,
                        borderRadius: "50%",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "white",
                    }}
                    className="nodrag nopan"
                >
                    Ok
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default EdgesContainer;
