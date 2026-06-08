/**
 * Convert Lingui compiled .mjs/.js catalogs to .json for static serving.
 * Run after `lingui compile` and before `vite build`.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "../locales");
const publicLocalesDir = join(__dirname, "../public/locales");

mkdirSync(publicLocalesDir, { recursive: true });

// Prefer .mjs (ES module, output by lingui compile with compileNamespace: "es"),
// fallback to .js (CommonJS) for backwards compatibility.
const mjsFiles = readdirSync(localesDir).filter((f) => f.endsWith(".mjs"));
const jsFiles = readdirSync(localesDir).filter((f) => f.endsWith(".js"));
const files = mjsFiles.length > 0 ? mjsFiles : jsFiles;
const ext = mjsFiles.length > 0 ? ".mjs" : ".js";

for (const file of files) {
	const catalogPath = join(localesDir, file);
	const jsonPath = join(publicLocalesDir, file.replace(ext, ".json"));
	let messages;

	if (file.endsWith(".mjs")) {
		// Dynamic import for ES module
		const mod = await import(catalogPath);
		messages = mod.messages;
	} else {
		// Evaluate CommonJS module in a controlled way
		const content = readFileSync(catalogPath, "utf-8");
		const moduleObj = { exports: {} };
		const fn = new Function("module", "exports", content);
		fn(moduleObj, moduleObj.exports);
		messages = moduleObj.exports.messages;
	}

	writeFileSync(jsonPath, JSON.stringify(messages, null, 2));
	console.log(`✅ ${file} → public/locales/${file.replace(ext, ".json")}`);
}

console.log(`\nCompiled ${files.length} locale catalogs to public/locales/`);
