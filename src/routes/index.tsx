import { VisualizationPage } from "@/pages/VisualizationPage";
import { visualizationUrl } from "./urls";
import { createBrowserRouter } from "react-router-dom";

export const routerConfig = createBrowserRouter([
    {
        path: visualizationUrl,
        element: <VisualizationPage />,
    },
]);
