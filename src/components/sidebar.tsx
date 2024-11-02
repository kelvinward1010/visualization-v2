import React, { useState } from "react";
import {
    ContainerOutlined,
    DesktopOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { FileDataWrapper } from "./nodes";

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
        console.log("ok");
    };

    const items: MenuItem[] = [
        {
            key: "1",
            icon: <PieChartOutlined />,
            label: <FileDataWrapper.Sidebar onDragStart={onDragStart} />,
        },
        { key: "2", icon: <DesktopOutlined />, label: "Option 2" },
        { key: "3", icon: <ContainerOutlined />, label: "Option 3" },
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
