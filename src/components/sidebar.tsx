import React, { useState } from "react";
import {
    BorderOuterOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
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
} from "./nodes";

type MenuItem = Required<MenuProps>["items"][number];

const SideBar: React.FC = () => {
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
            ],
        },
        {
            key: "subs2",
            label: "Tools",
            icon: <ToolFilled />,
        },
        {
            key: "subs3",
            label: "Settings",
            icon: <SettingFilled />,
        },
    ];

    return (
        <aside style={{ width: "auto" }}>
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
