import { createFileRoute, Link } from "@tanstack/react-router";
import { getLocale } from "@/libs/locale";

const resources = [
	{
		slug: "resume-checklist",
		title: "2026 Resume Checklist (25-Point Audit)",
		titleZh: "2026年简历清单（25点核查）",
		excerpt:
			"Tick every box before you hit 'Apply'. A free interactive checklist to ensure your resume is ATS-ready and recruiter-approved.",
		excerptZh: "在点击'申请'之前勾选每个框。免费的互动清单，确保你的简历符合ATS标准并通过招聘人员审核。",
		difficulty: "Free Tool",
		time: "5 min",
	},
	{
		slug: "salary-negotiation",
		title: "Salary Negotiation Guide 2026",
		titleZh: "薪资谈判指南 2026",
		excerpt: "Make sure your compensation matches market rate before signing. Includes scripts & tactics.",
		excerptZh: "在签署offer之前，确保你的薪资达到市场水平。包含话术和技巧。",
		difficulty: "Guide",
		time: "10 min read",
	},
];

export const Route = createFileRoute("/resources/")({
	component: ResourcesPage,
});

function ResourcesPage() {
	const locale = getLocale();
	const isZh = locale.startsWith("zh");

	return (
		<div className="mx-auto max-w-4xl px-4 py-12">
			<header className="mb-12 text-center">
				<h1 className="mb-4 font-bold text-4xl">{isZh ? "免费简历资源" : "Free Resume Resources"}</h1>
				<p className="text-gray-500 text-lg dark:text-gray-400">
					{isZh
						? "下载清单、阅读指南，免费提升你的求职竞争力。"
						: "Download checklists, read guides, and boost your job search — for free."}
				</p>
			</header>

			<div className="grid gap-6 md:grid-cols-2">
				{resources.map((resource) => (
					<Link
						key={resource.slug}
						to="/resources/$slug"
						params={{ slug: resource.slug }}
						className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="mb-3 flex items-center gap-2 text-blue-600 text-sm">
							<span className="rounded-full bg-blue-50 px-3 py-1 dark:bg-blue-900/30">{resource.difficulty}</span>
							<span className="text-gray-400">·</span>
							<span className="text-gray-500">{resource.time}</span>
						</div>
						<h2 className="mb-2 font-semibold text-xl">{isZh ? resource.titleZh : resource.title}</h2>
						<p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">
							{isZh ? resource.excerptZh : resource.excerpt}
						</p>
						<span className="mt-4 inline-flex items-center gap-1 font-medium text-blue-600 text-sm">
							{isZh ? "查看详情 →" : "View Resource →"}
						</span>
					</Link>
				))}
			</div>

			<section className="mt-16 rounded-2xl bg-blue-50 p-8 text-center dark:bg-blue-900/20">
				<h2 className="mb-4 font-bold text-2xl">{isZh ? "需要专业简历吗？" : "Need a Professional Resume?"}</h2>
				<p className="mb-6 text-gray-600 dark:text-gray-300">
					{isZh
						? "用 Craftisle Resume 的 12+ 个 ATS 友好模板，免费制作专业简历。"
						: "Use Craftisle Resume's 12+ ATS-friendly templates to build a professional resume for free."}
				</p>
				<Link
					to="/"
					className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
				>
					{isZh ? "免费制作简历" : "Build Your Resume — Free"}
				</Link>
			</section>
		</div>
	);
}
