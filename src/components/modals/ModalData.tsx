import useDisclosure from "@/hooks/useDisclosure";
import { EyeOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

interface ModalDataProps {
    data?: any;
}

function ModalData({ data }: ModalDataProps) {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
    return (
        <>
            <EyeOutlined onClick={onToggle} />
            <Modal
                title="Preview data"
                centered
                open={isOpen}
                onOk={onOpen}
                onCancel={onClose}
                width={1000}
                footer={false}
            >
                <JsonView src={data?.ouput || data || null} />
            </Modal>
        </>
    );
}

export default ModalData;
