import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    MarkerType,
    Position,
    reconnectEdge,
    Connection,
    Edge,
    Node,
    OnNodesChange,
    OnEdgesChange,
    Background,
    NodeTypes,
} from "@xyflow/react";
import "./VisualizationPage.css";
import { nanoid } from "nanoid";
import { atomState } from "@/store/atom";
import { useSetRecoilState } from "recoil";
import EdgesContainer from "@/components/edgecontainer/EdgeContainer";
import SideBar from "@/components/sidebar";
import {
    FileDataWrapper,
    HttpRequestWrapper,
    ExportWrapper,
} from "@/components/nodes";

const nodeTypes: NodeTypes = {
    file: FileDataWrapper as any,
    http: HttpRequestWrapper as any,
    export: ExportWrapper as any,
};

const edgeTypes = {
    edgescontainer: EdgesContainer,
};

type NodeType = Node;
type EdgeType = Edge;

export function VisualizationPage() {
    const setValueAtom = useSetRecoilState(atomState);
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const [nodes, setNodes, onNodesChange]: [
        NodeType[],
        Dispatch<SetStateAction<NodeType[]>>,
        OnNodesChange<NodeType>,
    ] = useNodesState<NodeType>([]);
    const [edges, setEdges, onEdgesChange]: [
        EdgeType[],
        Dispatch<SetStateAction<any[]>>,
        OnEdgesChange<EdgeType>,
    ] = useEdgesState<EdgeType>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    //const selectedNodes = Array.from(nodes).filter((n: Node) => n.selected);

    const onConnect = useCallback(
        (connection: Connection) => {
            const edgeBase = {
                ...connection,
                type: "edgescontainer",
                animated: true,
                label: "Connected",
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 15,
                    height: 15,
                    color: "red",
                },
            };

            setEdges((eds) => addEdge({ ...connection, edgeBase }, eds));
        },
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onEdgeUpdate = useCallback(
        (oldEdge: Edge, newConnection: Connection) =>
            setEdges((els: Edge[]) =>
                reconnectEdge(oldEdge, newConnection, els),
            ),
        [setEdges],
    );

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (!reactFlowWrapper.current || !reactFlowInstance) return;

            const reactFlowBounds =
                reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");

            // check if the dropped element is valid
            if (!type) return;

            if (reactFlowBounds) {
                // Check if instance exists before using project
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });
                const newNode: Node = {
                    id: nanoid(),
                    type,
                    position,
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    dragHandle: ".custom-drag-handle",
                    data: {},
                };

                setNodes((nds: Node[]) => nds.concat(newNode));
                setValueAtom((oldAtom) =>
                    oldAtom.concat({ id: newNode.id, type, data: {} }),
                );
            }
        },
        [reactFlowInstance, setNodes, setValueAtom],
    );

    return (
        <div className="visualize">
            <div className="dndflow">
                <SideBar />
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onInit={setReactFlowInstance}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onReconnect={onEdgeUpdate}
                        edgeTypes={edgeTypes}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <MiniMap />
                        <Controls />
                        <Background bgColor="black" />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}
