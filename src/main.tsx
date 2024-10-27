import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@xyflow/react/dist/style.css";
import "./assets/css/main.css";
import { RouterProvider } from "react-router-dom";
import { routerConfig } from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={routerConfig} />
    </StrictMode>,
);

// Reload the page when the i18n file changes
if (import.meta.hot) {
    import.meta.hot.accept(["./locale/i18n"], () => {});
}
