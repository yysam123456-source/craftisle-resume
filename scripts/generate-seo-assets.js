/**
 * Post-build SEO asset generator for resume.craftisle.com
 *
 * Replaces the legacy scripts/generate-seo-pages.js, which emitted ~77 orphaned
 * thin ".html" duplicates (one per profession/guide/blog/resource) that no page
 * linked to and no sitemap listed. Those were pure scaled-content-surface and are
 * gone. What remains is exactly two things:
 *
 *   1. sitemap.xml  -- derived from the app's own data modules, so it can never
 *                      drift from the routes that actually render.
 *   2. Static fallback markup for the four HUB pages (/blog, /templates,
 *                      /guides, /resources). These are legitimate directory
 *                      listings, and they give non-JS crawlers internal links
 *                      down to every detail page.
 *
 * Detail pages are NOT emitted as static files: the SPA route renders them with
 * far richer content (FAQ, tips, preview, related links) than any template
 * could, and duplicating them under a second URL only creates thin duplicates.
 *
 * Fail-safe: if any dataset parses below its expected floor, we leave the
 * existing sitemap untouched and exit 0. A stale sitemap is recoverable; a
 * truncated one is not.
 *
 * Usage: node scripts/generate-seo-assets.js
 * (wired as "postbuild" in apps/web/package.json)
 */
const fs = require("node:fs");
const path = require("node:path");

const ORIGIN = "https://resume.craftisle.com";

const repoRoot = path.resolve(__dirname, "..");
const webDir = path.resolve(repoRoot, "apps/web");
const srcDir = path.resolve(webDir, "src");
const publicDir = path.resolve(webDir, "public");
const distDir = path.resolve(webDir, "dist");

const PROFESSIONS_SRC = path.resolve(srcDir, "libs/seo/professions.ts");
const GUIDES_SRC = path.resolve(srcDir, "routes/guides/$slug.tsx");
const BLOG_SRC = path.resolve(srcDir, "libs/blog-data.ts");
const RESOURCES_SRC = path.resolve(srcDir, "routes/resources/index.tsx");

// Minimum plausible counts. Below these we assume the parse broke.
const FLOOR = { professions: 50, guides: 3, blog: 5, resources: 1 };

// ---------------------------------------------------------------- parsing ---

function readSource(file) {
	try {
		return fs.readFileSync(file, "utf-8");
	} catch {
		return null;
	}
}

