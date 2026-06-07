import type { ProxyOptions } from "vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lingui, linguiTransformerBabelPreset } from "@lingui/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootPackageJsonPath = new URL("../../package.json", import.meta.url);
const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, "utf-8")) as { version: string | undefined };
const appVersion = JSON.stringify(rootPackageJson.version ?? "0.0.0");
const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));

// Load AGNES_API_KEY from .env.local for use in dev proxy
function loadEnvLocal(dir: string): Record<string, string> {
	try {
		const content = readFileSync(`${dir}/.env.local`, "utf-8");
		const result: Record<string, string> = {};
		for (const line of content.split("\n")) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const eqIndex = trimmed.indexOf("=");
			if (eqIndex === -1) continue;
			const key = trimmed.slice(0, eqIndex).trim();
			const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
			result[key] = val;
		}
		return result;
	} catch {
		return {};
	}
}
const localEnv = loadEnvLocal(workspaceRoot);

const serverPaths = ["/mcp", "/uploads", "/.well-known", "/schema.json"] as const;

const serverProxy = serverPaths.reduce(
	(acc, path) => {
		acc[path] = {
			target: `http://localhost:${process.env.SERVER_PORT ?? "3001"}`,
			changeOrigin: true,
		};
		return acc;
	},
	{} as Record<string, ProxyOptions>,
);

// Agnes AI proxy for local dev: /api/ai/chat → https://apihub.agnes-ai.com/v1/chat/completions
serverProxy["/api/ai"] = {
	target: "https://apihub.agnes-ai.com",
	changeOrigin: true,
	rewrite: (path) => path.replace(/^\/api\/ai\/chat$/, "/v1/chat/completions"),
	configure: (proxy) => {
		proxy.on("proxyReq", (proxyReq) => {
			proxyReq.setHeader(
				"Authorization",
				`Bearer ${localEnv.AGNES_API_KEY ?? process.env.AGNES_API_KEY ?? ""}`,
			);
		});
	},
};

// Other API paths still go to backend server
serverProxy["/api"] = {
	target: `http://localhost:${process.env.SERVER_PORT ?? "3001"}`,
	changeOrigin: true,
};

export default defineConfig({
	envDir: workspaceRoot,

	resolve: {
		tsconfigPaths: true,
		alias: {
			// Redirect pdfjs-dist legacy imports to vendored files (no postinstall needed in CI)
			"pdfjs-dist/legacy": fileURLToPath(new URL("./src/vendor/pdfjs-legacy", import.meta.url)),
		},
	},

	define: {
		__APP_VERSION__: appVersion,
	},

	build: {
		chunkSizeWarningLimit: 10 * 1024, // 10 MB
		rolldownOptions: {
			external: ["bcrypt", "sharp", "canvas", "@aws-sdk/client-s3", "ioredis", "linkedom"],
		},
	},

	server: {
		host: true,
		strictPort: true,
		port: Number.parseInt(process.env.PORT ?? "3000", 10),
		proxy: serverProxy,
	},

	plugins: [
		tailwindcss(),
		tanstackRouter({
			target: "react",
			semicolons: true,
			quoteStyle: "double",
			autoCodeSplitting: true,
		}),
		viteReact(),
		lingui(),
		babel({ presets: [reactCompilerPreset(), linguiTransformerBabelPreset()] }),
	],
});
