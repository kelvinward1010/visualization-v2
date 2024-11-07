import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { atomState } from "@/store/atom";
import { RetweetOutlined } from "@ant-design/icons";
import { getIncomers, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import {
    Button,
    Card,
    InputNumber,
    InputNumberProps,
    Space,
    Typography,
} from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const { Text } = Typography;

interface FileDataProps {
    onCallback: (data: { [key: string]: any }) => void;
    id: string;
}

const RandomNode: React.FC<FileDataProps> = ({ onCallback, id }) => {
    const { getNode } = useReactFlow<any>();
    const [index, setIndex] = useState<any>(null);
    const allNodes = useNodes();
    const allEdges = useEdges();
    const nodeParent = getIncomers(getNode(id), allNodes, allEdges)[0];
    const atoms = useRecoilValue(atomState);
    const atomParent = atoms.find((n) => n.id === nodeParent?.id);

    useEffect(() => {
        if (atomParent?.data) {
            let indexF: number =
                index === null ? atomParent.data?.output?.length : index;
            let output = atomParent.data?.output;
            setIndex(indexF);
            onCallback({ output, input: { index: indexF } });
        }
        if (!atomParent) {
            setIndex(null);
            onCallback({ output: null, input: null });
        }
    }, [atomParent?.data]);

    const handleIndexChange: InputNumberProps["onChange"] = (idx) => {
        setIndex(idx ?? 1);
    };

    const handleRandom = useCallback(() => {
        let output = randomFunc(atomParent.data.output, Number(index));
        onCallback({ output, input: { index: index } });
    }, [index]);

    return (
        <Card>
            {index === null ? (
                <Text strong>← kết nối dataset...</Text>
            ) : (
                <>
                    <Space>
                        <Text strong>Random quantity:</Text>
                        <InputNumber
                            value={index}
                            onChange={handleIndexChange}
                        />
                    </Space>
                    &ensp;
                    <Space>
                        <Button onClick={handleRandom}>Random</Button>
                    </Space>
                </>
            )}
        </Card>
    );
};

function randomFunc<T>(array: T[], count: number): T[] {
    const result: T[] = [];
    const taken: boolean[] = new Array(array.length).fill(false);

    while (result.length < count) {
        const randomIndex = Math.floor(Math.random() * array.length);
        if (!taken[randomIndex]) {
            taken[randomIndex] = true;
            result.push(array[randomIndex]);
        }
    }

    return result;
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
            onDragStart={(event) => onDragStart(event, "random")}
            draggable
        >
            <RetweetOutlined /> Random dữ liệu
        </div>
    );
};

interface RandomNodeWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const RandomNodeWrapper: React.FC<RandomNodeWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer isLeftHandle={true} {...props} label="Random data">
            <RandomNode onCallback={props.onCallback} id={props.id} />
        </NodeContainer>
    );
};

RandomNodeWrapper.Sidebar = Sidebar;
