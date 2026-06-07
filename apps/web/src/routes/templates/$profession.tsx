import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { professions } from "@/libs/seo/professions";

const _PDFViewer = lazy(async () => {
	const { PDFViewer } = await import("@react-pdf/renderer");
	return { default: PDFViewer };
});

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

	if (!profession) {
		return (
			<div className="container mx-auto px-4 py-20 text-center">
				<h1 className="font-bold text-2xl">Template Not Found</h1>
				<p className="mt-4 text-muted-foreground">The profession template you are looking for does not exist.</p>
			</div>
		);
	}

	return (
		<main className="container mx-auto px-4 py-8 sm:px-6 lg:px-12">
			{/* SEO-optimized static content for crawlers */}
			<header className="mb-8 text-center">
				<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{profession.name} Resume Template</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					Free, ATS-friendly, and fully customizable. Create your {profession.name.toLowerCase()} resume in minutes.
				</p>
			</header>

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
