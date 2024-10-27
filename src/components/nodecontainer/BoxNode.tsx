import { CSSProperties, ReactNode } from "react";

type BoxNodeProps = {
    selected?: boolean;
    theme: "light" | "dark";
    className?: string;
    children: ReactNode;
    style?: CSSProperties;
};

const BoxNode: React.FC<BoxNodeProps> = ({
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

export default BoxNode;
