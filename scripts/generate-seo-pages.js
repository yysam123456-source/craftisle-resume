/**
 * Post-build script: generate static HTML files for programmatic SEO.
 *
 * For each profession, creates dist/templates/[slug].html
 * For each guide, creates dist/guides/[slug].html
 *
 * Usage: node scripts/generate-seo-pages.js
 * (auto-run as postbuild via package.json)
 */
const fs = require("node:fs");
const path = require("node:path");

const distDir = path.resolve(__dirname, "..", "apps/web/dist");

// ── Profession list (mirrors libs/seo/professions.ts) ──
const professions = [
	{
		slug: "software-engineer",
		name: "Software Engineer",
		description:
			"Create a professional software engineer resume that highlights your coding skills, projects, and technical expertise. Free ATS-friendly template.",
	},
	{
		slug: "frontend-developer",
		name: "Frontend Developer",
		description:
			"Build a frontend developer resume showcasing React, Vue, and UI/UX skills. Free template with live preview.",
	},
	{
		slug: "backend-developer",
		name: "Backend Developer",
		description:
			"Create a backend developer resume highlighting APIs, databases, and system design experience. ATS-optimized.",
	},
	{
		slug: "full-stack-developer",
		name: "Full Stack Developer",
		description:
			"Make a full stack developer resume that demonstrates end-to-end web development expertise. Free online builder.",
	},
	{
		slug: "data-scientist",
		name: "Data Scientist",
		description:
			"Craft a data scientist resume highlighting Python, ML, and data analysis projects. Free ATS-friendly format.",
	},
	{
		slug: "devops-engineer",
		name: "DevOps Engineer",
		description: "Create a DevOps engineer resume showcasing CI/CD, cloud, and automation skills. Free template.",
	},
	{
		slug: "product-manager",
		name: "Product Manager",
		description:
			"Build a product manager resume that demonstrates user-centric thinking and roadmap execution. Free ATS template.",
	},
	{
		slug: "ui-ux-designer",
		name: "UI/UX Designer",
		description:
			"Design a UI/UX designer resume portfolio with skills in Figma, user research, and design systems. Free builder.",
	},
	{
		slug: "qa-engineer",
		name: "QA Engineer",
		description:
			"Write a QA engineer resume highlighting test automation, manual testing, and quality processes. Free ATS format.",
	},
	{
		slug: "security-engineer",
		name: "Security Engineer",
		description:
			"Create a cybersecurity resume showcasing penetration testing, compliance, and security architecture. Free template.",
	},
	{
		slug: "project-manager",
		name: "Project Manager",
		description:
			"Make a project manager resume with PMP certification and agile methodology highlights. Free ATS-optimized.",
	},
	{
		slug: "business-analyst",
		name: "Business Analyst",
		description:
			"Craft a business analyst resume showing requirements gathering and process improvement. Free template.",
	},
	{
		slug: "data-analyst",
		name: "Data Analyst",
		description: "Build a data analyst resume with SQL, Excel, and visualization skills. Free ATS-friendly format.",
	},
	{
		slug: "marketing-manager",
		name: "Marketing Manager",
		description:
			"Create a marketing manager resume highlighting campaigns, SEO, and brand management. Free online builder.",
	},
	{
		slug: "sales-manager",
		name: "Sales Manager",
		description:
			"Write a sales manager resume with quota achievement and team leadership highlights. Free ATS template.",
	},
	{
		slug: "accountant",
		name: "Accountant",
		description: "Make an accountant resume showcasing CPA, financial reporting, and audit experience. Free template.",
	},
	{
		slug: "financial-analyst",
		name: "Financial Analyst",
		description: "Craft a financial analyst resume with modeling, forecasting, and valuation skills. Free ATS format.",
	},
	{
		slug: "hr-manager",
		name: "HR Manager",
		description:
			"Build an HR manager resume highlighting talent acquisition and employee relations. Free online builder.",
	},
	{
		slug: "operations-manager",
		name: "Operations Manager",
		description:
			"Create an operations manager resume showing process optimization and cost reduction. Free ATS template.",
	},
	{
		slug: "nurse",
		name: "Nurse",
		description:
			"Create a professional nurse resume with clinical experience and certifications. Free ATS-friendly template.",
	},
	{
		slug: "doctor",
		name: "Doctor",
		description: "Build a doctor resume highlighting medical education, residency, and specialties. Free template.",
	},
	{
		slug: "medical-assistant",
		name: "Medical Assistant",
		description: "Write a medical assistant resume with clinical and administrative skills. Free ATS format.",
	},
	{
		slug: "pharmacist",
		name: "Pharmacist",
		description: "Craft a pharmacist resume showcasing pharmaceutical care and medication management. Free template.",
	},
	{
		slug: "teacher",
		name: "Teacher",
		description:
			"Make a teacher resume highlighting classroom management and curriculum development. Free ATS-optimized.",
	},
	{
		slug: "professor",
		name: "Professor",
		description:
			"Create a professor resume with research publications and teaching experience. Free academic template.",
	},
	{
		slug: "tutor",
		name: "Tutor",
		description: "Build a tutor resume showcasing subject expertise and student success stories. Free template.",
	},
	{
		slug: "graphic-designer",
		name: "Graphic Designer",
		description:
			"Design a graphic designer resume with portfolio highlights and Adobe Creative Suite skills. Free builder.",
	},
	{
		slug: "video-editor",
		name: "Video Editor",
		description:
			"Create a video editor resume showcasing Premiere Pro, After Effects, and storytelling. Free template.",
	},
	{
		slug: "content-writer",
		name: "Content Writer",
		description: "Write a content writer resume with SEO writing and editorial experience. Free ATS-friendly format.",
	},
	{
		slug: "recent-graduate",
		name: "Recent Graduate",
		description:
			"Create a recent graduate resume with internship experience and academic projects. Free entry-level template.",
	},
	{
		slug: "intern",
		name: "Intern",
		description: "Build an intern resume highlighting academic achievements and relevant coursework. Free template.",
	},
	{
		slug: "career-changer",
		name: "Career Changer",
		description: "Make a career changer resume that transfers skills to a new industry. Free ATS template.",
	},
	{
		slug: "mechanical-engineer",
		name: "Mechanical Engineer",
		description: "Craft a mechanical engineer resume with CAD, thermodynamics, and design experience. Free template.",
	},
	{
		slug: "civil-engineer",
		name: "Civil Engineer",
		description: "Create a civil engineer resume highlighting infrastructure projects and PE license. Free ATS format.",
	},
	{
		slug: "electrical-engineer",
		name: "Electrical Engineer",
		description: "Build an electrical engineer resume with circuit design and power systems experience. Free template.",
	},
	{
		slug: "chemical-engineer",
		name: "Chemical Engineer",
		description: "Write a chemical engineer resume showcasing process design and safety compliance. Free ATS template.",
	},
	{
		slug: "lawyer",
		name: "Lawyer",
		description: "Create a lawyer resume with practice area expertise and case wins. Free professional template.",
	},
	{
		slug: "paralegal",
		name: "Paralegal",
		description: "Make a paralegal resume highlighting legal research and document preparation. Free ATS format.",
	},
	{
		slug: "mobile-developer",
		name: "Mobile Developer",
		description: "Build a mobile developer resume with iOS/Android app portfolio. Free React Native template.",
	},
	{
		slug: "game-developer",
		name: "Game Developer",
		description: "Create a game developer resume showcasing Unity, Unreal, and shipped titles. Free template.",
	},
	{
		slug: "ai-engineer",
		name: "AI Engineer",
		description: "Craft an AI engineer resume with LLM, RAG, and MLOps experience. Free ATS-friendly.",
	},
	{
		slug: "cloud-architect",
		name: "Cloud Architect",
		description: "Write a cloud architect resume with AWS/Azure and infrastructure design. Free template.",
	},
	{
		slug: "freelancer",
		name: "Freelancer",
		description: "Make a freelancer resume showcasing client projects and niche expertise. Free portfolio template.",
	},
	{
		slug: "remote-worker",
		name: "Remote Worker",
		description: "Create a remote work resume highlighting distributed team collaboration. Free ATS template.",
	},
	{
		slug: "high-school-student",
		name: "High School Student",
		description: "Build a high school student resume for college applications and first jobs. Free template.",
	},
	{
		slug: "college-student",
		name: "College Student",
		description: "Craft a college student resume with campus involvement and part-time work. Free ATS format.",
	},
	{
		slug: "ceo",
		name: "CEO",
		description: "Create a CEO resume with P&L ownership and strategic leadership highlights. Free executive template.",
	},
	{
		slug: "cto",
		name: "CTO",
		description: "Make a CTO resume showcasing technology strategy and team scaling. Free ATS executive format.",
	},
	{
		slug: "director",
		name: "Director",
		description: "Write a director resume with organizational leadership and budget management. Free template.",
	},
	{
		slug: "chef",
		name: "Chef",
		description: "Create a chef resume with culinary training and kitchen management experience. Free template.",
	},
	{
		slug: "hotel-manager",
		name: "Hotel Manager",
		description: "Build a hotel manager resume highlighting guest satisfaction and revenue growth. Free ATS format.",
	},
	{
		slug: "retail-manager",
		name: "Retail Manager",
		description: "Craft a retail manager resume with sales growth and team leadership. Free template.",
	},
	{
		slug: "cashier",
		name: "Cashier",
		description:
			"Write a cashier resume with customer service and point-of-sale experience. Free entry-level template.",
	},
	{
		slug: "customer-support",
		name: "Customer Support",
		description:
			"Create a customer support resume highlighting problem resolution and CSAT improvement. Free template.",
	},
	{
		slug: "warehouse-worker",
		name: "Warehouse Worker",
		description: "Make a warehouse worker resume with inventory management and safety compliance. Free ATS format.",
	},
	{
		slug: "driver",
		name: "Driver",
		description: "Build a driver resume with clean driving record and delivery experience. Free CDL template.",
	},
	{
		slug: "admin-assistant",
		name: "Admin Assistant",
		description: "Craft an admin assistant resume with office management and scheduling skills. Free template.",
	},
	{
		slug: "receptionist",
		name: "Receptionist",
		description: "Write a receptionist resume with front desk and communication skills. Free entry-level format.",
	},
	{
		slug: "real-estate-agent",
		name: "Real Estate Agent",
		description: "Create a real estate agent resume with sales performance and client relations. Free template.",
	},
	{
		slug: "social-media-manager",
		name: "Social Media Manager",
		description: "Make a social media manager resume with campaign metrics and content strategy. Free ATS template.",
	},
];

