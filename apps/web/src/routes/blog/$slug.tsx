import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { getLocale } from "@/libs/locale";

// Blog post full content
const blogContent: Record<string, { title: string; titleZh: string; date: string; body: string; bodyZh: string }> = {
	"how-to-write-a-resume-in-2026": {
		title: "How to Write a Resume in 2026 (Step-by-Step Guide)",
		titleZh: "如何在2026年撰写简历（逐步指南）",
		date: "2026-06-18",
		body: `
## Why 2026 Is Different

Applicant Tracking Systems (ATS) now use AI to score resumes before a human ever sees them. Here's how to pass.

## 1. Use ATS-Friendly Formatting

- Avoid tables, text boxes, headers/footers
- Use standard section headings: "Work Experience", "Education", "Skills"
- Save as .docx or PDF (never .pages)

## 2. Add a Skills Section with Keywords

Match 80% of the job description keywords. if the job says "Python", "SQL", "Project Management" — make sure those words appear in your resume.

## 3. Quantify Your Achievements

Bad: "Responsible for managing a team"
Good: "Managed a 12-person engineering team, delivering 3 major features on schedule"

## 4. Use a Professional Template

Craftisle Resume offers 12+ ATS-friendly templates. Pick one and start building.

## 5. Proofread Like Your Job Depends on It

76% of recruiters will reject a resume with a single typo. Use our AI-powered suggestions to catch errors.
    `.trim(),
		bodyZh: `
## 为什么2026年不同

申请人跟踪系统（ATS）现在使用AI在人工看到简历之前就对其进行评分。以下是如何通过的方法。

## 1. 使用ATS友好的格式

- 避免使用表格、文本框、页眉/页脚
- 使用标准章节标题："工作经验"、"教育背景"、"技能"
- 保存为 .docx 或 PDF（切勿使用 .pages）

## 2. 添加带关键词的技能章节

匹配职位描述中80%的关键词。如果职位要求"Python"、"SQL"、"项目管理"——确保这些词出现在你的简历中。

## 3. 量化你的成就

差的写法："负责管理一个团队"
好的写法："管理一个12人的工程团队，按时交付3个主要特性"

## 4. 使用专业模板

Craftisle Resume 提供12+个ATS友好的模板。选择一个并开始制作。

## 5. 像工作取决于它一样校对

76%的招聘人员会拒绝有错别字的简历。使用我们的AI驱动建议来捕捉错误。
    `.trim(),
	},
	"10-ats-friendly-resume-tips": {
		title: "10 ATS-Friendly Resume Tips That Will Get You Hired",
		titleZh: "10个ATS友好的简历技巧，帮你获得工作",
		date: "2026-06-15",
		body: `
## 1. Use Standard File Formats

PDF is safe. .docx is ok. Image files get rejected.

## 2. No Headers or Footers

ATS can't read them reliably. Put contact info in the main body.

## 3. Use Standard Fonts

Arial, Calibri, Times New Roman. Fancy fonts get misread.

## 4. No Text Boxes or Tables

ATS parsers struggle with positioned elements. Use standard paragraphs.

## 5. Include a Skills Section

List 8-12 relevant skills. Match the job description.

## 6. Use Reverse-Chronological Order

Most recent job first. It's what recruiters expect.

## 7. No Abreviations (Unless Standard)

"Manageer" not "Mgr". "January" not "Jan".

## 8. Spell Out Acronyms on First Use

"Artificial Intelligence (AI)" on first mention.

## 9. Save File with Your Name

"John_Smith_Resume_2026.pdf" — recruiters will thank you.

## 10. Test Your Resume

Upload to a free ATS checker before applying. Fix any parsing errors.
    `.trim(),
		bodyZh: `
## 1. 使用标准文件格式

PDF是安全的。.docx也可以。图片文件会被拒绝。

## 2. 不要使用页眉或页脚

ATS无法可靠地读取它们。将联系信息放在正文中。

## 3. 使用标准字体

Arial、Calibri、Times New Roman。花哨的字体会被误读。

## 4. 不要使用文本框或表格

ATS解析器难以处理定位元素。使用标准段落。

## 5. 包含技能章节

列出8-12项相关技能。匹配职位描述。

## 6. 使用倒序时间顺序

最近的工作在前。这是招聘人员期望的。

## 7. 不要使用缩写（除非是标准缩写）

"经理"而不是"Mgr"。"一月"而不是"Jan"。

## 8. 首次使用时拼写完整的首字母缩略词

首次提及时使用"人工智能（AI）"。

## 9. 用你的名字保存文件

"John_Smith_Resume_2026.pdf"——招聘人员会感谢你。

## 10. 测试你的简历

在申请之前上传到免费的ATS检查器。修复任何解析错误。
    `.trim(),
	},
	"resume-templates-for-software-engineers": {
		title: "Best Resume Templates for Software Engineers (2026)",
		titleZh: "软件工程师最佳简历模板（2026）",
		date: "2026-06-10",
		body: `
## What Recruiters Want to See

- **Technical Skills Section**: List languages, frameworks, tools
- **Projects Section**: Link to GitHub, demo sites
- **Metrics**: "Improved API response time by 40%"

## Template Recommendations

### 1. Clean & Minimal
Best for: Senir engineers, architect roles
Features: Two-column layout, skills sidebar

### 2. Modern Developer
Best for: Full-stack, frontend engineers  
Features: Project showcase, GitHub activity chart

### 3. ATS-Optimized
Best for: Applying to large companies
Features: Simple formatting, standard section order

## Key Tips for Engineers

1. **Include GitHub/LinkedIn links** in contact info
2. **List certifications** (AWS, Google Cloud, etc.)
3. **Show impact**, not just responsibilities
4. **Tailor for each application** — tweak skills section to match job description

## Build Your Engineering Resume Now

Craftisle Resume's templates are ATS-optimized and developer-friendly. Start building for free.
    `.trim(),
		bodyZh: `
## 招聘人员想看到什么

- **技术技能章节**：列出语言、框架、工具
- **项目章节**：链接到GitHub、演示站点
- **指标**："将API响应时间提高了40%"

## 模板推荐

### 1. 简洁极简
最适合：高级工程师、架构师角色
特点：双栏布局、技能侧边栏

### 2. 现代开发者
最适合：全栈、前端工程师
特点：项目展示、GitHub活动图表

### 3. ATS优化
最适合：申请大公司
特点：简单格式、标准章节顺序

## 工程师关键技巧

1. **在联系信息中包含GitHub/LinkedIn链接**
2. **列出认证**（AWS、Google Cloud等）
3. **展示影响力**，而不仅仅是职责
4. **为每个申请定制**——调整技能章节以匹配职位描述

## 立即构建你的工程简历

Craftisle Resume的模板经过ATS优化且对开发者友好。免费开始构建。
    `.trim(),
	},
	"free-resume-checklist-2026": {
		title: "Free Resume Checklist 2026 (Downloadable PDF)",
		titleZh: "免费简历检查清单2026（可下载PDF）",
		date: "2026-06-18",
		body: `
## Before You Hit "Submit" — Check These 25 Items

### Contact Info
- [ ] Name (prominent, top of page)
- [ ] Phone (with country code)
- [ ] Email (professional, not "partygirl@...")
- [ ] LinkedIn URL
- [ ] GitHub/Portfolio URL (for tech roles)

### Formatting
- [ ] Saved as PDF (not .docx for ATS)
- [ ] Standard font (Arial, Calibri, Times New Roman)
- [ ] 11-12pt font size
- [ ] No headers/footers
- [ ] No text boxes or tables
- [ ] Margins: 0.5-1 inch
- [ ] Consistent formatting (dates, bullets, spacing)

### Content
- [ ] Reverse-chronological order
- [ ] No typos (run spell-check)
- [ ] Quantified achievements ("Increased sales by 30%" not "Responsible for sales")
- [ ] Action verbs (Managed, Built, Led — not "Responsible for")
- [ ] Tailored to job description (80% keyword match)
- [ ] No personal pronouns ("I", "me", "my")
- [ ] No irrelevant info (hobbies, religion, age)

### ATS Optimization
- [ ] Standard section headings: "Work Experience", "Education", "Skills"
- [ ] No images or icons (ATS can't read them)
- [ ] No abbreviations without spelling out first ("Artificial Intelligence (AI)")
- [ ] File name: "FirstName_LastName_Resume_2026.pdf"

## Download Our Free Checklist

Craftisle Resume users can export a pre-checked PDF. Build your resume now — it's free.
    `.trim(),
		bodyZh: `
## 在点击"提交"之前——检查这25个项目

### 联系信息
- [ ] 姓名（醒目，页面顶部）
- [ ] 电话（含国家代码）
- [ ] 邮箱（专业的，不要用"partygirl@..."）
- [ ] LinkedIn URL
- [ ] GitHub/作品集 URL（技术岗位）

### 格式
- [ ] 保存为PDF（ATS不要用.docx）
- [ ] 标准字体（Arial、Calibri、Times New Roman）
- [ ] 11-12pt 字号
- [ ] 无页眉/页脚
- [ ] 无文本框或表格
- [ ] 页边距：0.5-1英寸
- [ ] 格式一致（日期、项目符号、间距）

### 内容
- [ ] 倒序时间顺序
- [ ] 无错别字（运行拼写检查）
- [ ] 量化成就（"销售额提高30%"而不是"负责销售"）
- [ ] 行为动词（管理、构建、领导——不是"负责"）
- [ ] 针对职位描述定制（80%关键词匹配）
- [ ] 无个人代词（"我"、"我的"）
- [ ] 无无关信息（爱好、宗教、年龄）

### ATS优化
- [ ] 标准章节标题："工作经验"、"教育背景"、"技能"
- [ ] 无图片或图标（ATS无法读取）
- [ ] 缩写首次使用时拼写完整（"人工智能（AI）"）
- [ ] 文件名："姓_名_简历_2026.pdf"

## 下载我们的免费检查清单

Craftisle Resume 用户可以导出预检查的PDF。立即制作你的简历——完全免费。
    `.trim(),
	},
	"how-to-download-resume-as-pdf-free": {
		title: "How to Download Your Resume as PDF for Free",
		titleZh: "如何免费将简历下载为PDF",
		date: "2026-06-16",
		body: `
## Why PDF Is the Safe Choice

- **Formatting stays intact** — Word docs can shift layout between computers
- **ATS-friendly** — most parsers prefer PDF
- **Professional** — recruiters expect PDF

## Step-by-Step: Export from Craftisle Resume

1. **Open your resume** in the [Craftisle Resume builder](/)
2. **Click "Export"** or "Download PDF"
3. **Choose "ATS-friendly" mode** (no text boxes, no headers)
4. **Save with your name** — \`FirstName_LastName_Resume_2026.pdf\`
5. **Test it** — open the PDF on your phone to check formatting

## Common PDF Export Issues (and Fixes)

### Issue 1: Formatting Looks Wrong
**Fix**: Use a standard template (no fancy layouts). Craftisle's templates are ATS-optimized.

### Issue 2: File Size Too Large
**Fix**: Compress images before uploading. Aim for < 2MB.

### Issue 3: Fonts Not Embedded
**Fix**: Use standard fonts (Arial, Calibri). Craftisle handles this automatically.

### Issue 4: Can't Click Hyperlinks
**Fix**: Some ATS strip links — that's normal. Include the full URL in text too.

## Pro Tips

- **Always keep a .docx backup** (in case an employer asks)
- **Name your file properly** — recruiters download 100+ resumes, make yours findable
- **Test on mobile** — many recruiters review on phones

## Start Building Now

Craftisle Resume lets you export to PDF for free. No paywall, no watermark.
    `.trim(),
		bodyZh: `
## 为什么PDF是安全的选择

- **格式保持不变**——Word文档在不同电脑间可能布局错乱
- **ATS友好**——大多数解析器更喜欢PDF
- **专业**——招聘人员期望收到PDF

## 分步指南：从Craftisle Resume导出

1. **打开你的简历**在[Craftisle Resume制作器](/)中
2. **点击"导出"**或"下载PDF"
3. **选择"ATS友好"模式**（无文本框，无页眉）
4. **用你的名字保存**——\`姓_名_简历_2026.pdf\`
5. **测试它**——在手机上打开PDF检查格式

## 常见PDF导出问题（及修复方法）

### 问题1：格式看起来不对
**修复**：使用标准模板（无花哨布局）。Craftisle的模板经过ATS优化。

### 问题2：文件大小过大
**修复**：上传前压缩图片。目标<2MB。

### 问题3：字体未嵌入
**修复**：使用标准字体（Arial、Calibri）。Craftisle自动处理这一点。

### 问题4：无法点击超链接
**修复**：有些ATS会去除链接——这很正常。同时在文本中包含完整URL。

## 专业技巧

- **始终保留.docx备份**（以防雇主要求）
- **正确命名你的文件**——招聘人员下载100+份简历，让你的容易被找到
- **在手机上测试**——许多招聘人员在手机上审阅

## 立即开始制作

Craftisle Resume让你免费导出PDF。无付费墙，无水印。
    `.trim(),
	},
};