/** Split an exported `const x: T[] = [ ... ]` array into per-object blocks. */
function splitArrayObjects(source) {
	if (!source) return [];
	const eq = source.search(/=\s*\[/);
	if (eq < 0) return [];
	const body = source.slice(eq);
	// Entries begin at a newline followed by exactly one level of tab indent.
	return body.split(/\n\t\{/).slice(1);
}

/** Read a single-line double-quoted field from an object block. */
function field(block, key) {
	const re = new RegExp(`(?:^|\\n)\\s*${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
	const m = block.match(re);
	if (!m) return null;
	return m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

function parseProfessions() {
	const objects = splitArrayObjects(readSource(PROFESSIONS_SRC));
	const out = [];
	for (const b of objects) {
		const slug = field(b, "slug");
		const name = field(b, "name");
		if (slug && name) out.push({ slug, label: name });
	}
	return out;
}

function parseGuides() {
	const objects = splitArrayObjects(readSource(GUIDES_SRC));
	const out = [];
	for (const b of objects) {
		const slug = field(b, "slug");
		const title = field(b, "title");
		if (slug && title) out.push({ slug, label: title });
	}
	return out;
}

function parseBlog() {
	const objects = splitArrayObjects(readSource(BLOG_SRC));
	const out = [];
	for (const b of objects) {
		const slug = field(b, "slug");
		const title = field(b, "title");
		const excerpt = field(b, "excerpt");
		if (slug && title) out.push({ slug, label: title, excerpt: excerpt || "" });
	}
	return out;
}

function parseResources() {
	const objects = splitArrayObjects(readSource(RESOURCES_SRC));
	const out = [];
	for (const b of objects) {
		const slug = field(b, "slug");
		const title = field(b, "title");
		if (slug && title) out.push({ slug, label: title });
	}
	return out;
}

/** Paragraph counts are used only for the sanity log. */
function logDataset(name, items) {
	const ok = items.length >= FLOOR[name];
	console.log(`   ${ok ? "ok  " : "FAIL"} ${name.padEnd(12)} ${items.length}`);
	return ok;
}

// ---------------------------------------------------------------- sitemap ---

function buildSitemap({ professions, guides, blog, resources }) {
	const urls = [
		`${ORIGIN}/`,
		`${ORIGIN}/templates`,
		...professions.map((p) => `${ORIGIN}/templates/${p.slug}`),
		`${ORIGIN}/guides`,
		...guides.map((g) => `${ORIGIN}/guides/${g.slug}`),
		`${ORIGIN}/blog`,
		...blog.map((p) => `${ORIGIN}/blog/${p.slug}`),
		`${ORIGIN}/resources`,
		...resources.map((r) => `${ORIGIN}/resources/${r.slug}`),
	];

	// Guard against accidental duplicates across datasets.
	const unique = [...new Set(urls)];

	const body = unique
		.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`)
		.join("\n");

	// No <lastmod>: we cannot derive an honest per-URL modification date, and a
	// blanket "today" is a signal Google learns to distrust.
	return {
		xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
		count: unique.length,
	};
}

// ------------------------------------------------------------ hub markup ---

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/**
 * Replace the router head tags of the built index.html.
 * Returns null if the template does not look like the shell we expect, so the
 * caller can skip the hub rather than emit a broken document.
 */
function withHead(html, { title, description, canonical }) {
	if (!/<title>[^<]*<\/title>/.test(html)) return null;
	if (!/<meta name="description" content="[^"]*"/.test(html)) return null;

	let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
	out = out.replace(
		/<meta name="description" content="[^"]*"\s*\/?>/,
		`<meta name="description" content="${escapeHtml(description)}" />`,
	);
	out = out.replace(
		/<meta property="og:title" content="[^"]*"\s*\/?>/,
		`<meta property="og:title" content="${escapeHtml(title)}" />`,
	);
	out = out.replace(
		/<meta property="og:description" content="[^"]*"\s*\/?>/,
		`<meta property="og:description" content="${escapeHtml(description)}" />`,
	);
	out = out.replace(
		/<meta name="twitter:title" content="[^"]*"\s*\/?>/,
		`<meta name="twitter:title" content="${escapeHtml(title)}" />`,
	);
	out = out.replace(
		/<meta name="twitter:description" content="[^"]*"\s*\/?>/,
		`<meta name="twitter:description" content="${escapeHtml(description)}" />`,
	);

	// Canonical has to be injected, not replaced -- the shell has none.
	out = out.replace(
		/<link rel="icon" href="\/favicon\.ico"/,
		`<link rel="canonical" href="${canonical}" />\n\t\t<link rel="icon" href="/favicon.ico"`,
	);

	return out;
}

/**
 * Insert fallback markup as the first child of <div id="app">.
 *
 * Deliberately an insertion rather than the legacy regex replace, which spanned
 * across the closing </div> and swallowed the <noscript> block, producing
 * malformed markup. React replaces #app's children on hydration either way.
 */
function withStaticContent(html, markup) {
	const marker = '<div id="app">';
	const i = html.indexOf(marker);
	if (i < 0) return null;
	const at = i + marker.length;
	return `${html.slice(0, at)}\n${markup}\n${html.slice(at)}`;
}

function listMarkup(items, hrefBase, opts = {}) {
	const withExcerpt = opts.withExcerpt === true;
	return items
		.map((it) => {
			const link = `<a href="${hrefBase}/${it.slug}">${escapeHtml(it.label)}</a>`;
			return withExcerpt && it.excerpt ? `      <li>${link} &mdash; ${escapeHtml(it.excerpt)}</li>` : `      <li>${link}</li>`;
		})
		.join("\n");
}

