import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLocale } from "@/libs/locale";

// Resume checklist items
const checklistItems = [
	// Contact Info
	{ id: "name", category: "contact", en: "Full name (prominent, top of page)", zh: "完整姓名（醒目，页面顶部）" },
	{ id: "phone", category: "contact", en: "Phone number (with country code)", zh: "电话号码（含国家代码）" },
	{ id: "email", category: "contact", en: "Professional email (not nickname)", zh: "专业邮箱（不要用昵称）" },
	{ id: "linkedin", category: "contact", en: "LinkedIn profile URL", zh: "LinkedIn 个人资料 URL" },
	{
		id: "github",
		category: "contact",
		en: "GitHub/portfolio URL (for tech roles)",
		zh: "GitHub/作品集 URL（技术岗位）",
	},
	// Formatting
	{
		id: "length",
		category: "formatting",
		en: "Length: 1-2 pages (max 3 for senior)",
		zh: "长度：1-2页（高级岗位最多3页）",
	},
	{
		id: "font",
		category: "formatting",
		en: "Font: Arial, Calibri, Times New Roman (10-12pt)",
		zh: "字体：Arial、Calibri、Times New Roman（10-12pt）",
	},
	{ id: "margins", category: "formatting", en: "Margins: 0.5-1 inch on all sides", zh: "页边距：四周 0.5-1 英寸" },
	{ id: "spacing", category: "formatting", en: "Line spacing: 1.15-1.5", zh: "行距：1.15-1.5" },
	{
		id: "headers",
		category: "formatting",
		en: "No headers/footers (ATS can't read them)",
		zh: "无页眉/页脚（ATS无法读取）",
	},
	{
		id: "tables",
		category: "formatting",
		en: "No tables or text boxes (use standard paragraphs)",
		zh: "无表格或文本框（使用标准段落）",
	},
	// Content
	{
		id: "reverse-chrono",
		category: "content",
		en: "Reverse-chronological order (most recent first)",
		zh: "倒序时间顺序（最近的在前）",
	},
	{ id: "no-pronouns", category: "content", en: "No personal pronouns (I, me, my)", zh: "无个人代词（我、我的）" },
	{
		id: "action-verbs",
		category: "content",
		en: "Start bullets with action verbs (Managed, Built, Led)",
		zh: "项目符号以行为动词开头（管理、构建、领导）",
	},
	{
		id: "quantified",
		category: "content",
		en: "Quantified achievements (Improved X by Y%)",
		zh: "量化成就（将X提高了Y%）",
	},
	{
		id: "no-responsibilities",
		category: "content",
		en: "No vague responsibilities (show IMPACT, not duties)",
		zh: "无模糊的职责描述（展示影响力，而非任务）",
	},
	{ id: "keywords", category: "content", en: "Keywords match 80% of job description", zh: "关键词匹配职位描述的80%" },
	{
		id: "no-abbz",
		category: "content",
		en: "No abbreviations (unless standard like AI, SQL)",
		zh: "无缩写（除非是标准缩写如 AI、SQL）",
	},
	{
		id: "spell-out",
		category: "content",
		en: "Spell out acronyms on first use",
		zh: "首次使用时拼写完整的首字母缩略词",
	},
	// ATS
	{
		id: "ats-friendly",
		category: "ats",
		en: "Saved as .docx or PDF (never .pages)",
		zh: "保存为 .docx 或 PDF（切勿使用 .pages）",
	},
	{
		id: "standard-headings",
		category: "ats",
		en: "Standard section headings (Work Experience, Education, Skills)",
		zh: "标准章节标题（工作经验、教育背景、技能）",
	},
	{
		id: "no-images",
		category: "ats",
		en: "No images or icons (ATS can't read them)",
		zh: "无图片或图标（ATS无法读取）",
	},
	{ id: "no-text-boxes", category: "ats", en: "No text boxes or shapes", zh: "无文本框或形状" },
	{
		id: "test-ats",
		category: "ats",
		en: "Tested with a free ATS checker before applying",
		zh: "在申请前用免费的ATS检查器测试过",
	},
	// Proofreading
	{
		id: "spell-check",
		category: "proof",
		en: "Spell-checked (76% of recruiters reject typos)",
		zh: "拼写检查（76%的招聘人员会拒绝有错别字的简历）",
	},
	{ id: "grammar-check", category: "proof", en: "Grammar-checked", zh: "语法检查" },
	{
		id: "consistent-formatting",
		category: "proof",
		en: "Consistent formatting (dates, bullets, spacing)",
		zh: "格式一致（日期、项目符号、间距）",
	},
	{
		id: "file-name",
		category: "proof",
		en: 'File named "FirstName_LastName_Resume_2026.pdf"',
		zh: '文件名命名为"姓_名_简历_2026.pdf"',
	},
];

