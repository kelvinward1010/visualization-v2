import { Handle, Position } from "@xyflow/react";

interface HandleLeftProps {
    isConnectable: boolean;
}

export function HandleLeft({ isConnectable, ...params }: HandleLeftProps) {
    return (
        <Handle
            type="target"
            position={Position.Left}
            className="handle-left-custom"
            isConnectable={isConnectable}
            {...params}
        />
    );
}