export const Route = createFileRoute("/blog/$slug")({
	component: BlogPostPage,
});

function BlogPostPage() {
	const { slug } = Route.useParams();
	const locale = getLocale();
	const isZh = locale.startsWith("zh");
	const post = blogContent[slug];

	useEffect(() => {
		document.title = post
			? `${post[isZh ? "titleZh" : "title"]} — Craftisle Resume Blog`
			: "Post Not Found — Craftisle Resume";
	}, [post, isZh]);

	if (!post) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-12 text-center">
				<h1 className="mb-4 font-bold text-4xl">404 — Post Not Found</h1>
				<p className="mb-6">Sorry, that blog post doesn't exist.</p>
				<a href="/blog" className="text-blue-600 hover:underline">
					← Back to Blog
				</a>
			</div>
		);
	}

	const title = isZh ? post.titleZh : post.title;
	const body = isZh ? post.bodyZh : post.body;

	// Simple markdown-like renderer for body content
	const renderBody = (text: string) =>
		text.split("\n").map((line, i) => {
			if (line.startsWith("## ")) {
				return (
					<h2 key={i} className="mt-8 mb-4 font-bold text-2xl">
						{line.replace("## ", "")}
					</h2>
				);
			}
			if (line.startsWith("### ")) {
				return (
					<h3 key={i} className="mt-6 mb-3 font-semibold text-xl">
						{line.replace("### ", "")}
					</h3>
				);
			}
			if (line.startsWith("- ")) {
				return (
					<li key={i} className="ml-6 list-disc">
						{line.replace("- ", "")}
					</li>
				);
			}
			if (line.trim() === "") return <br key={i} />;
			return (
				<p key={i} className="mb-4 leading-relaxed">
					{line}
				</p>
			);
		});

	return (
		<article className="mx-auto max-w-3xl px-4 py-12">
			<a href="/blog" className="mb-6 inline-block text-blue-600 text-sm hover:underline">
				← {isZh ? "返回博客列表" : "Back to Blog"}
			</a>
			<header className="mb-8">
				<time className="text-gray-500 text-sm">
					{new Date(post.date).toLocaleDateString(isZh ? "zh-CN" : "en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</time>
				<h1 className="mt-2 mb-4 font-bold text-4xl">{title}</h1>
			</header>
			<div className="prose prose-lg dark:prose-invert max-w-none">{renderBody(body)}</div>
			<footer className="mt-12 border-gray-200 border-t pt-8 dark:border-gray-700">
				<p className="text-gray-500 text-sm">
					{isZh ? "使用" : "Start building your resume with "}
					<a href="/" className="text-blue-600 hover:underline">
						Craftisle Resume
					</a>
					{isZh ? "开始制作你的简历吧。" : " — it's free."}
				</p>
			</footer>
		</article>
	);
}
