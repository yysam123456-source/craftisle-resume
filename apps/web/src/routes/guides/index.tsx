import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getLocale } from "@/libs/locale";
import { getCanonicalRootUrl } from "@/libs/seo";
import { guides } from "./$slug";

export const Route = createFileRoute("/guides/")({
	component: GuidesHubPage,
	head: () => {
		const canonicalUrl = getCanonicalRootUrl(typeof window !== "undefined" ? window.location.origin : undefined);
		return {
			meta: [
				{
					title: "Resume Writing Guides (2025) — Free, Step-by-Step | Craftisle Resume",
				},
				{
					name: "description",
					content:
						"Free, step-by-step resume writing guides: how to write a resume, ATS optimization, resumes with no experience, formats and more. Learn and build in minutes.",
				},
				{
					name: "keywords",
					content: "resume guide, how to write a resume, ATS resume, resume tips, free resume help",
				},
				{
					name: "robots",
					content: "index, follow, max-image-preview:large",
				},
			],
			links: [{ rel: "canonical", href: `${canonicalUrl}guides` }],
		};
	},
});

function GuidesHubPage() {
	const locale = getLocale();
	const isZh = locale.startsWith("zh");
	const canonicalUrl = getCanonicalRootUrl(typeof window !== "undefined" ? window.location.origin : undefined);

	useEffect(() => {
		document.title = isZh
			? "简历写作指南（2025）— 免费、循序渐进 | Craftisle Resume"
			: "Resume Writing Guides (2025) — Free, Step-by-Step | Craftisle Resume";

		const existingLd = document.getElementById("guides-hub-jsonld");
		if (existingLd) existingLd.remove();

		const faqItems = [
			{
				question: "Are these resume guides free?",
				answer:
					"Yes. All guides are free to read and include actionable, step-by-step instructions you can apply to your resume immediately.",
			},
			{
				question: "Which guide should I read first?",
				answer:
					"Start with 'How to Write a Resume' for the full process, then 'How to Make Your Resume ATS-Friendly' to avoid the most common rejections.",
			},
			{
				question: "Do the guides include templates?",
				answer:
					"Each guide links to free, ATS-friendly templates you can open in the builder — browse them on our templates page.",
			},
			{
				question: "Are the tips up to date for 2025?",
				answer:
					"Yes. Our guides are written for 2025 hiring trends, including AI scoring by modern ATS and current recruiter expectations.",
			},
			{
				question: "Can I use the guides with no work experience?",
				answer:
					"Absolutely — we have a dedicated guide for writing a resume with no experience, plus templates for students and recent graduates.",
			},
		];

		const jsonLd = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": `${canonicalUrl}guides`,
					name: "Resume Writing Guides (2025)",
					description:
						"Free, step-by-step resume writing guides covering how to write a resume, ATS optimization, and more.",
					url: `${canonicalUrl}guides`,
					isPartOf: {
						"@type": "WebSite",
						name: "Craftisle Resume",
						url: canonicalUrl,
					},
					breadcrumb: { "@type": "BreadcrumbList", "@id": `${canonicalUrl}guides#breadcrumb` },
				},
				{
					"@type": "BreadcrumbList",
					"@id": `${canonicalUrl}guides#breadcrumb`,
					itemListElement: [
						{ "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl },
						{ "@type": "ListItem", position: 2, name: "Guides", item: `${canonicalUrl}guides` },
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
		script.id = "guides-hub-jsonld";
		script.textContent = JSON.stringify(jsonLd);
		document.head.appendChild(script);
	}, [isZh, canonicalUrl]);

	return (
		<main className="container mx-auto px-4 py-12 sm:px-6 lg:px-12">
			{/* Breadcrumb */}
			<nav aria-label="breadcrumb" className="mb-6 flex items-center gap-2 text-gray-500 text-sm">
				<a href="/" className="hover:text-blue-600">
					Home
				</a>
				<span>→</span>
				<span className="text-gray-900 dark:text-gray-100">Guides</span>
			</nav>

			<header className="mb-10">
				<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
					{isZh ? "简历写作指南" : "Resume Writing Guides"}
				</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					{isZh
						? "免费、循序渐进的简历写作指南，帮助你通过 ATS 筛选、写出打动招聘官的简历，然后免费制作。"
						: "Free, step-by-step guides to write a resume that passes ATS and impresses recruiters — then build it for free."}
				</p>
			</header>

			<section className="mx-auto mb-10 max-w-3xl">
				<h2 className="mb-4 font-semibold text-xl">{isZh ? "如何用好这些指南" : "How to use these guides"}</h2>
				<p className="text-muted-foreground">
					{isZh
						? "每篇指南都聚焦于简历写作的一个关键环节：从整体结构、ATS 优化，到无经验简历与格式选择。建议先读完对应指南，再打开模板页选用免费模板，在 Craftisle Resume 制作器中边学边写。"
						: "Each guide focuses on one key part of resume writing — from overall structure and ATS optimization to no-experience resumes and format choice. Read the relevant guide, then open a free template and build it in the Craftisle Resume editor as you learn."}
				</p>
			</section>

			<div className="grid gap-6 md:grid-cols-2">
				{guides.map((guide) => (
					<Link
						key={guide.slug}
						to="/guides/$slug"
						params={{ slug: guide.slug }}
						className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
					>
						<h2 className="mb-2 font-semibold text-xl">{guide.title}</h2>
						<p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">{guide.description}</p>
						<span className="mt-4 inline-flex items-center gap-1 font-medium text-blue-600 text-sm">
							{isZh ? "阅读指南 →" : "Read Guide →"}
						</span>
					</Link>
				))}
			</div>

			{/* FAQ section (rendered for crawlers/users; mirrors FAQPage JSON-LD) */}
			<section className="mx-auto mt-14 max-w-3xl">
				<h2 className="mb-6 font-bold text-2xl">{isZh ? "常见问题" : "Frequently Asked Questions"}</h2>
				<dl className="space-y-6">
					<dt className="font-semibold">{isZh ? "这些简历指南是免费的吗？" : "Are these resume guides free?"}</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "是的。所有指南都可免费阅读，包含可立即应用到简历上的、循序渐进的操作说明。"
							: "Yes. All guides are free to read and include actionable, step-by-step instructions you can apply to your resume immediately."}
					</dd>
					<dt className="font-semibold">{isZh ? "我应该先读哪一篇？" : "Which guide should I read first?"}</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "先从《如何写一份简历》了解完整流程，再读《如何让简历通过 ATS 筛选》以避免最常见的被拒原因。"
							: "Start with 'How to Write a Resume' for the full process, then 'How to Make Your Resume ATS-Friendly' to avoid the most common rejections."}
					</dd>
					<dt className="font-semibold">{isZh ? "指南里包含模板吗？" : "Do the guides include templates?"}</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "每篇指南都链接到免费的、ATS 友好的模板，可在制作器中直接打开——在模板页浏览它们。"
							: "Each guide links to free, ATS-friendly templates you can open in the builder — browse them on our templates page."}
					</dd>
					<dt className="font-semibold">{isZh ? "这些建议针对 2025 年吗？" : "Are the tips up to date for 2025?"}</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "是的。我们的指南基于 2025 年的招聘趋势撰写，包括现代 ATS 的 AI 评分与当前招聘官的期望。"
							: "Yes. Our guides are written for 2025 hiring trends, including AI scoring by modern ATS and current recruiter expectations."}
					</dd>
					<dt className="font-semibold">
						{isZh ? "没有工作经验也能用吗？" : "Can I use the guides with no work experience?"}
					</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "当然——我们有一篇专门讲解无经验简历的指南，并为学生和应届毕业生提供相应模板。"
							: "Absolutely — we have a dedicated guide for writing a resume with no experience, plus templates for students and recent graduates."}
					</dd>
				</dl>
			</section>

			{/* Internal links to build the content silo */}
			<section className="mt-14 rounded-2xl bg-blue-50 p-8 text-center dark:bg-blue-900/20">
				<h2 className="mb-4 font-bold text-2xl">{isZh ? "需要一份专业简历？" : "Need a Professional Resume?"}</h2>
				<p className="mb-6 text-gray-600 dark:text-gray-300">
					{isZh
						? "用 Craftisle Resume 的 12+ 个 ATS 友好模板，免费制作专业简历。也可查看我们的免费资源。"
						: "Use Craftisle Resume's 12+ ATS-friendly templates to build a professional resume for free. Or explore our free resources."}
				</p>
				<div className="flex flex-wrap justify-center gap-3">
					<Link
						to="/"
						className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
					>
						{isZh ? "免费制作简历" : "Build Your Resume — Free"}
					</Link>
					<Link
						to="/templates/"
						className="inline-block rounded-lg border border-blue-600 px-8 py-3 font-medium text-blue-600 transition hover:bg-blue-600/10"
					>
						{isZh ? "浏览模板" : "Browse Templates"}
					</Link>
					<Link
						to="/resources/"
						className="inline-block rounded-lg border border-blue-600 px-8 py-3 font-medium text-blue-600 transition hover:bg-blue-600/10"
					>
						{isZh ? "免费资源" : "Free Resources"}
					</Link>
				</div>
			</section>
		</main>
	);
}
