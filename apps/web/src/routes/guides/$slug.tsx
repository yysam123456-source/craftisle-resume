import { createFileRoute } from "@tanstack/react-router";
import { getCanonicalRootUrl } from "@/libs/seo";

export interface GuideData {
	slug: string;
	title: string;
	description: string;
	headings: string[];
}

export const guides: GuideData[] = [
	{
		slug: "how-to-write-a-resume",
		title: "How to Write a Resume (2025) — Step-by-Step Guide",
		description:
			"Learn how to write a professional resume in 2025. Step-by-step guide with examples, ATS tips, and free templates.",
		headings: [
			"Choose the Right Resume Format",
			"Add Your Contact Information",
			"Write a Strong Professional Summary",
			"List Your Work Experience in Reverse-Chronological Order",
			"Highlight Your Skills with Keywords",
			"Add Education, Certifications, and Awards",
			"Proofread and Optimize for ATS",
		],
	},
	{
		slug: "what-to-put-on-a-resume",
		title: "What to Put on a Resume (2025) — Essential Sections",
		description:
			"Wondering what to include in your resume? Here are the essential sections every resume needs in 2025.",
		headings: [
			"Contact Information (Header)",
			"Professional Summary or Objective",
			"Work Experience",
			"Education",
			"Skills (Hard & Soft)",
			"Certifications & Awards",
			"Projects (Optional but Powerful)",
		],
	},
	{
		slug: "how-to-make-a-resume-ats-friendly",
		title: "How to Make Your Resume ATS-Friendly (2025)",
		description:
			"Applicant Tracking Systems (ATS) reject 75% of resumes. Learn how to make your resume ATS-friendly and get past the bots.",
		headings: [
			"Use a Standard, Clean Format",
			"Avoid Headers, Footers, and Text Boxes",
			"Use Standard Section Headings",
			"Include Keywords from the Job Description",
			"Save as .docx or PDF (Never a PNG)",
			"Test Your Resume with an ATS Checker",
		],
	},
	{
		slug: "how-to-write-a-resume-with-no-experience",
		title: "How to Write a Resume with No Experience (2025)",
		description:
			"No work experience? No problem. Learn how to write a resume that highlights your skills, projects, and potential.",
		headings: [
			"Focus on Your Education and Coursework",
			"Highlight Projects and Internships",
			"Emphasize Transferable Skills",
			"Add Volunteer Work or Extracurriculars",
			"Write a Strong Objective (Not a Summary)",
			"Use a Functional or Combination Format",
		],
	},
	{
		slug: "best-resume-format-2025",
		title: "Best Resume Format (2025) — Which One Should You Use?",
		description:
			"Compare the three resume formats: Chronological, Functional, and Combination. Pick the best one for your situation.",
		headings: [
			"Reverse-Chronological (Most Common)",
			"Functional (Skills-Based)",
			"Combination (Hybrid)",
			"Which Format Is Best for ATS?",
			"Free Resume Format Templates",
		],
	},
];

export const Route = createFileRoute("/guides/$slug")({
	component: GuideRoute,
	head: ({ params }) => {
		const guide = guides.find((g) => g.slug === params.slug);
		const canonicalUrl = getCanonicalRootUrl(typeof window !== "undefined" ? window.location.origin : undefined);

		if (!guide) {
			return { meta: [{ title: "Guide Not Found — Craftisle Resume" }] };
		}

		return {
			meta: [
				{ title: guide.title },
				{ name: "description", content: guide.description },
				{ name: "robots", content: "index, follow, max-image-preview:large" },
			],
			links: [{ rel: "canonical", href: `${canonicalUrl}guides/${guide.slug}` }],
		};
	},
});

function GuideRoute() {
	const params = Route.useParams();
	const guide = guides.find((g) => g.slug === params.slug);

	if (!guide) {
		return (
			<main className="container mx-auto px-4 py-20 text-center">
				<h1 className="font-bold text-2xl">Guide Not Found</h1>
				<p className="mt-4 text-muted-foreground">The guide you are looking for does not exist.</p>
			</main>
		);
	}

	return (
		<main className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-12">
			<header className="mb-10">
				<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{guide.title}</h1>
				<p className="mt-3 text-lg text-muted-foreground">{guide.description}</p>
			</header>

			<article className="prose prose-gray dark:prose-invert max-w-none">
				{guide.headings.map((heading, i) => (
					<section key={i} className="mb-8">
						<h2 className="font-semibold text-xl">{heading}</h2>
						<p>
							This section explains how to {heading.toLowerCase()} effectively. Use action verbs, quantify achievements,
							and tailor your content to the job description.
						</p>
					</section>
				))}

				<section className="mt-12 rounded-lg border bg-muted/30 p-6 text-center">
					<h3 className="font-semibold text-lg">Ready to build your resume?</h3>
					<p className="mt-2 text-muted-foreground">
						Use our free resume builder to create a professional resume in minutes.
					</p>
					<a
						href="/"
						className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90"
					>
						Start Building Now →
					</a>
				</section>
			</article>
		</main>
	);
}
