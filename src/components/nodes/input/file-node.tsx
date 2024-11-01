import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { VisuallyHidden } from "@/components/visually-hidden";
import { convertCsvToJson } from "@/utils/convert";
import { Button, Card, Typography } from "antd";
import React, { FC, useRef, useState } from "react";
import { read, utils } from "xlsx";

const { Text } = Typography;

interface FileDataProps {
    onCallback: (data: { [key: string]: any }) => void;
}

const FileData: React.FC<FileDataProps> = ({ onCallback }) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInput = useRef<HTMLInputElement | null>(null);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        if (file.name.split(".")[1] === "onnx") {
            onCallback({ result: file });
            setFile(file);
            return;
        }

        reader.addEventListener("loadend", () => {
            if (file.type === "application/json") {
                onCallback({ output: JSON.parse(reader.result as string) });
                return;
            }

            if (file.type === "text/csv") {
                onCallback({
                    output: convertCsvToJson(reader.result as string),
                });
                return;
            }

            const wb = read(reader.result);
            const sheets = wb.SheetNames;
            if (sheets.length > 0) {
                const output = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                onCallback({ output });
            }
        });

        if (file.type === "application/json" || file.type === "text/csv") {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        }

        setFile(file);
    };

    const handleClick = () => {
        fileInput.current?.click();
    };

    return (
        <Card>
            <Button onClick={handleClick}>Open file dialog</Button>
            {file?.name && <Text>Name file: {file.name}</Text>}
            <VisuallyHidden>
                <input
                    ref={fileInput}
                    type="file"
                    onChange={handleChangeInput}
                />
            </VisuallyHidden>
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
            onDragStart={(event) => onDragStart(event, "file")}
            draggable
        >
            Nhập File
        </div>
    );
};

interface FileDataWrapperProps {
    onCallback: (data: { [key: string]: any }) => void;
    id?: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const FileDataWrapper: React.FC<FileDataWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer {...props} label="Nhập File">
            <FileData onCallback={props.onCallback} />
        </NodeContainer>
    );
};

FileDataWrapper.Sidebar = Sidebar;
