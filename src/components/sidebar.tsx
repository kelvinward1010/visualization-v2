import React, { useState } from "react";
import {
    BorderOuterOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    OpenAIOutlined,
    SettingFilled,
    ToolFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import {
    FileDataWrapper,
    HttpRequestWrapper,
    ExportWrapper,
    ExampleDataWrapper,
    SliceNodeWrapper,
    RandomNodeWrapper,
    GroupNodeWrapper,
    PasteNodeWrapper,
    StatsNodeWrapper,
    ColumnBasicChartNodeWrapper,
    LineBasicChartWrapper,
    MutipleLineChartWrapper,
    AreaBasicChartWrapper,
    BarBasicChartWrapper,
    PieBasicChartWrapper,
} from "./nodes";
import { useNavigate } from "react-router-dom";
import {
    flatformaichatboxUrl,
    settingsUrl,
    visualizationUrl,
} from "@/routes/urls";

type MenuItem = Required<MenuProps>["items"][number];

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const onDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        nodeType: string,
    ) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const items: MenuItem[] = [
        {
            key: "subs1",
            label: "Nodes",
            icon: <BorderOuterOutlined />,
            children: [
                {
                    key: "subs1-input",
                    label: "Input",
                    children: [
                        {
                            key: "input-1",
                            label: (
                                <FileDataWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                        {
                            key: "input-2",
                            label: (
                                <HttpRequestWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                        {
                            key: "input-3",
                            label: (
                                <ExampleDataWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                        {
                            key: "input-4",
                            label: (
                                <PasteNodeWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                    ],
                },
                {
                    key: "subs1-misc",
                    label: "Misc",
                    children: [
                        {
                            key: "misc-1",
                            label: (
                                <ExportWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                        {
                            key: "misc-2",
                            label: (
                                <StatsNodeWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                    ],
                },
                {
                    key: "subs1-transform",
                    label: "Transform",
                    children: [
                        {
                            key: "transform-1",
                            label: (
                                <SliceNodeWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                        {
                            key: "transform-2",
                            label: (
                                <RandomNodeWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                        {
                            key: "transform-3",
                            label: (
                                <GroupNodeWrapper.Sidebar
                                    onDragStart={onDragStart}
                                />
                            ),
                        },
                    ],
                },
                {
                    key: "subs1-visualize",
                    label: "Visualize",
                    children: [
                        {
                            key: "visualize-1",
                            label: "Columns",
                            children: [
                                {
                                    key: "visualize-1-1",
                                    label: (
                                        <ColumnBasicChartNodeWrapper.Sidebar
                                            onDragStart={onDragStart}
                                        />
                                    ),
                                },
                            ],
                        },
                        {
                            key: "visualize-2",
                            label: "Area",
                            children: [
                                {
                                    key: "visualize-2-1",
                                    label: (
                                        <AreaBasicChartWrapper.Sidebar
                                            onDragStart={onDragStart}
                                        />
                                    ),
                                },
                            ],
                        },
                        {
                            key: "visualize-3",
                            label: "Line",
                            children: [
                                {
                                    key: "visualize-3-1",
                                    label: (
                                        <LineBasicChartWrapper.Sidebar
                                            onDragStart={onDragStart}
                                        />
                                    ),
                                },
                                {
                                    key: "visualize-3-2",
                                    label: (
                                        <MutipleLineChartWrapper.Sidebar
                                            onDragStart={onDragStart}
                                        />
                                    ),
                                },
                            ],
                        },
                        {
                            key: "visualize-4",
                            label: "Bar",
                            children: [
                                {
                                    key: "visualize-4-1",
                                    label: (
                                        <BarBasicChartWrapper.Sidebar
                                            onDragStart={onDragStart}
                                        />
                                    ),
                                },
                            ],
                        },
                        {
                            key: "visualize-5",
                            label: "Pie",
                            children: [
                                {
                                    key: "visualize-5-1",
                                    label: (
                                        <PieBasicChartWrapper.Sidebar
                                            onDragStart={onDragStart}
                                        />
                                    ),
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            key: "subs2",
            label: "Tools",
            icon: <ToolFilled />,
        },
        {
            key: "subs3",
            label: "Flatform AI chatbox",
            onClick: () => navigate(flatformaichatboxUrl),
            icon: <OpenAIOutlined />,
        },
        {
            key: "subs4",
            label: "Settings",
            onClick: () => navigate(settingsUrl),
            icon: <SettingFilled />,
        },
    ];

    return (
        <aside style={{ width: "auto" }}>
            {collapsed ? null : (
                <img
                    onClick={() => navigate(visualizationUrl)}
                    className="logo"
                    src={"/logo2.png"}
                    alt=""
                />
            )}
            <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{ marginBottom: 16 }}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
            />
        </aside>
    );
};

export default SideBar;
