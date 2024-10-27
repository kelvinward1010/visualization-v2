import { CSSProperties, ReactNode } from "react";

type BoxNodeProps = {
    selected?: boolean;
    theme: "light" | "dark";
    className?: string;
    children: ReactNode;
    style?: CSSProperties;
};

export const BoxNode: React.FC<BoxNodeProps> = ({
    selected,
    theme,
    className,
    children,
    style,
    ...params
}) => {
    return (
        <div
            style={style}
            {...params}
            className={`${theme === "dark" && selected ? "dark-theme" : ""} ${className}`}
        >
            {children}
        </div>
    );
};

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
            }}
            className="custom-drag-handle"
        >
            {children}
        </div>
    );
}
