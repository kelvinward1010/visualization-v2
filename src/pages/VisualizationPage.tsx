import { useCallback, useRef, useState } from "react";
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
} from "@xyflow/react";
import "./VisualizationPage.css";
import { nanoid } from "nanoid";
import { atomState } from "@/store/atom";
import { useSetRecoilState } from "recoil";
import EdgesContainer from "@/components/edgecontainer/EdgeContainer";

const edgeTypes = {
    edgescontainer: EdgesContainer,
};

export function VisualizationPage() {
    const setValueAtom = useSetRecoilState(atomState);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<any | never[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any | never[]>([]);
    const [hidden, setHidden] = useState(false);
    const [reactFlowInstance, setReactFlowInstance] = useState<any | null>(
        null,
    );
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

            const position = reactFlowInstance.project({
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
        },
        [reactFlowInstance, setNodes, setValueAtom],
    );

    return (
        <div className="visualize">
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
                fitView
            >
                <MiniMap />
                <Controls />

                <div
                    style={{
                        position: "absolute",
                        left: 10,
                        top: 10,
                        zIndex: 4,
                    }}
                >
                    <div>
                        <label htmlFor="ishidden">
                            isHidden
                            <input
                                id="ishidden"
                                type="checkbox"
                                checked={hidden}
                                onChange={(event) =>
                                    setHidden(event.target.checked)
                                }
                                className="react-flow__ishidden"
                            />
                        </label>
                    </div>
                </div>
            </ReactFlow>
        </div>
    );
}
