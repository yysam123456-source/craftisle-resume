/**
 * Generate locale JSON files directly from .po files.
 * No dependency on `lingui compile`.
 * Run before `vite build`.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "../locales");
const publicLocalesDir = join(__dirname, "../public/locales");

mkdirSync(publicLocalesDir, { recursive: true });

// Parse a .po file into { msgid: [msgstr] } mapping
function parsePoFile(filePath) {
	const content = readFileSync(filePath, "utf-8");
	const messages = {};
	const lines = content.split("\n");

	let currentMsgid = null;
	let currentMsgstr = null;
	let collectingId = false;
	let collectingStr = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (trimmed.startsWith("msgid ")) {
			// Save previous entry
			if (currentMsgid !== null && currentMsgstr !== null && currentMsgid !== "") {
				messages[currentMsgid] = [currentMsgstr];
			}
			collectingId = true;
			collectingStr = false;
			currentMsgid = trimmed.slice(7, -1); // Remove `msgid "` and trailing `"`
		} else if (trimmed.startsWith("msgstr ")) {
			collectingId = false;
			collectingStr = true;
			currentMsgstr = trimmed.slice(8, -1); // Remove `msgstr "` and trailing `"`
		} else if (trimmed.startsWith('"') && collectingId) {
			// Continuation of msgid
			currentMsgid += trimmed.slice(1, -1);
		} else if (trimmed.startsWith('"') && collectingStr) {
			// Continuation of msgstr
			currentMsgstr += trimmed.slice(1, -1);
		} else if (trimmed === "" || trimmed.startsWith("#")) {
			// Blank line or comment: save entry if complete
			if (currentMsgid !== null && currentMsgstr !== null && currentMsgid !== "") {
				messages[currentMsgid] = [currentMsgstr];
			}
			currentMsgid = null;
			currentMsgstr = null;
			collectingId = false;
			collectingStr = false;
		}
	}

	// Save last entry
	if (currentMsgid !== null && currentMsgstr !== null && currentMsgid !== "") {
		messages[currentMsgid] = [currentMsgstr];
	}

	return messages;
}

const poFiles = readdirSync(localesDir).filter((f) => f.endsWith(".po"));

if (poFiles.length === 0) {
	console.error("❌ No .po files found in", localesDir);
	process.exit(1);
}

console.log(`Found ${poFiles.length} .po files`);

for (const file of poFiles) {
	const locale = file.replace(".po", "");
	const poPath = join(localesDir, file);
	const jsonPath = join(publicLocalesDir, `${locale}.json`);

	const messages = parsePoFile(poPath);
	writeFileSync(jsonPath, JSON.stringify(messages, null, 2));

	console.log(`✅ ${file} → public/locales/${locale}.json (${Object.keys(messages).length} messages)`);
}

console.log(`\nCompiled ${poFiles.length} locale catalogs to public/locales/`);
