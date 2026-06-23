import "./polyfills/map-upsert";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";
import "./index.css";
import { AdLoader } from "./components/common/AdLoader";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

// Local-only mode: disable all oRPC calls to avoid 405 errors
if (typeof window !== "undefined") {
	(window as unknown as Record<string, unknown>).__LOCAL_ONLY__ = true;
}

const router = await getRouter();

const root = ReactDOM.createRoot(rootElement);
root.render(
	<>
		<AdLoader />
		<RouterProvider router={router} />
	</>
);
