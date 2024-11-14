import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { atomState } from "@/store/atom";
import { CSVLink } from "react-csv";
import { DownloadOutlined } from "@ant-design/icons";
import { getIncomers, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { Button, Flex, Card } from "antd";
import { useDebounce } from "react-use";
import React, { FC, useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

interface FileData {
    output?: any;
    input?: any;
}

interface ExportProps {
    onCallback: (data: FileData) => void;
    id: string;
}

const initialState: {
    column: string;
    conditionId: string;
    conditionValue: any;
} = {
    column: "",
    conditionId: "",
    conditionValue: undefined,
};

const Export: React.FC<ExportProps> = ({ onCallback, id }) => {
    const { getNode } = useReactFlow<any>();
    const allNodes = useNodes();
    const allEdges = useEdges();
    const [input, setInput] = useState<any>(initialState);
    const nodeParent = getIncomers(getNode(id), allNodes, allEdges)[0];
    const atoms = useRecoilValue(atomState);
    const atomParent = atoms.find((n) => n.id === nodeParent?.id);

    useDebounce(
        () => {
            if (input.column?.length && input.conditionId) {
                var output = filter(atomParent.data.output, input);
                onCallback({ output, input });
            }
        },
        800,
        [input],
    );

    useEffect(() => {
        if (atomParent?.data) {
            var columnsParent = Object.keys(atomParent.data?.output?.[0] ?? {});
            var initialInput = {
                column:
                    input.column === initialState.column
                        ? columnsParent[0]
                        : input.column,
                conditionId:
                    input.conditionId === initialState.conditionId
                        ? ""
                        : input.conditionId,
                conditionValue:
                    input.conditionValue === initialState.conditionValue
                        ? ""
                        : input.conditionValue,
            };
            var output = filter(atomParent.data.output, initialInput);
            setInput(initialInput);
            onCallback({ output, input: initialInput });
        }

        if (!atomParent) {
            setInput(initialState);
            onCallback({ output: null, input: null });
        }
    }, [atomParent?.data]);

    function randomString(len: number, charSet: string) {
        charSet =
            charSet ||
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var randomString = "";
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    const fileNameCsv = `your-file-${randomString(
        10,
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    )}.csv`;

    const handleExportDataToJson = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(atomParent?.data))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `data_${randomString(10, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")}.json`;
        link.click();
    };
    const dataDown = [];
    dataDown.push(atomParent?.data);
    const DataCsv = dataDown[0]?.output;

    return (
        <Card>
            <Flex gap={10}>
                <CSVLink filename={fileNameCsv} data={DataCsv || []}>
                    <Button>Download csv</Button>
                </CSVLink>
                <Button onClick={handleExportDataToJson}>Download json</Button>
            </Flex>
        </Card>
    );
};

interface SidebarProps {
    onDragStart: (
        event: React.DragEvent<HTMLDivElement>,
        nodeType: string,
    ) => void;
}

type ConditionFunction = (value: string) => boolean;

interface FilterParams {
    column: string;
    conditionId: string;
    conditionValue: any;
}

function filter(
    input: any[],
    { column, conditionId, conditionValue }: FilterParams,
): any[] {
    if (!Array.isArray(input)) {
        return [];
    }

    let condition: ConditionFunction;

    switch (conditionId) {
        case "5":
            condition = (value) => value === conditionValue;
            break;
        case "6":
            condition = (value) => value !== conditionValue;
            break;
        case "7":
            condition = (value) => value.includes(conditionValue);
            break;
        case "8":
            condition = (value) => !value.includes(conditionValue);
            break;
        case "notnull":
            condition = (value) => value !== null && value !== "";
            break;
        case "regex":
            condition = (value) => new RegExp(conditionValue).test(value);
            break;
        default:
            condition = () => true;
            break;
    }

    return input.filter((i) => condition(String(i[column])));
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
    return (
        <div
            className="dndnode"
            onDragStart={(event) => onDragStart(event, "export")}
            draggable
        >
            <DownloadOutlined /> Export file
        </div>
    );
};

interface ExportWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const ExportWrapper: React.FC<ExportWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer isLeftHandle={true} {...props} label="Export File">
            <Export onCallback={props.onCallback} id={props.id} />
        </NodeContainer>
    );
};

ExportWrapper.Sidebar = Sidebar;
