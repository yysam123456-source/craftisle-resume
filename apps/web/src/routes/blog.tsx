import { createFileRoute, Link } from "@tanstack/react-router";
import { getLocale } from "@/libs/locale";

// Blog post list (import from JSON)
const blogPosts = [
	{
		slug: "how-to-write-a-resume-in-2026",
		title: "How to Write a Resume in 2026 (Step-by-Step Guide)",
		titleZh: "如何在2026年撰写简历（逐步指南）",
		excerpt: "Learn the latest resume writing trends, ATS optimization tips, and formatting best practices for 2026.",
		excerptZh: "了解最新的简历写作趋势、ATS优化技巧和2026年的格式最佳实践。",
		date: "2026-06-18",
		tags: ["resume tips", "ATS", "2026"],
	},
	{
		slug: "10-ats-friendly-resume-tips",
		title: "10 ATS-Friendly Resume Tips That Will Get You Hired",
		titleZh: "10个ATS友好的简历技巧，帮你获得工作",
		excerpt: "Applicant Tracking Systems reject 75% of resumes. Make sure yours passes with these proven tips.",
		excerptZh: "申请人跟踪系统会拒绝75%的简历。用这些经过验证的技巧确保你的简历能通过。",
		date: "2026-06-15",
		tags: ["ATS", "resume tips", "hiring"],
	},
	{
		slug: "resume-templates-for-software-engineers",
		title: "Best Resume Templates for Software Engineers (2026)",
		titleZh: "软件工程师最佳简历模板（2026）",
		excerpt: "Stand out to tech recruiters with these developer-focused resume templates and examples.",
		excerptZh: "用这些面向开发者的简历模板和示例，在技术招聘人员中脱颖而出。",
		date: "2026-06-10",
		tags: ["software engineer", "templates", "tech"],
	},
	{
		slug: "free-resume-checklist-2026",
		title: "Free Resume Checklist 2026 (Downloadable PDF)",
		titleZh: "免费简历检查清单2026（可下载PDF）",
		excerpt: "Don't submit your resume without checking these 25 critical items. Download our free checklist.",
		excerptZh: "在提交简历之前，务必检查这25个关键项目。下载我们的免费检查清单。",
		date: "2026-06-18",
		tags: ["checklist", "free resource", "PDF"],
	},
	{
		slug: "how-to-download-resume-as-pdf-free",
		title: "How to Download Your Resume as PDF for Free",
		titleZh: "如何免费将简历下载为PDF",
		excerpt: "Step-by-step guide to exporting your resume as a PDF file, with tips for ATS-friendly formatting.",
		excerptZh: "将简历导出为PDF文件的分步指南，以及ATS友好格式的技巧。",
		date: "2026-06-16",
		tags: ["PDF", "export", "free"],
	},
	{
		slug: "100-action-verbs-for-resume",
		title: "100+ Action Verbs for Your Resume (By Category)",
		titleZh: "100+ 简历行动动词（按类别）",
		excerpt:
			"Replace 'responsible for' with these power verbs that recruiters actually notice. Sorted by job function.",
		excerptZh: "用这些招聘人员真正注意到的强力动词替换'负责'。按职位职能分类。",
		date: "2026-06-18",
		tags: ["action verbs", "writing tips", "vocabulary"],
	},
	{
		slug: "resume-length-guide-2026",
		title: "How Long Should a Resume Be? (2026 Guide)",
		titleZh: "简历应该多长？（2026指南）",
		excerpt: "One page or two? The answer depends on your experience level. Here's the data-backed answer.",
		excerptZh: "一页还是两页？答案取决于你的经验水平。这是有数据支持的答案。",
		date: "2026-06-17",
		tags: ["resume length", "formatting", "2026"],
	},
	{
		slug: "how-to-write-a-cover-letter",
		title: "How to Write a Cover Letter That Gets Noticed",
		titleZh: "如何写一封引人注目的求职信",
		excerpt: "Most cover letters get skimmed in 6 seconds. Here's how to make yours impossible to ignore.",
		excerptZh: "大多数求职信在6秒内被浏览。这里教你如何让您的求职信无法被忽视。",
		date: "2026-06-16",
		tags: ["cover letter", "application", "writing tips"],
	},
	{
		slug: "linkedin-profile-optimization-2026",
		title: "LinkedIn Profile Optimization Guide (2026)",
		titleZh: "LinkedIn资料优化指南（2026）",
		excerpt: "75% of recruiters check LinkedIn before interviewing. Optimize your profile with these 10 tactics.",
		excerptZh: "75%的招聘人员会在面试前查看LinkedIn。用这10种策略优化你的个人资料。",
		date: "2026-06-15",
		tags: ["LinkedIn", "personal branding", "networking"],
	},
	{
		slug: "job-search-timeline-how-long",
		title: "Job Search Timeline: How Long Does It Take?",
		titleZh: "求职时间表：需要多长时间？",
		excerpt: "The average job search takes 3-6 months. Here's a realistic timeline plus how to speed it up.",
		excerptZh: "平均求职需要3-6个月。这是现实的时间表，以及如何加速的方法。",
		date: "2026-06-14",
		tags: ["job search", "timeline", "career advice"],
	},
];

export const Route = createFileRoute("/blog")({
	component: BlogListPage,
});

function BlogListPage() {
	const locale = getLocale();
	const isZh = locale.startsWith("zh");

	return (
		<div className="mx-auto max-w-3xl px-4 py-12">
			<header className="mb-12 text-center">
				<h1 className="mb-4 font-bold text-4xl">{isZh ? "简历写作博客" : "Resume Writing Blog"}</h1>
				<p className="text-gray-500 text-lg dark:text-gray-400">
					{isZh ? "专业的简历写作技巧和职业建议" : "Expert resume writing tips and career advice"}
				</p>
			</header>

			<div className="space-y-8">
				{blogPosts.map((post) => (
					<article
						key={post.slug}
						className="rounded-lg border border-gray-200 p-6 transition hover:shadow-lg dark:border-gray-700"
					>
						<time className="text-gray-500 text-sm">
							{new Date(post.date).toLocaleDateString(isZh ? "zh-CN" : "en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</time>
						<h2 className="mt-2 mb-3 font-semibold text-2xl">
							<Link to="/blog/$slug" params={{ slug: post.slug }} className="transition hover:text-blue-600">
								{isZh ? post.titleZh : post.title}
							</Link>
						</h2>
						<p className="mb-4 text-gray-600 dark:text-gray-300">{isZh ? post.excerptZh : post.excerpt}</p>
						<div className="flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span key={tag} className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
									{tag}
								</span>
							))}
						</div>
					</article>
				))}
			</div>
		</div>
	);
}
