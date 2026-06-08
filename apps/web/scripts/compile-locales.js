/**
 * Generate locale JSON files from lingui compiled .mjs files.
 * Requires `lingui compile` to have been run first (generates .mjs in locales/).\n * Run before `vite build`.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "../locales");
const publicLocalesDir = join(__dirname, "../public/locales");

mkdirSync(publicLocalesDir, { recursive: true });

const mjsFiles = readdirSync(localesDir).filter((f) => f.endsWith(".mjs"));

if (mjsFiles.length === 0) {
	console.error("❌ No .mjs files found in", localesDir);
	console.error("   Run `pnpm lingui compile` first.");
	process.exit(1);
}

console.log(`Found ${mjsFiles.length} .mjs files`);

for (const file of mjsFiles) {
	const locale = file.replace(".mjs", "");
	const mjsPath = join(localesDir, file);
	const jsonPath = join(publicLocalesDir, `${locale}.json`);

	const module = await import(mjsPath);
	const messages = module.messages;

	if (!messages) {
		console.error(`❌ ${file}: no 'messages' export found`);
		process.exit(1);
	}

	writeFileSync(jsonPath, JSON.stringify(messages, null, 2));

	console.log(`✅ ${file} → public/locales/${locale}.json (${Object.keys(messages).length} messages)`);
}

console.log(`\nCompiled ${mjsFiles.length} locale catalogs to public/locales/`);
