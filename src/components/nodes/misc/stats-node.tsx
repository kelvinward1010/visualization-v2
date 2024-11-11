import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { atomState } from "@/store/atom";
import * as _ from "lodash";
import * as d3 from "d3-array";
import { OrderedListOutlined } from "@ant-design/icons";
import { getIncomers, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { Card, Flex, Typography } from "antd";
import React, {
    ChangeEvent,
    FC,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useRecoilValue } from "recoil";

const { Text } = Typography;

interface FileData {
    output?: any;
    input?: any;
}

interface StatsNodeProps {
    onCallback: (data: FileData) => void;
    id: string;
}

interface InputState {
    column: string;
}

interface OutputState {
    min: string | number;
    max: string | number;
    average: string | number;
    median: string | number;
    sum: string | number;
    variance: string | number;
}

const initialState: InputState = {
    column: "",
};

const StatsNode: React.FC<StatsNodeProps> = ({ onCallback, id }) => {
    const { getNode } = useReactFlow<any>();
    const allNodes = useNodes();
    const allEdges = useEdges();
    const [input, setInput] = useState<any>(initialState);
    const [columns, setColumns] = useState<string[]>([]);
    const [output, setOutput] = useState<Partial<OutputState>>({});
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
            const output = statsTransform(atomParent.data.output, initialInput);
            setInput(initialInput);
            setOutput(output);
            onCallback({ output, input: initialInput });
            setColumns(columnsParent);
        }
        if (!atomParent) {
            setInput(initialState);
            setColumns([]);
            setOutput({});
            onCallback({ output: null, input: null });
        }
    }, [atomParent?.data]);

    const handleChangeInput = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            let { value, name } = event.target;
            const updatedInput = { ...input, [name]: value };
            const output = statsTransform(atomParent.data.output, updatedInput);
            setInput(updatedInput);
            setOutput(output);
            onCallback({ output });
        },
        [input, atomParent?.data],
    );

    return (
        <Card>
            <Text strong>Column name:</Text>
            <br />
            <select
                name="column"
                value={input.column}
                onChange={handleChangeInput}
                className="select-custom"
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
            {!_.isEmpty(output) && (
                <Card>
                    <Flex justify={"space-between"}>
                        <Text strong>Min:</Text>
                        <Text>{output?.min}</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text strong>Max:</Text>
                        <Text>{output?.max}</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text strong>Average:</Text>
                        <Text>{output?.average}</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text strong>Median:</Text>
                        <Text>{output?.median}</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text strong>Sum:</Text>
                        <Text>{output?.sum}</Text>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <Text strong>Variance:</Text>
                        <Text>{output?.variance}</Text>
                    </Flex>
                </Card>
            )}
        </Card>
    );
};

function statsTransform(
    input: any[],
    { column }: InputState,
): Partial<OutputState> {
    if (!Array.isArray(input)) {
        return {};
    }
    const data = input?.map((i) => i[column]);

    if (data.length === 0) {
        return {
            min: "NaN",
            max: "NaN",
            average: "NaN",
            median: "NaN",
            sum: "0.00",
            variance: "NaN",
        };
    }

    return {
        min: _.round(d3.min(data) || 0, 2),
        max: _.round(d3.max(data) || 0, 2),
        average: _.round(d3.mean(data) || 0, 2),
        median: _.round(d3.median(data) || 0, 2),
        sum: _.round(d3.sum(data) || 0, 2),
        variance: _.round(d3.variance(data) || 0, 2),
    };
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
            onDragStart={(event) => onDragStart(event, "stats-node")}
            draggable
        >
            <OrderedListOutlined /> Stats data
        </div>
    );
};

interface StatsNodeWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id: string;
    data?: any;
    isConnectable: boolean;
    [key: string]: any;
}

export const StatsNodeWrapper: React.FC<StatsNodeWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer isLeftHandle={true} {...props} label="Stats data">
            <StatsNode id={props.id} onCallback={props.onCallback} />
        </NodeContainer>
    );
};

StatsNodeWrapper.Sidebar = Sidebar;
