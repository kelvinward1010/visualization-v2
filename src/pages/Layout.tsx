import SideBar from "@/components/sidebar";

interface LayoutProps {
    children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div className="visualize">
            <div className="dndflow">
                <SideBar />
                {children}
            </div>
        </div>
    );
}

export default Layout;
