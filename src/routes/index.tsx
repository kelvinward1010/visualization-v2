import { VisualizationPage } from "@/pages/VisualizationPage";
import { flatformaichatboxUrl, settingsUrl, visualizationUrl } from "./urls";
import { createBrowserRouter } from "react-router-dom";
import { SettingsPage } from "@/pages/SettingsPage";
import { FlatformAIChatboxPage } from "@/pages/FlatformAIChatboxPage";

export const routerConfig = createBrowserRouter([
    {
        path: visualizationUrl,
        element: <VisualizationPage />,
    },
    {
        path: flatformaichatboxUrl,
        element: <FlatformAIChatboxPage />,
    },
    {
        path: settingsUrl,
        element: <SettingsPage />,
    },
]);