function buildHubs({ professions, guides, blog, resources }) {
	return [
		{
			dir: "templates",
			title: "Resume Templates by Profession — Free & ATS-Friendly | Craftisle Resume",
			description:
				"Browse free, ATS-friendly resume templates for 60+ professions — software engineer, nurse, teacher, product manager and more. Pick one and build in minutes.",
			canonical: `${ORIGIN}/templates`,
			markup: `<header>
  <h1>Resume Templates by Profession</h1>
  <p>Free, ATS-friendly resume templates for every profession. Pick your role, then build and export in minutes.</p>
</header>
<main>
  <h2>All professions</h2>
  <ul>
${listMarkup(professions, "/templates")}
  </ul>
</main>`,
		},
		{
			dir: "guides",
			title: "Resume Writing Guides — Free, Step-by-Step | Craftisle Resume",
			description:
				"Free step-by-step resume writing guides: how to write a resume, what to include, ATS optimization, and writing with no experience.",
			canonical: `${ORIGIN}/guides`,
			markup: `<header>
  <h1>Resume Writing Guides</h1>
  <p>Step-by-step, free guides that cover every stage of writing a resume that gets interviews.</p>
</header>
<main>
  <h2>All guides</h2>
  <ul>
${listMarkup(guides, "/guides")}
  </ul>
</main>`,
		},
		{
			dir: "blog",
			title: "Resume Writing Blog — Expert Tips & Career Advice | Craftisle Resume",
			description:
				"Free resume writing guides and career advice: ATS tips, action verbs, resume length, cover letters, LinkedIn optimization and more.",
			canonical: `${ORIGIN}/blog`,
			markup: `<header>
  <h1>Resume Writing Blog</h1>
  <p>Practical, no-fluff resume and job-search advice you can apply in the next ten minutes.</p>
</header>
<main>
  <h2>All articles</h2>
  <ul>
${listMarkup(blog, "/blog", { withExcerpt: true })}
  </ul>
</main>`,
		},
		{
			dir: "resources",
			title: "Free Resume Resources — Checklists & Guides | Craftisle Resume",
			description:
				"Free resume resources: a 25-point ATS checklist and a salary negotiation guide with scripts and tactics.",
			canonical: `${ORIGIN}/resources`,
			markup: `<header>
  <h1>Free Resume Resources</h1>
  <p>Downloads, checklists and scripts to make your application stronger before you hit apply.</p>
</header>
<main>
  <h2>All resources</h2>
  <ul>
${listMarkup(resources, "/resources")}
  </ul>
</main>`,
		},
	];
}

// ------------------------------------------------------------------- main ---

function main() {
	const professions = parseProfessions();
	const guides = parseGuides();
	const blog = parseBlog();
	const resources = parseResources();

	console.log("Parsed SEO datasets:");
	const healthy =
		logDataset("professions", professions) &&
		logDataset("guides", guides) &&
		logDataset("blog", blog) &&
		logDataset("resources", resources);

	if (!healthy) {
		console.warn("\n[warn] A dataset parsed below its expected floor.");
		console.warn("[warn] Refusing to regenerate sitemap.xml — existing file left as-is.");
		return;
	}

	const { xml, count } = buildSitemap({ professions, guides, blog, resources });

	// 1. Committed copy (source of truth for review; Vite copies it to dist).
	fs.mkdirSync(publicDir, { recursive: true });
	fs.writeFileSync(path.resolve(publicDir, "sitemap.xml"), xml, "utf-8");
	console.log(`\nWrote public/sitemap.xml (${count} urls)`);

	// 2. Deployed copy. Vite already copied public/ before postbuild runs, so
	//    the dist copy has to be refreshed explicitly.
	if (fs.existsSync(distDir)) {
		fs.writeFileSync(path.resolve(distDir, "sitemap.xml"), xml, "utf-8");
		console.log(`Wrote dist/sitemap.xml (${count} urls)`);

		const shell = readSource(path.resolve(distDir, "index.html"));
		if (!shell) {
			console.log("No dist/index.html — skipped hub fallback markup.");
			return;
		}

		let written = 0;
		for (const hub of buildHubs({ professions, guides, blog, resources })) {
			let html = withHead(shell, hub);
			if (!html) {
				console.warn(`[warn] dist/index.html did not match the expected shell; skipped /${hub.dir}.`);
				continue;
			}
			html = withStaticContent(html, hub.markup);
			if (!html) {
				console.warn(`[warn] Could not locate <div id="app">; skipped /${hub.dir}.`);
				continue;
			}
			const outPath = path.resolve(distDir, hub.dir, "index.html");
			fs.mkdirSync(path.dirname(outPath), { recursive: true });
			fs.writeFileSync(outPath, html, "utf-8");
			written++;
		}
		console.log(`Wrote ${written} hub fallback pages (dist/{templates,guides,blog,resources}/index.html)`);
	} else {
		console.log("No dist/ present — skipped hub fallback markup (repo-only run).");
	}
}

main();