// ── Guide list ──
const guides = [
	{
		slug: "how-to-write-a-resume",
		title: "How to Write a Resume (2025) — Step-by-Step Guide",
		description:
			"Learn how to write a professional resume in 2025. Step-by-step guide with examples, ATS tips, and free templates.",
	},
	{
		slug: "what-to-put-on-a-resume",
		title: "What to Put on a Resume (2025) — Essential Sections",
		description:
			"Wondering what to include in your resume? Here are the essential sections every resume needs in 2025.",
	},
	{
		slug: "how-to-make-a-resume-ats-friendly",
		title: "How to Make Your Resume ATS-Friendly (2025)",
		description:
			"Applicant Tracking Systems (ATS) reject 75% of resumes. Learn how to make your resume ATS-friendly and get past the bots.",
	},
	{
		slug: "how-to-write-a-resume-with-no-experience",
		title: "How to Write a Resume with No Experience (2025)",
		description:
			"No work experience? No problem. Learn how to write a resume that highlights your skills, projects, and potential.",
	},
];

// ── Blog post list ──
const blogPosts = [
	{
		slug: "how-to-write-a-resume-in-2026",
		title: "How to Write a Resume in 2026 (Step-by-Step Guide)",
		description:
			"Learn the latest resume writing trends, ATS optimization tips, and formatting best practices for 2026.",
	},
	{
		slug: "10-ats-friendly-resume-tips",
		title: "10 ATS-Friendly Resume Tips That Will Get You Hired",
		description: "Applicant Tracking Systems reject 75% of resumes. Make sure yours passes with these proven tips.",
	},
	{
		slug: "resume-templates-for-software-engineers",
		title: "Best Resume Templates for Software Engineers (2026)",
		description: "Stand out to tech recruiters with these developer-focused resume templates and examples.",
	},
	{
		slug: "free-resume-checklist-2026",
		title: "Free Resume Checklist 2026 (Downloadable PDF)",
		description: "Don't submit your resume without checking these 25 critical items. Download our free checklist.",
	},
	{
		slug: "how-to-download-resume-as-pdf-free",
		title: "How to Download Your Resume as PDF for Free",
		description: "Step-by-step guide to exporting your resume as a PDF file, with tips for ATS-friendly formatting.",
	},
	{
		slug: "100-action-verbs-for-resume",
		title: "100+ Action Verbs for Your Resume (By Category)",
		description:
			"Replace 'responsible for' with these power verbs that recruiters actually notice. Sorted by job function.",
	},
	{
		slug: "resume-length-guide-2026",
		title: "How Long Should a Resume Be? (2026 Guide)",
		description: "One page or two? The answer depends on your experience level. Here's the data-backed answer.",
	},
	{
		slug: "how-to-write-a-cover-letter",
		title: "How to Write a Cover Letter That Gets Noticed",
		description: "Most cover letters get skimmed in 6 seconds. Here's how to make yours impossible to ignore.",
	},
	{
		slug: "linkedin-profile-optimization-2026",
		title: "LinkedIn Profile Optimization Guide (2026)",
		description: "75% of recruiters check LinkedIn before interviewing. Optimize your profile with these 10 tactics.",
	},
	{
		slug: "job-search-timeline-how-long",
		title: "Job Search Timeline: How Long Does It Take?",
		description: "The average job search takes 3-6 months. Here's a realistic timeline plus how to speed it up.",
	},
];

