import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import { getCanonicalRootUrl } from "@/libs/seo";
import { professions } from "@/libs/seo/professions";

export const Route = createFileRoute("/templates/$profession")({
	component: ProfessionTemplateRoute,
	head: ({ params }) => {
		const profession = professions.find((p) => p.slug === params.profession);
		if (!profession) {
			return {
				meta: [{ title: "Resume Template - Craftisle Resume" }],
			};
		}
		return {
			meta: [
				{
					title: `${profession.name} Resume Template (2025) — Free & ATS-Friendly | Craftisle Resume`,
				},
				{
					name: "description",
					content: profession.description,
				},
				{
					name: "keywords",
					content: profession.keywords.join(", "),
				},
				{
					name: "robots",
					content: "index, follow, max-image-preview:large",
				},
			],
			links: [
				{
					rel: "canonical",
					href: `https://resume.craftisle.com/templates/${params.profession}`,
				},
			],
		};
	},
});

function ProfessionTemplateRoute() {
	const params = Route.useParams();
	const profession = professions.find((p) => p.slug === params.profession);
	const canonicalUrl = getCanonicalRootUrl(typeof window !== "undefined" ? window.location.origin : undefined);

	useEffect(() => {
		if (!profession) return;

		const pageUrl = `${canonicalUrl}templates/${profession.slug}`;
		const pageTitle = `${profession.name} Resume Template (2025) — Free & ATS-Friendly | Craftisle Resume`;
		document.title = pageTitle;

		const existingLd = document.getElementById("profession-template-jsonld");
		if (existingLd) existingLd.remove();

		const faqItems = [
			{
				question: `Is the ${profession.name} resume template free?`,
				answer: `Yes. Our ${profession.name} resume template is 100% free — no subscription, no watermark, and no credit card. Export to PDF, DOCX, or plain text anytime.`,
			},
			{
				question: `Is this ${profession.name} template ATS-friendly?`,
				answer:
					"Absolutely. It uses clean, standard formatting that passes Applicant Tracking Systems, so your application reaches a human recruiter instead of being filtered out.",
			},
			{
				question: `How do I customize the ${profession.name} resume?`,
				answer: `Click "Start Building" to open the template in our builder. Edit text in real time, reorder sections, and export when ready — your data stays in your browser.`,
			},
			{
				question: `What should I include in a ${profession.name} resume?`,
				answer:
					"Lead with measurable achievements, tailor your bullets to the job description, and use standard section headings (Summary, Experience, Skills, Education). See our guide for a full checklist.",
			},
			{
				question: `Can I download my ${profession.name} resume as PDF?`,
				answer:
					"Yes. Export to PDF with a single click. The PDF keeps your formatting intact and is the format most recruiters expect.",
			},
		];

		const jsonLd = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": pageUrl,
					name: `${profession.name} Resume Template (2025)`,
					description: profession.description,
					url: pageUrl,
					isPartOf: {
						"@type": "WebSite",
						name: "Craftisle Resume",
						url: canonicalUrl,
					},
					breadcrumb: { "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb` },
				},
				{
					"@type": "BreadcrumbList",
					"@id": `${pageUrl}#breadcrumb`,
					itemListElement: [
						{ "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl },
						{ "@type": "ListItem", position: 2, name: "Templates", item: `${canonicalUrl}templates` },
						{ "@type": "ListItem", position: 3, name: profession.name, item: pageUrl },
					],
				},
				{
					"@type": "FAQPage",
					mainEntity: faqItems.map((item) => ({
						"@type": "Question",
						name: item.question,
						acceptedAnswer: { "@type": "Answer", text: item.answer },
					})),
				},
			],
		};

		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.id = "profession-template-jsonld";
		script.textContent = JSON.stringify(jsonLd);
		document.head.appendChild(script);
	}, [profession, canonicalUrl]);

	if (!profession) {
		return (
			<div className="container mx-auto px-4 py-20 text-center">
				<h1 className="font-bold text-2xl">Template Not Found</h1>
				<p className="mt-4 text-muted-foreground">The profession template you are looking for does not exist.</p>
			</div>
		);
	}

	// Related professions for the internal-link silo (all others, capped for performance)
	const relatedProfessions = professions.filter((p) => p.slug !== profession.slug).slice(0, 9);

	return (
		<main className="container mx-auto px-4 py-8 sm:px-6 lg:px-12">
			{/* SEO-optimized static content for crawlers */}
			<header className="mb-8 text-center">
				<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{profession.name} Resume Template</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					Free, ATS-friendly, and fully customizable. Create your {profession.name.toLowerCase()} resume in minutes.
				</p>
			</header>

			{/* Guide intro paragraph (导语) */}
			<section className="mx-auto mb-8 max-w-3xl">
				<h2 className="mb-4 font-semibold text-xl">How to write a great {profession.name.toLowerCase()} resume</h2>
				<p className="text-muted-foreground">
					A strong {profession.name.toLowerCase()} resume leads with measurable achievements and uses keywords from the
					job description. Start from our {profession.name} template, then tailor each bullet to the role. Keep the
					formatting clean and standard so Applicant Tracking Systems can parse it. Below you'll find a live preview,
					proven tips, and answers to common questions — when you're ready, open the builder and make it yours.
				</p>
			</section>

			<section className="mx-auto mb-8 max-w-3xl">
				<h2 className="mb-4 font-semibold text-xl">Why use our {profession.name} resume template?</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>ATS-optimized formatting — pass resume screeners</li>
					<li>Free to use — no subscription or hidden fees</li>
					<li>Multiple export formats — PDF, HTML, plain text</li>
					<li>Real-time preview — see changes as you type</li>
					<li>Privacy-first — your data stays in your browser</li>
				</ul>
			</section>

			<section className="mx-auto mb-8 max-w-3xl">
				<h2 className="mb-4 font-semibold text-xl">Tips for writing a great {profession.name.toLowerCase()} resume</h2>
				<ol className="list-inside list-decimal space-y-2 text-muted-foreground">
					<li>Tailor your experience bullets to the job description</li>
					<li>Use action verbs like "built", "led", "optimized"</li>
					<li>Quantify achievements with numbers and percentages</li>
					<li>Keep it to 1-2 pages — brevity wins</li>
					<li>Proofread carefully — typos are a quick reject</li>
				</ol>
			</section>

			{/* PDF Preview - loaded client-side */}
			<section className="overflow-hidden rounded-lg border bg-muted/30 p-4">
				<h2 className="mb-4 text-center font-semibold text-lg">Live Preview — {profession.name} Resume</h2>
				<div className="mx-auto aspect-[8.5/11] w-full max-w-2xl rounded bg-white shadow-lg">
					<Suspense fallback={<div className="flex h-full items-center justify-center">Loading preview...</div>}>
						{/* @ts-ignore — sample data import */}
						<PDFViewerPlaceholder profession={profession.name} />
					</Suspense>
				</div>
			</section>

			<section className="mt-8 text-center">
				<a
					href={`/builder/new?template=azurill&profession=${profession.slug}`}
					className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90"
				>
					Start Building My {profession.name} Resume →
				</a>
			</section>

			{/* FAQ section (rendered for crawlers/users; mirrors FAQPage JSON-LD) */}
			<section className="mx-auto mt-12 max-w-3xl">
				<h2 className="mb-6 font-bold text-2xl">Frequently Asked Questions</h2>
				<dl className="space-y-6">
					<dt className="font-semibold">Is the {profession.name} resume template free?</dt>
					<dd className="text-muted-foreground">
						Yes. Our {profession.name} resume template is 100% free — no subscription, no watermark, and no credit card.
						Export to PDF, DOCX, or plain text anytime.
					</dd>
					<dt className="font-semibold">Is this {profession.name} template ATS-friendly?</dt>
					<dd className="text-muted-foreground">
						Absolutely. It uses clean, standard formatting that passes Applicant Tracking Systems, so your application
						reaches a human recruiter instead of being filtered out.
					</dd>
					<dt className="font-semibold">How do I customize the {profession.name} resume?</dt>
					<dd className="text-muted-foreground">
						Click "Start Building" to open the template in our builder. Edit text in real time, reorder sections, and
						export when ready — your data stays in your browser.
					</dd>
					<dt className="font-semibold">What should I include in a {profession.name} resume?</dt>
					<dd className="text-muted-foreground">
						Lead with measurable achievements, tailor your bullets to the job description, and use standard section
						headings (Summary, Experience, Skills, Education). See our guide for a full checklist.
					</dd>
					<dt className="font-semibold">Can I download my {profession.name} resume as PDF?</dt>
					<dd className="text-muted-foreground">
						Yes. Export to PDF with a single click. The PDF keeps your formatting intact and is the format most
						recruiters expect.
					</dd>
				</dl>
			</section>

			{/* Related templates — internal-link silo */}
			<section className="mx-auto mt-12 max-w-4xl">
				<h2 className="mb-6 font-bold text-2xl">Related resume templates</h2>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{relatedProfessions.map((p) => (
						<a
							key={p.slug}
							href={`/templates/${p.slug}`}
							className="rounded-lg border border-gray-200 p-4 text-sm transition hover:border-blue-600 hover:shadow-sm dark:border-gray-700"
						>
							{p.name}
						</a>
					))}
				</div>
			</section>

			<footer className="mt-12 border-t pt-8 text-center text-muted-foreground text-sm">
				<p>
					Also see:{" "}
					<a href="/templates" className="underline underline-offset-4 hover:text-foreground">
						All Templates
					</a>
					{" · "}
					<a href="/guides/how-to-write-a-resume" className="underline underline-offset-4 hover:text-foreground">
						Resume Writing Guide
					</a>
					{" · "}
					<a href="/resources" className="underline underline-offset-4 hover:text-foreground">
						Free Resources
					</a>
				</p>
			</footer>
		</main>
	);
}

function PDFViewerPlaceholder({ profession }: { profession: string }) {
	// This is a static placeholder for SEO; the real PDF viewer loads client-side
	return (
		<div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
			<div className="mb-4 text-4xl">📄</div>
			<p className="font-semibold">{profession} Resume Preview</p>
			<p className="mt-2 text-sm">Start editing to see live changes</p>
		</div>
	);
}
