/**
 * Convert Lingui .po catalogs to .json for static serving.
 * Reads .po files directly (no dependency on `lingui compile`).
 * Run before `vite build`.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "../locales");
const publicLocalesDir = join(__dirname, "../public/locales");

mkdirSync(publicLocalesDir, { recursive: true });

// Parse a .po file into { msgid: msgstr } mapping
function parsePoFile(filePath) {
	const content = readFileSync(filePath, "utf-8");
	const messages = {};

	// Split by blank lines to get entries
	const _entries = content.split(/\n\n/);

	let currentMsgid = null;
	let currentMsgstr = null;
	let inMsgid = false;
	let inMsgstr = false;

	const lines = content.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (line.startsWith("msgid ")) {
			// Save previous entry
			if (currentMsgid !== null && currentMsgstr !== null) {
				messages[currentMsgid] = currentMsgstr;
			}

			inMsgid = true;
			inMsgstr = false;
			currentMsgid = line.slice(7, -1); // Remove msgid " and "
		} else if (line.startsWith("msgstr ")) {
			inMsgid = false;
			inMsgstr = true;
			currentMsgstr = line.slice(8, -1); // Remove msgstr " and "
		} else if (line.startsWith('"') && inMsgid) {
			// Continuation of msgid
			currentMsgid += line.slice(1, -1);
		} else if (line.startsWith('"') && inMsgstr) {
			// Continuation of msgstr
			currentMsgstr += line.slice(1, -1);
		} else if (line.trim() === "" || line.startsWith("#")) {
			// Blank line or comment: save entry if complete
			if (currentMsgid !== null && currentMsgstr !== null) {
				messages[currentMsgid] = currentMsgstr;
				currentMsgid = null;
				currentMsgstr = null;
				inMsgid = false;
				inMsgstr = false;
			}
		}
	}

	// Save last entry
	if (currentMsgid !== null && currentMsgstr !== null) {
		messages[currentMsgid] = currentMsgstr;
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
