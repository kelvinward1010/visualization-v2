import { atomState } from "@/store/atom";
import {
    Edge,
    EdgeRemoveChange,
    getConnectedEdges,
    Handle,
    Node,
    NodeRemoveChange,
    NodeResizeControl,
    NodeResizer,
    Position,
    useReactFlow,
    useStoreApi,
    useUpdateNodeInternals,
} from "@xyflow/react";
import { drag, DragBehavior } from "d3-drag";
import { select, Selection } from "d3-selection";
import { produce } from "immer";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { BoxNode, CardBox, StackNode } from "./BoxNode";
import useThemeMode from "@/hooks/useThemeMode";
import { Flex, Typography } from "antd";
import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import ModalData from "../modals/ModalData";

interface NodeContainerProps {
    children?: React.ReactNode;
    label?: string;
    resizable?: boolean;
    rotatable?: boolean;
    id?: string;
    isConnectable?: boolean;
    isLeftHandle?: boolean;
    className?: string;
    type?: string;
    selected?: boolean;
}

interface CustomProps {
    onCallback: (params: any) => void;
    id: string;
    isConnectable: boolean;
}

const controlStyle = {
    background: "transparent",
    border: "none",
};

const { Text } = Typography;

function NodeContainer({
    children,
    label = "Default Node",
    resizable = false,
    rotatable = false,
    id,
    isConnectable,
    isLeftHandle = false,
    className = "node-container",
    type,
    selected,
}: NodeContainerProps) {
    const { isDarkMode } = useThemeMode();
    const rotateControlRef = useRef<any | null>(null);
    const updateNodeInternals = useUpdateNodeInternals();
    const [rotation, setRotation] = useState(0);

    const [atoms, setAtoms] = useRecoilState(atomState);
    const atom = atoms.find((a: any) => a.id === id)?.data;

    const { getEdges, getNode } = useReactFlow();
    const store = useStoreApi();

    function handleDeleteNode() {
        const { onNodesDelete, onNodesChange, onEdgesChange, onEdgesDelete } =
            store.getState();
        const node: Node | undefined = getNode(String(id));
        if (!node) {
            return;
        }
        const nodesToRemove: Node[] = [node];

        const connectedEdges = getConnectedEdges(nodesToRemove, getEdges());
        const edgesToRemove: Edge[] = [...connectedEdges];
        const edgeIdsToRemove = edgesToRemove.reduce(
            (res: string[], edge: Edge) => {
                if (!res.includes(edge.id)) {
                    res.push(edge.id);
                }
                return res;
            },
            [] as string[],
        );

        if (edgeIdsToRemove.length > 0) {
            onEdgesDelete?.(edgesToRemove);

            if (onEdgesChange) {
                const edgeChanges: EdgeRemoveChange[] = edgeIdsToRemove.map(
                    (id: string) => ({
                        id,
                        type: "remove",
                    }),
                );
                onEdgesChange(edgeChanges);
            }
        }

        if (nodesToRemove.length > 0) {
            onNodesDelete?.(nodesToRemove);

            if (onEdgesChange) {
                const nodeChanges: NodeRemoveChange[] = nodesToRemove.map(
                    (n: Node) => ({
                        id: n.id,
                        type: "remove",
                    }),
                );
                onNodesChange?.(nodeChanges);
            }
        }

        setAtoms(
            produce((draft) => {
                const index = draft.findIndex(
                    (n) => n.id === nodesToRemove[0].id,
                );
                if (index !== -1) draft.splice(index, 1);
            }),
        );
        store.setState({ nodesSelectionActive: false });
    }

    function handleCallback(params: any) {
        setAtoms(
            produce((draft) => {
                const index = draft.findIndex((n) => n.id === id);
                if (index !== -1) draft[index].data = params;
            }),
        );
    }

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement<CustomProps>(child)) {
            return React.cloneElement(child, {
                onCallback: handleCallback,
                id,
                isConnectable,
            });
        }
        return child;
    });

    useEffect(() => {
        if (!rotateControlRef.current) {
            return;
        }

        const selection: Selection<SVGElement, unknown, null, undefined> =
            select(rotateControlRef.current);
        const dragHandler: DragBehavior<SVGElement, unknown, unknown> = drag<
            SVGElement,
            unknown,
            unknown
        >().on("drag", (evt) => {
            const dx = evt.x - 100;
            const dy = evt.y - 100;
            const rad = Math.atan2(dx, dy);
            const deg = rad * (180 / Math.PI);
            setRotation(180 - deg);
            updateNodeInternals(String(id));
        });

        selection.call(dragHandler);

        return () => {
            selection.on(".drag", null);
        };
    }, [id, updateNodeInternals]);

    return (
        <BoxNode
            style={{ transform: `rotate(${rotation}deg)` }}
            className={className}
            theme={isDarkMode ? "dark" : "light"}
            selected={selected}
        >
            {resizable && (
                <NodeResizer
                    isVisible={resizable}
                    minWidth={180}
                    minHeight={100}
                />
            )}
            {rotatable && (
                <div
                    ref={rotateControlRef}
                    style={{
                        display: rotatable ? "block" : "none",
                    }}
                    className={`nodrag rotateHandle`}
                />
            )}
            <NodeResizeControl
                style={controlStyle}
                minWidth={200}
                minHeight={100}
            >
                <ResizeIcon />
            </NodeResizeControl>
            {isLeftHandle && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="handle-left"
                    isConnectable={isConnectable}
                />
            )}
            <CardBox>
                <StackNode>
                    <Flex justify={"center"} align={"center"}>
                        <HolderOutlined />
                        <Text>{label}</Text>
                    </Flex>
                    <Flex gap={6} justify={"center"} align={"center"}>
                        <ModalData data={atom} />
                        <CloseOutlined onClick={handleDeleteNode} />
                    </Flex>
                </StackNode>
                {childrenWithProps}
            </CardBox>
            {!OUTPUT_TYPE_NODE.includes(String(type)) && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="handle-right"
                    isConnectable={isConnectable}
                />
            )}
        </BoxNode>
    );
}

export default NodeContainer;

export const INPUT_TYPE_NODE = ["example-data", "file", "http", "paste"];
export const TRANSFORM_TYPE_NODE = ["slice", "filter", "export"];
export const OUTPUT_TYPE_NODE = ["group-chart"];

function ResizeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#ff0071"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", right: 5, bottom: 5 }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="16 20 20 20 20 16" />
            <line x1="14" y1="14" x2="20" y2="20" />
            <polyline points="8 4 4 4 4 8" />
            <line x1="4" y1="4" x2="10" y2="10" />
        </svg>
    );
}
