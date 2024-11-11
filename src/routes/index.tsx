import { VisualizationPage } from "@/pages/VisualizationPage";
import { settingsUrl, visualizationUrl } from "./urls";
import { createBrowserRouter } from "react-router-dom";
import { SettingsPage } from "@/pages/SettingsPage";

export const routerConfig = createBrowserRouter([
    {
        path: visualizationUrl,
        element: <VisualizationPage />,
    },
    {
        path: settingsUrl,
        element: <SettingsPage />,
    },
]);