// ── Resources list ──
const resources = [
	{
		slug: "resume-checklist",
		title: "2026 Resume Checklist (25-Point Audit)",
		description:
			"Tick every box before you hit 'Apply'. A free interactive checklist to ensure your resume is ATS-ready and recruiter-approved.",
	},
	{
		slug: "salary-negotiation",
		title: "Salary Negotiation Guide 2026",
		description: "Make sure your compensation matches market rate before signing. Includes scripts & tactics.",
	},
];

function main() {
	const indexPath = path.resolve(distDir, "index.html");
	let indexHtml;
	try {
		indexHtml = fs.readFileSync(indexPath, "utf-8");
	} catch (_e) {
		console.error(`❌ index.html not found at ${indexPath}`);
		console.error("   Run this script after 'pnpm run build'.");
		process.exit(1);
	}

	let generated = 0;

	// ── Generate /templates/[slug].html ──
	for (const p of professions) {
		const slug = p.slug;
		const name = p.name;
		const desc = p.description;
		const title = `${name} Resume Template (2025) — Free & ATS-Friendly | Craftisle Resume`;

		const html = buildHtml(indexHtml, {
			title,
			description: desc,
			ogTitle: title,
			ogDescription: desc,
			staticContent: `
        <header>
          <h1>${name} Resume Template – Free & ATS-Friendly</h1>
          <p>${desc}</p>
        </header>
        <main>
          <section>
            <h2>Create Your ${name} Resume in Minutes</h2>
            <p>Our free ${name.toLowerCase()} resume builder helps you create a professional resume that passes ATS systems. No sign-up required.</p>
          </section>
          <section>
            <h2>Why Choose Craftisle Resume?</h2>
            <ul>
              <li>Free and open-source – no hidden fees</li>
              <li>ATS-optimized templates</li>
              <li>Real-time PDF preview</li>
              <li>Privacy-first – your data stays with you</li>
            </ul>
          </section>
        </main>`,
		});

		const outPath = path.resolve(distDir, "templates", `${slug}.html`);
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, html, "utf-8");
		generated++;
	}

	// ── Generate /guides/[slug].html ──
	for (const g of guides) {
		const title = g.title;
		const desc = g.description;

		const html = buildHtml(indexHtml, {
			title,
			description: desc,
			ogTitle: title,
			ogDescription: desc,
			staticContent: `
        <header>
          <h1>${title}</h1>
          <p>${desc}</p>
        </header>
        <main>
          <section>
            <h2>Free Resume Writing Guide</h2>
            <p>Follow our step-by-step guide to create a professional resume that gets interviews.</p>
          </section>
          <section>
            <h2>Start Building Now</h2>
            <p><a href="/">Use our free resume builder</a> to create your professional resume in minutes.</p>
          </section>
        </main>`,
		});

		const outPath = path.resolve(distDir, "guides", `${g.slug}.html`);
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, html, "utf-8");
		generated++;
	}

	// ── Generate /blog/index.html ──
	{
		const title = "Resume Writing Blog — Craftisle Resume";
		const desc = "Expert resume writing tips and career advice.";
		const blogListing = blogPosts
			.map((p) => `<li><a href="/blog/${p.slug}">${p.title}</a> — ${p.description}</li>`)
			.join("\n            ");

		const html = buildHtml(indexHtml, {
			title,
			description: desc,
			ogTitle: title,
			ogDescription: desc,
			staticContent: `
        <header><h1>Resume Writing Blog</h1><p>${desc}</p></header>
        <main><ul>${blogListing}</ul><p><a href="/">Build your free resume now →</a></p></main>`,
		});

		const outPath = path.resolve(distDir, "blog", "index.html");
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, html, "utf-8");
		generated++;
	}

	// ── Generate /blog/[slug].html ──
	for (const p of blogPosts) {
		const title = p.title;
		const desc = p.description;

		const html = buildHtml(indexHtml, {
			title: `${title} — Craftisle Resume Blog`,
			description: desc,
			ogTitle: title,
			ogDescription: desc,
			staticContent: `
        <article>
          <header><h1>${title}</h1></header>
          <main><p>${desc}</p><p><a href="/">Build your free resume now →</a></p></main>
        </article>`,
		});

		const outPath = path.resolve(distDir, "blog", `${p.slug}.html`);
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, html, "utf-8");
		generated++;
	}

	// ── Generate /resources/index.html ──
	{
		const title = "Free Resume Resources — Craftisle Resume";
		const desc = "Download checklists, read guides, and boost your job search — for free.";
		const resListing = resources
			.map((r) => `<li><a href="/resources/${r.slug}">${r.title}</a> — ${r.description}</li>`)
			.join("\n            ");

		const html = buildHtml(indexHtml, {
			title,
			description: desc,
			ogTitle: title,
			ogDescription: desc,
			staticContent: `
        <header><h1>Free Resume Resources</h1><p>${desc}</p></header>
        <main><ul>${resListing}</ul><p><a href="/">Build your free resume now →</a></p></main>`,
		});

		const outPath = path.resolve(distDir, "resources", "index.html");
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, html, "utf-8");
		generated++;
	}

	// ── Generate /resources/[slug].html ──
	for (const r of resources) {
		const title = r.title;
		const desc = r.description;

		const html = buildHtml(indexHtml, {
			title: `${title} — Craftisle Resume Resources`,
			description: desc,
			ogTitle: title,
			ogDescription: desc,
			staticContent: `
        <article>
          <header><h1>${title}</h1></header>
          <main><p>${desc}</p><p><a href="/">Build your free resume now →</a></p></main>
        </article>`,
		});

		const outPath = path.resolve(distDir, "resources", `${r.slug}.html`);
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, html, "utf-8");
		generated++;
	}

	console.log(`✅ Generated ${generated} static SEO pages in dist/`);
	console.log(`   Templates: dist/templates/[profession].html (${professions.length} pages)`);
	console.log(`   Guides:    dist/guides/[slug].html (${guides.length} pages)`);
	console.log(`   Blog:      dist/blog/[slug].html (${blogPosts.length} pages)`);
	console.log(`   Resources: dist/resources/[slug].html (${resources.length} pages)`);
}

