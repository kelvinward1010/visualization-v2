import NodeContainer from "@/components/nodecontainer/NodeContainer";
import { convertCsvToJson } from "@/utils/convert";
import { LinkOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Typography } from "antd";
import axios from "axios";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";

const { Text } = Typography;

interface FileData {
    output?: any;
}

interface HttpRequestProps {
    onCallback: (data: FileData) => void;
}

const HttpRequest: React.FC<HttpRequestProps> = ({ onCallback }) => {
    const [url, setUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const res = await axios.get(url, { responseType: "blob" });
            if (!res.data) {
                setLoading(false);
                return;
            }

            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
                if (res.data.type === "application/json") {
                    onCallback({ output: JSON.parse(reader.result as string) });
                }
                if (res.data.type === "text/csv") {
                    console.log(JSON.parse(reader.result as string));
                    onCallback({
                        output: convertCsvToJson(reader.result as string),
                    });
                }
            });
            reader.readAsText(res.data);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeUrl = (event: ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
        if (error) setError(false);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <Flex gap={5} vertical={true} justify={"flex-start"}>
                    <Text strong>URL:</Text>
                    <Input
                        width={"90%"}
                        type="text"
                        value={url}
                        onChange={handleChangeUrl}
                        placeholder="Type URL"
                    />
                    {loading && <Text type={"warning"}>Loading...</Text>}
                    {error && (
                        <Text type="danger">Please check your url again</Text>
                    )}
                    <Button style={{ marginTop: 10 }} htmlType="submit">
                        Load data
                    </Button>
                </Flex>
            </form>
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
            onDragStart={(event) => onDragStart(event, "http")}
            draggable
        >
            <LinkOutlined /> HTTP Request
        </div>
    );
};

interface HttpRequestWrapperProps {
    onCallback: (data: { [key: string]: any }) => any;
    id?: string;
    data?: any;
    isConnectable?: boolean;
    [key: string]: any;
}

export const HttpRequestWrapper: React.FC<HttpRequestWrapperProps> & {
    Sidebar: FC<SidebarProps>;
} = (props) => {
    return (
        <NodeContainer {...props} label="Http Request">
            <HttpRequest onCallback={props.onCallback} />
        </NodeContainer>
    );
};

HttpRequestWrapper.Sidebar = Sidebar;
