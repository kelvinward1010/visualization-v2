import { CSSProperties, ReactNode } from "react";
import styled from "styled-components";

type BoxNodeProps = {
    selected?: boolean;
    theme: "light" | "dark";
    style?: CSSProperties;
};

interface CardBoxProps {
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    border?: string;
}

export const CardBox = styled.div<CardBoxProps>`
    width: 100%;
    height: 100%;
    padding: 0px 10px;
    background-color: ${(props) => props.backgroundColor || "white"};
    color: ${(props) => props.color || "black"};
`;

export const BoxNode = styled.div<BoxNodeProps>`
    .react-flow__handle {
        z-index: 2;
        border-radius: unset;
        border: none;
        background-color: ${(props) => (props.selected ? "teal" : "gray")};
    }
    .node-container{
        width: 100%;
        height: 100%;
        background-color: ${(props) => (props.theme === "dark" ? "black" : "white")}
        color: ${(props) => (props.theme === "dark" ? "white" : "black")}
    }
`;

interface StackNodeProps {
    children: ReactNode;
}

export function StackNode({ children }: StackNodeProps) {
    return (
        <div
            style={{
                padding: "4px",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
            }}
            className="custom-drag-handle"
        >
            {children}
        </div>
    );
}