/**
 * Build a static HTML file from index.html with unique meta tags and static content.
 */
function buildHtml(baseHtml, { title, description, ogTitle, ogDescription, staticContent }) {
	let html = baseHtml;

	// Replace <title>
	html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

	// Replace meta description
	html = html.replace(
		/<meta name="description" content="[^"]*"\s*\/?>/,
		`<meta name="description" content="${description.replace(/"/g, "")}" />`,
	);

	// Replace OG tags
	html = html.replace(
		/<meta property="og:title" content="[^"]*"\s*\/?>/,
		`<meta property="og:title" content="${ogTitle.replace(/"/g, "")}" />`,
	);
	html = html.replace(
		/<meta property="og:description" content="[^"]*"\s*\/?>/,
		`<meta property="og:description" content="${ogDescription.replace(/"/g, "")}" />`,
	);

	// Replace Twitter tags
	html = html.replace(
		/<meta name="twitter:title" content="[^"]*"\s*\/?>/,
		`<meta name="twitter:title" content="${ogTitle.replace(/"/g, "")}" />`,
	);
	html = html.replace(
		/<meta name="twitter:description" content="[^"]*"\s*\/?>/,
		`<meta name="twitter:description" content="${ogDescription.replace(/"/g, "")}" />`,
	);

	// Inject static SEO content inside <div id="app">
	html = html.replace(/(<div id="app">)[\s\S]*?(<script)/, `$1${staticContent}\n    $2`);

	return html;
}

main();
