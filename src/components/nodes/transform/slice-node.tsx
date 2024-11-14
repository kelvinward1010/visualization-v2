import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { atomState } from "@/store/atom";
import { ScissorOutlined } from "@ant-design/icons";
import { getIncomers, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { Card, InputNumber, InputNumberProps, Space, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const { Text } = Typography;

interface SliceNodeProps {
    onCallback: (data: { [key: string]: any }) => void;
    id: string;
}

const SliceNode: React.FC<SliceNodeProps> = ({ onCallback, id }) => {
    const { getNode } = useReactFlow<any>();
    const [fromIndex, setFromIndex] = useState<any>(null);
    const [toIndex, setToIndex] = useState<any>(null);
    const allNodes = useNodes();
    const allEdges = useEdges();
    const nodeParent = getIncomers(getNode(id), allNodes, allEdges)[0];
    const atoms = useRecoilValue(atomState);
    const atomParent = atoms.find((n) => n.id === nodeParent?.id);

    useEffect(() => {
        if (atomParent?.data) {
            let from: number = fromIndex === null ? 0 : fromIndex;
            let to: number =
                toIndex === null ? atomParent.data?.output?.length : toIndex;
            let output = slice(atomParent.data?.output, from, to);
            setFromIndex(from);
            setToIndex(to);
            onCallback({ output, input: { fromIndex: from, toIndex: to } });
        }
        if (!atomParent) {
            setFromIndex(null);
            setToIndex(null);
            onCallback({ output: null, input: null });
        }
    }, [atomParent?.data]);

    const handleFromIndexChange: InputNumberProps["onChange"] = (from) => {
        var output = slice(atomParent.data.output, Number(from), toIndex);
        setFromIndex(from);
        onCallback({ output, input: { toIndex, fromIndex: from } });
    };

    const handleToIndex: InputNumberProps["onChange"] = (to) => {
        var output = slice(atomParent.data.output, fromIndex, Number(to));
        setToIndex(to);
        onCallback({ output, input: { fromIndex, toIndex: to } });
    };

    return (
        <Card>
            {fromIndex === null && toIndex === null ? (
                <Text strong>← kết nối dataset...</Text>
            ) : (
                <>
                    <Space>
                        <Text strong>From Index:</Text>
                        <InputNumber
                            value={fromIndex}
                            onChange={handleFromIndexChange}
                        />
                    </Space>
                    &ensp;
                    <Space>
                        <Text strong>To Index:</Text>
                        <InputNumber value={toIndex} onChange={handleToIndex} />
                    </Space>
                </>
            )}
        </Card>
    );
};

function slice(
    input: string | any[],
    from: number | undefined,
    to: number | undefined,
): any[] {
    if (!Array.isArray(input)) {
        return [];
    }
    return input?.slice(from, to);
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
            onDragStart={(event) => onDragStart(event, "slice")}
            draggable
        >
            <ScissorOutlined /> Tách dữ liệu
        </div>
    );
};

interface SliceNodeWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const SliceNodeWrapper: React.FC<SliceNodeWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer isLeftHandle={true} {...props} label="Tách dữ liệu">
            <SliceNode onCallback={props.onCallback} id={props.id} />
        </NodeContainer>
    );
};

SliceNodeWrapper.Sidebar = Sidebar;
