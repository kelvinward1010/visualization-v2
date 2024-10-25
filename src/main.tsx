import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routerConfig } from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={routerConfig} />
    </StrictMode>,
);
