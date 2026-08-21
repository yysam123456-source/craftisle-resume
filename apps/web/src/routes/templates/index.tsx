import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getLocale } from "@/libs/locale";
import { getCanonicalRootUrl } from "@/libs/seo";
import { professions } from "@/libs/seo/professions";

export const Route = createFileRoute("/templates/")({
	component: TemplatesHubPage,
	head: () => {
		const canonicalUrl = getCanonicalRootUrl(typeof window !== "undefined" ? window.location.origin : undefined);
		return {
			meta: [
				{
					title: "Resume Templates by Profession (2025) — Free & ATS-Friendly | Craftisle Resume",
				},
				{
					name: "description",
					content:
						"Browse free, ATS-friendly resume templates for 60+ professions — software, business, healthcare, engineering, creative and more. Pick yours and build in minutes.",
				},
				{
					name: "keywords",
					content: "resume templates, free resume templates, ATS-friendly resume, profession resume templates",
				},
				{
					name: "robots",
					content: "index, follow, max-image-preview:large",
				},
			],
			links: [{ rel: "canonical", href: `${canonicalUrl}templates` }],
		};
	},
});

function TemplatesHubPage() {
	const locale = getLocale();
	const isZh = locale.startsWith("zh");
	const canonicalUrl = getCanonicalRootUrl(typeof window !== "undefined" ? window.location.origin : undefined);

	useEffect(() => {
		document.title = isZh
			? "按职业分类的简历模板（2025）— 免费且 ATS 友好 | Craftisle Resume"
			: "Resume Templates by Profession (2025) — Free & ATS-Friendly | Craftisle Resume";

		const existingLd = document.getElementById("templates-hub-jsonld");
		if (existingLd) existingLd.remove();

		const faqItems = [
			{
				question: "Are Craftisle's resume templates free?",
				answer:
					"Yes — every template is 100% free with no subscription, watermark, or credit card required. Export to PDF, DOCX, or plain text anytime.",
			},
			{
				question: "Are these templates ATS-friendly?",
				answer:
					"All templates use clean, standard formatting that passes Applicant Tracking Systems, so your resume reaches a human recruiter instead of being filtered out.",
			},
			{
				question: "How do I choose the right template for my profession?",
				answer:
					"Pick the template that matches your field from the list below, then customize the pre-written sections. Each template follows resume best practices for that profession.",
			},
			{
				question: "Can I edit the template after downloading?",
				answer:
					"Yes. Your resume is saved in your browser, so you can reopen the builder, edit any section, and re-export whenever you need.",
			},
			{
				question: "Do you have templates for entry-level and career-change resumes?",
				answer:
					"Yes. We cover recent graduates, interns, career changers, and many senior and executive roles — browse the full list below.",
			},
		];

		const jsonLd = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": `${canonicalUrl}templates`,
					name: "Resume Templates by Profession (2025)",
					description:
						"Browse free, ATS-friendly resume templates for 60+ professions and build your resume in minutes.",
					url: `${canonicalUrl}templates`,
					isPartOf: {
						"@type": "WebSite",
						name: "Craftisle Resume",
						url: canonicalUrl,
					},
					breadcrumb: { "@type": "BreadcrumbList", "@id": `${canonicalUrl}templates#breadcrumb` },
				},
				{
					"@type": "BreadcrumbList",
					"@id": `${canonicalUrl}templates#breadcrumb`,
					itemListElement: [
						{ "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl },
						{ "@type": "ListItem", position: 2, name: "Templates", item: `${canonicalUrl}templates` },
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
		script.id = "templates-hub-jsonld";
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
				<span className="text-gray-900 dark:text-gray-100">Templates</span>
			</nav>

			<header className="mb-10">
				<h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
					{isZh ? "按职业分类的简历模板" : "Resume Templates by Profession"}
				</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					{isZh
						? "为 60+ 种职业准备的免费、ATS 友好的简历模板。选择你的行业，几分钟内免费制作专业简历。"
						: "Free, ATS-friendly resume templates for 60+ professions. Pick your field and build a professional resume in minutes — for free."}
				</p>
			</header>

			<section className="mx-auto mb-10 max-w-3xl">
				<h2 className="mb-4 font-semibold text-xl">{isZh ? "如何挑选合适的模板" : "How to pick the right template"}</h2>
				<p className="text-muted-foreground">
					{isZh
						? "选择与你行业匹配的模板，然后自定义预设好的章节。每个模板都遵循该职业的简历最佳实践，使用干净、标准的排版以通过 ATS 筛选。写好后一键导出为 PDF、DOCX 或纯文本。"
						: "Choose the template that matches your field, then customize the pre-written sections. Each template follows resume best practices for that profession, with clean, standard formatting that passes ATS. When you're done, export to PDF, DOCX, or plain text with one click."}
				</p>
			</section>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{professions.map((profession) => (
					<Link
						key={profession.slug}
						to="/templates/$profession"
						params={{ profession: profession.slug }}
						className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
					>
						<h2 className="mb-1 font-semibold text-lg">{isZh ? profession.nameZh : profession.name}</h2>
						<p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">{profession.description}</p>
					</Link>
				))}
			</div>

			{/* FAQ section (rendered for crawlers/users; mirrors FAQPage JSON-LD) */}
			<section className="mx-auto mt-14 max-w-3xl">
				<h2 className="mb-6 font-bold text-2xl">{isZh ? "常见问题" : "Frequently Asked Questions"}</h2>
				<dl className="space-y-6">
					<dt className="font-semibold">
						{isZh ? "Craftisle 的简历模板免费吗？" : "Are Craftisle's resume templates free?"}
					</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "是的——每个模板都 100% 免费，无需订阅、无水印、无需信用卡。随时可导出为 PDF、DOCX 或纯文本。"
							: "Yes — every template is 100% free with no subscription, watermark, or credit card required. Export to PDF, DOCX, or plain text anytime."}
					</dd>
					<dt className="font-semibold">{isZh ? "这些模板对 ATS 友好吗？" : "Are these templates ATS-friendly?"}</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "所有模板都采用干净、标准的排版，能够通过申请人跟踪系统（ATS），让你的简历抵达真人招聘官，而不是被直接过滤掉。"
							: "All templates use clean, standard formatting that passes Applicant Tracking Systems, so your resume reaches a human recruiter instead of being filtered out."}
					</dd>
					<dt className="font-semibold">
						{isZh ? "如何为我的职业选择合适的模板？" : "How do I choose the right template for my profession?"}
					</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "从下面的列表中选择与你行业匹配的模板，再自定义预设好的章节。每个模板都遵循该职业的简历最佳实践。"
							: "Pick the template that matches your field from the list below, then customize the pre-written sections. Each template follows resume best practices for that profession."}
					</dd>
					<dt className="font-semibold">
						{isZh ? "下载后还能编辑吗？" : "Can I edit the template after downloading?"}
					</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "可以。你的简历保存在浏览器中，因此你可以随时重新打开制作器、编辑任意章节并再次导出。"
							: "Yes. Your resume is saved in your browser, so you can reopen the builder, edit any section, and re-export whenever you need."}
					</dd>
					<dt className="font-semibold">
						{isZh ? "有面向应届生和转行的模板吗？" : "Do you have templates for entry-level and career-change resumes?"}
					</dt>
					<dd className="text-muted-foreground">
						{isZh
							? "有。我们覆盖应届毕业生、实习生、转行者，以及许多高级和主管/高管职位——请浏览下方完整列表。"
							: "Yes. We cover recent graduates, interns, career changers, and many senior and executive roles — browse the full list below."}
					</dd>
				</dl>
			</section>

			{/* Internal links to build the content silo */}
			<section className="mt-14 rounded-2xl bg-blue-50 p-8 text-center dark:bg-blue-900/20">
				<h2 className="mb-4 font-bold text-2xl">{isZh ? "需要一份专业简历？" : "Need a Professional Resume?"}</h2>
				<p className="mb-6 text-gray-600 dark:text-gray-300">
					{isZh
						? "用 Craftisle Resume 的 12+ 个 ATS 友好模板，免费制作专业简历。也可阅读我们的指南与免费资源。"
						: "Use Craftisle Resume's 12+ ATS-friendly templates to build a professional resume for free. Or read our guides and free resources."}
				</p>
				<div className="flex flex-wrap justify-center gap-3">
					<Link
						to="/"
						className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
					>
						{isZh ? "免费制作简历" : "Build Your Resume — Free"}
					</Link>
					<Link
						to="/guides/"
						className="inline-block rounded-lg border border-blue-600 px-8 py-3 font-medium text-blue-600 transition hover:bg-blue-600/10"
					>
						{isZh ? "写作指南" : "Writing Guides"}
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
