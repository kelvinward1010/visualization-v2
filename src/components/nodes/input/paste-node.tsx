import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { convertCsvToJson } from "@/utils/convert";
import { SnippetsOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import React, { ChangeEvent, FC, useState } from "react";

const { Text } = Typography;

interface FileData {
    output?: any;
}

interface PasteNodeProps {
    onCallback: (data: FileData) => void;
}

const PasteNode: React.FC<PasteNodeProps> = ({ onCallback }) => {
    const [dataType, setDataType] = useState<string>("JSON");
    const [error, setError] = useState<boolean>(false);

    const handleChangeDataType = (event: ChangeEvent<HTMLSelectElement>) => {
        setDataType(event.target.value);
    };

    const handleChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setError(false);
        console.log(JSON.parse(value));
        try {
            if (dataType === "JSON") {
                onCallback({ output: JSON.parse(value) });
                return;
            }

            if (dataType === "CSV") {
                onCallback({ output: convertCsvToJson(value) });
                return;
            }
        } catch (error) {
            setError(true);
        }
    };

    return (
        <Card>
            <select
                className="select-custom"
                value={dataType}
                onChange={handleChangeDataType}
            >
                <option value={"JSON"}>JSON</option>
                <option value={"CSV"}>CSV</option>
            </select>
            <textarea
                placeholder="Paste data"
                rows={4}
                style={{ marginTop: "10px" }}
                className="textarea-custom"
                onChange={handleChangeTextarea}
            />
            {error && <Text type={"danger"}>{"Invalid data format"}</Text>}
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
            onDragStart={(event) => onDragStart(event, "paste-node")}
            draggable
        >
            <SnippetsOutlined /> Paste data
        </div>
    );
};

interface PasteNodeWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id?: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const PasteNodeWrapper: React.FC<PasteNodeWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer {...props} label="Paste Data">
            <PasteNode onCallback={props.onCallback} />
        </NodeContainer>
    );
};

PasteNodeWrapper.Sidebar = Sidebar;
