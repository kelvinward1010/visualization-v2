import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { atomState } from "@/store/atom";
import { BarChartOutlined } from "@ant-design/icons";
import { getIncomers, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { Card, Flex, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { moveColumnsOfData } from "@/utils/data-transfer";
import { Bar } from "@ant-design/plots";

const { Text } = Typography;

interface BarBasicChartProps {
    onCallback: (data: { [key: string]: any }) => void;
    id: string;
}

interface Event {
    target: { value: any; name: string };
}

const initialState = {
    xColumn: "",
    yColumn: "",
};

const BarBasicChartNode: React.FC<BarBasicChartProps> = ({
    onCallback,
    id,
}) => {
    const { getNode } = useReactFlow<any>();
    const allNodes = useNodes();
    const allEdges = useEdges();
    const [input, setInput] = useState<{ xColumn: string; yColumn: string }>(
        initialState,
    );
    const [columns, setColumns] = useState<string[]>([]);
    const [output, setOutput] = useState<any[]>([]);
    const nodeParent = getIncomers(getNode(id), allNodes, allEdges)[0];
    const atoms = useRecoilValue(atomState);
    const atomParent = atoms.find((n) => n.id === nodeParent?.id);

    useEffect(() => {
        if (atomParent?.data) {
            let columnsParent = Object.keys(atomParent.data?.output?.[0] ?? {});

            let initialInput = {
                xColumn: columnsParent.includes(input.xColumn)
                    ? input.xColumn
                    : columnsParent[0],
                yColumn: columnsParent.includes(input.yColumn)
                    ? input.yColumn
                    : columnsParent[0],
            };
            let output = moveColumnsOfData(
                atomParent.data.output,
                initialInput,
            );
            setInput(initialInput);
            setOutput(output);
            onCallback({ output: atomParent.data.output, input: initialInput });
            setColumns(columnsParent);
        }
        if (!atomParent) {
            setOutput([]);
            setColumns([]);
            onCallback({ output: null, input: null });
        }
    }, [atomParent?.data]);

    function handleChangeInput(event: Event) {
        let { value, name } = event.target;
        const updatedInput = { ...input, [name]: value };
        var output = moveColumnsOfData(atomParent.data.output, updatedInput);
        setInput(updatedInput);
        setOutput(output);
        onCallback({ output: atomParent.data.output, input: updatedInput });
    }

    const data = output;

    const config = {
        data: data,
        xField: "xColumn",
        yField: "yColumn",
        sort: {
            reverse: true,
        },
        label: {
            text: "yColumn",
            formatter: ".1%",
            style: {
                textAlign: "right",
                fill: "teal",
                dx: 32,
            },
        },
        axis: {
            y: {
                labelFormatter: ".0%",
            },
        },
    };

    return (
        <Card>
            {columns.length <= 0 ? (
                <Text>← kết nối dataset...</Text>
            ) : (
                <>
                    <Flex justify={"flex-start"} gap={10}>
                        <Text>X-axis</Text>
                        <select
                            name="xColumn"
                            value={input.xColumn}
                            onChange={handleChangeInput}
                            className="select-custom"
                        >
                            {columns?.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </Flex>
                    <br />
                    <Flex justify={"flex-start"} gap={10}>
                        <Text>Y-axis</Text>
                        <select
                            name="yColumn"
                            value={input.yColumn}
                            onChange={handleChangeInput}
                            className="select-custom"
                        >
                            {columns?.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </Flex>
                    <br />
                    <Bar {...config} />
                </>
            )}
        </Card>
    );
};

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
            onDragStart={(event) => onDragStart(event, "bar-basic-chart")}
            draggable
        >
            <BarChartOutlined /> Bar basic
        </div>
    );
};

interface BarBasicChartNodeWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const BarBasicChartWrapper: React.FC<BarBasicChartNodeWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer isLeftHandle={true} {...props} label="Bar basic">
            <BarBasicChartNode onCallback={props.onCallback} id={props.id} />
        </NodeContainer>
    );
};

BarBasicChartWrapper.Sidebar = Sidebar;
