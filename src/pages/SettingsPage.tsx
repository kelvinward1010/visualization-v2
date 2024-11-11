import { Flex } from "antd";
import Layout from "./Layout";
import "./SettingsPage.css";
import useThemeMode from "@/hooks/useThemeMode";
import { IconMoonFilled, IconSun } from "@tabler/icons-react";

export function SettingsPage() {
    const { isDarkMode, toggleTheme } = useThemeMode();

    return (
        <Layout>
            <div className={`settings ${isDarkMode ? "dark" : "light"}`}>
                <Flex justify={"flex-start"} gap={20} align={"center"}>
                    <h5>Theme:</h5>
                    <button className="button-setting" onClick={toggleTheme}>
                        {isDarkMode ? <IconMoonFilled /> : <IconSun />}
                    </button>
                </Flex>
            </div>
        </Layout>
    );
}
