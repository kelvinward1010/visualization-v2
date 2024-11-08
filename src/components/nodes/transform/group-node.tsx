import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { atomState } from "@/store/atom";
import { SwapOutlined } from "@ant-design/icons";
import { getIncomers, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { Card, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { groups as d3Group } from "d3-array";

const { Text } = Typography;

interface FileDataProps {
    onCallback: (data: { [key: string]: any }) => void;
    id: string;
}

interface Event {
    target: { value: any; name: string };
}

const initialState = {
    column: "",
};

const GroupNode: React.FC<FileDataProps> = ({ onCallback, id }) => {
    const { getNode } = useReactFlow<any>();
    const allNodes = useNodes();
    const allEdges = useEdges();
    const [input, setInput] = useState<{ column: string }>(initialState);
    const [columns, setColumns] = useState<string[]>([]);
    const nodeParent = getIncomers(getNode(id), allNodes, allEdges)[0];
    const atoms = useRecoilValue(atomState);
    const atomParent = atoms.find((n) => n.id === nodeParent?.id);

    useEffect(() => {
        if (atomParent?.data) {
            let columnsParent = Object.keys(atomParent.data?.output?.[0] ?? {});

            let initialInput = {
                column:
                    input.column === initialState.column
                        ? columnsParent[0]
                        : input.column,
            };
            let output = group(atomParent.data.output, initialInput.column);
            setInput(initialInput);
            onCallback({ output, input: initialInput });
            setColumns(columnsParent);
        }
        if (!atomParent) {
            setInput(initialState);
            setColumns([]);
            onCallback({ output: null, input: null });
        }
    }, [atomParent?.data, input]);

    function handleChangeInput(event: Event) {
        let { value, name } = event.target;
        const updatedInput = { ...input, [name]: value };
        var output = group(atomParent.data.output, updatedInput.column);
        setInput(updatedInput);
        onCallback({ output, input: updatedInput });
    }

    return (
        <Card>
            <Text strong>Column name:</Text>
            <br />
            <select
                name="column"
                value={input.column}
                onChange={handleChangeInput}
                style={{
                    width: "100%",
                    border: "1px solid teal",
                    padding: "3px 5px",
                    borderRadius: "5px",
                }}
            >
                {columns.length > 0 ? (
                    columns?.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))
                ) : (
                    <option>← kết nối dataset...</option>
                )}
            </select>
        </Card>
    );
};

function group<T>(input: T[], column: keyof T) {
    return d3Group(input, (d) => d[column]);
}

interface SidebarProps {
    onDragStart: (
        event: React.DragEvent<HTMLDivElement>,
        nodeType: string,
    ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
    return (
        <div
            className="dndnode"
            onDragStart={(event) => onDragStart(event, "group-data")}
            draggable
        >
            <SwapOutlined /> Nhóm data
        </div>
    );
};

interface GroupNodeWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const GroupNodeWrapper: React.FC<GroupNodeWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer isLeftHandle={true} {...props} label="Nhóm data">
            <GroupNode onCallback={props.onCallback} id={props.id} />
        </NodeContainer>
    );
};

GroupNodeWrapper.Sidebar = Sidebar;
