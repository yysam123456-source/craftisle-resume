import "./polyfills/map-upsert";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";
import "./index.css";
import { getAdConfig } from "./lib/config/ads";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

// Local-only mode: disable all oRPC calls to avoid 405 errors
if (typeof window !== "undefined") {
	(window as unknown as Record<string, unknown>).__LOCAL_ONLY__ = true;
}

// Load centralized ad config on app start
getAdConfig().then((config) => {
	const win = window as unknown as { __ADS_ENABLED__?: boolean };
	win.__ADS_ENABLED__ = config.enabled;
	console.log(`[ads] config loaded: enabled=${config.enabled}`);
}).catch((err) => {
	console.warn("[ads] failed to load config:", err);
});

const router = await getRouter();

const root = ReactDOM.createRoot(rootElement);
root.render(<RouterProvider router={router} />);