const categories = [
	{ id: "contact", en: "Contact Info", zh: "联系信息" },
	{ id: "formatting", en: "Formatting", zh: "格式" },
	{ id: "content", en: "Content & Achievements", zh: "内容与成就" },
	{ id: "ats", en: "ATS Optimization", zh: "ATS优化" },
	{ id: "proof", en: "Proofreading", zh: "校对" },
];

export const Route = createFileRoute("/resources/resume-checklist")({
	component: ResumeChecklistPage,
});

function ResumeChecklistPage() {
	const locale = getLocale();
	const isZh = locale.startsWith("zh");
	const [checked, setChecked] = useState<Record<string, boolean>>({});

	const toggle = (id: string) => {
		setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const checkedCount = Object.values(checked).filter(Boolean).length;
	const total = checklistItems.length;
	const progress = Math.round((checkedCount / total) * 100);

	useEffect(() => {
		document.title = isZh ? "简历检查清单 — Craftisle Resume" : "Resume Checklist — Craftisle Resume";
	}, [isZh]);

	return (
		<div className="mx-auto max-w-3xl px-4 py-12">
			<header className="mb-8">
				<Link to="/blog" className="mb-4 inline-block text-blue-600 text-sm hover:underline">
					← {isZh ? "返回博客" : "Back to Blog"}
				</Link>
				<h1 className="mt-2 font-bold text-4xl">{isZh ? "免费简历检查清单 2026" : "Free Resume Checklist 2026"}</h1>
				<p className="mt-2 text-gray-500 text-lg dark:text-gray-400">
					{isZh
						? "在提交简历之前，逐一检查这 25 个关键项目。使用我们的免费制作器立即开始制作。"
						: "Check all 25 critical items before submitting your resume. Start building with our free builder now."}
				</p>
			</header>

			{/* Progress bar */}
			<div className="mb-8 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
				<div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
			</div>
			<p className="mb-6 text-center text-gray-500 text-sm">
				{checkedCount} / {total} {isZh ? "项已完成" : "items checked"} ({progress}%)
			</p>

			{/* Checklist by category */}
			<div className="space-y-10">
				{categories.map((cat) => (
					<section key={cat.id}>
						<h2 className="mb-4 font-semibold text-2xl">{isZh ? cat.zh : cat.en}</h2>
						<div className="space-y-3">
							{checklistItems
								.filter((item) => item.category === cat.id)
								.map((item) => (
									<label
										key={item.id}
										className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
									>
										<input
											type="checkbox"
											checked={!!checked[item.id]}
											onChange={() => toggle(item.id)}
											className="mt-1 h-5 w-5 cursor-pointer"
										/>
										<span className={checked[item.id] ? "text-gray-400 line-through" : ""}>
											{isZh ? item.zh : item.en}
										</span>
									</label>
								))}
						</div>
					</section>
				))}
			</div>

			{/* CTA */}
			<div className="mt-12 rounded-2xl bg-blue-50 p-8 text-center dark:bg-blue-900/20">
				<h2 className="mb-4 font-bold text-2xl">{isZh ? "准备好制作你的简历了吗？" : "Ready to Build Your Resume?"}</h2>
				<p className="mb-6 text-gray-600 dark:text-gray-300">
					{isZh
						? "使用 Craftisle Resume 的 12+ 个 ATS 友好模板，免费制作专业简历。"
						: "Use Craftisle Resume's 12+ ATS-friendly templates to build a professional resume for free."}
				</p>
				<Link
					to="/"
					className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
				>
					{isZh ? "免费开始制作" : "Start Building — Free"}
				</Link>
			</div>

			<footer className="mt-12 border-gray-200 border-t pt-8 text-center text-gray-500 text-sm dark:border-gray-700">
				<p>
					{isZh ? "此清单可免费使用。请链接到 " : "This checklist is free to use. Please link to "}
					<a href="https://resume.craftisle.com/resources/resume-checklist" className="text-blue-600 hover:underline">
						https://resume.craftisle.com/resources/resume-checklist
					</a>
					{isZh ? " —— 帮助我们传播！" : " — help us spread the word!"}
				</p>
			</footer>
		</div>
	);
}
