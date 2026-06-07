/**
 * Convert Lingui compiled .js catalogs to .json for static serving.
 * Run after `lingui compile` and before `vite build`.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "../locales");
const publicLocalesDir = join(__dirname, "../public/locales");

mkdirSync(publicLocalesDir, { recursive: true });

const files = readdirSync(localesDir).filter((f) => f.endsWith(".js"));

for (const file of files) {
	const jsPath = join(localesDir, file);
	const jsonPath = join(publicLocalesDir, file.replace(".js", ".json"));

	// Evaluate CommonJS module in a controlled way
	const content = readFileSync(jsPath, "utf-8");
	const moduleObj = { exports: {} };
	const fn = new Function("module", "exports", content);
	fn(moduleObj, moduleObj.exports);
	const messages = moduleObj.exports.messages;

	writeFileSync(jsonPath, JSON.stringify(messages, null, 2));
	console.log(`✅ ${file} → public/locales/${file.replace(".js", ".json")}`);
}

console.log(`\nCompiled ${files.length} locale catalogs to public/locales/`);
