import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@xyflow/react/dist/style.css";
import "./assets/css/main.css";
import { RouterProvider } from "react-router-dom";
import { routerConfig } from "./routes/index.tsx";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RecoilRoot>
            <RouterProvider router={routerConfig} />
        </RecoilRoot>
    </StrictMode>,
);

// Reload the page when the i18n file changes
if (import.meta.hot) {
    import.meta.hot.accept(["./locale/i18n"], () => {});
}
