import "./polyfills/map-upsert";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";
import "./index.css";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

// Local-only mode: disable all oRPC calls to avoid 405 errors
if (typeof window !== "undefined") {
  (window as any).__LOCAL_ONLY__ = true;
}

const router = await getRouter();

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(<RouterProvider router={router} />);
}
