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
	"100-action-verbs-for-resume": {
		title: "100+ Action Verbs for Your Resume (By Category)",
		titleZh: "100+ 简历行动动词（按类别）",
		date: "2026-06-18",
		body: `
## Why Action Verbs Matter

Resumes with strong action verbs get 40% more interviews. Replace weak phrases like "responsible for" with these power words.

## Leadership & Management

- Directed
- Orchestrated
- Championed
- Spearheaded
- Guided
- Mentored
- Coordinated
- Supervised
- Delegated
- Fostered

## Achieved & Delivered

- Achieved
- Delivered
- Exceeded
- Surpassed
- Attained
- Realized
- Accomplished
- Produced
- Generated
- Yielded

## Communication & Collaboration

- Collaborated
- Partnered
- Negotiated
- Mediated
- Facilitated
- Presented
- Articulated
- Conveyed
- Translated
- Liaised

## Improved & Optimized

- Optimized
- Streamlined
- Simplified
- Redesigned
- Transformed
- Revitalized
- Modernized
- Enhanced
- Upgraded
- Refined

## Created & Built

- Built
- Created
- Designed
- Developed
- Engineered
- Constructed
- Established
- Founded
- Formulated
- Piloted

## Analyzed & Solved

- Analyzed
- Diagnosed
- Evaluated
- Assessed
- Identified
- Resolved
- Troubleshot
- Debugged
- Rectified
- Mitigated

## How to Use These Verbs

**Bad**: "Was responsible for managing a team of 10"
**Good**: "Directed a 10-person engineering team, delivering 3 major features ahead of schedule"

**Bad**: "Helped with social media"
**Good**: "Spearheaded social media strategy, growing followers by 150% in 6 months"

## Pro Tips

1. **Match the verb to the result** — if you improved something, use "Optimized" not just "Managed"
2. **Vary your verbs** — don't use "Managed" 5 times; use "Directed", "Oversaw", "Led"
3. **Put the verb first** — start bullet points with the action verb

## Build Your Resume with Strong Verbs

Craftisle Resume's AI suggestions include power verb recommendations. Start building now — free.
    `.trim(),
		bodyZh: `
## 为什么行动动词很重要

使用强力行动动词的简历获得面试的几率高40%。用这些强力词汇替换"负责"等弱势短语。

## 领导与管理

- 指导（Directed）
- 协调（Orchestrated）
- 倡导（Championed）
- 带头（Spearheaded）
- 引导（Guided）
- 指导（Mentored）
- 协调（Coordinated）
- 监督（Supervised）
- 委派（Delegated）
- 培养（Fostered）

## 达成与交付

- 达成（Achieved）
- 交付（Delivered）
- 超越（Exceeded）
- 超过（Surpassed）
- 获得（Attained）
- 实现（Realized）
- 完成（Accomplished）
- 生产（Produced）
- 生成（Generated）
- 产生（Yielded）

## 沟通与协作

- 协作（Collaborated）
- 合作（Partnered）
- 谈判（Negotiated）
- 调解（Mediated）
- 促进（Facilitated）
- 展示（Presented）
- 清晰表达（Articulated）
- 传达（Conveyed）
- 翻译（Translated）
- 联络（Liaised）

## 改进与优化

- 优化（Optimized）
- 精简（Streamlined）
- 简化（Simplified）
- 重新设计（Redesigned）
- 转型（Transformed）
- 振兴（Revitalized）
- 现代化（Modernized）
- 增强（Enhanced）
- 升级（Upgraded）
- 精炼（Refined）

## 创建与构建

- 构建（Built）
- 创建（Created）
- 设计（Designed）
- 开发（Developed）
- 工程（Engineered）
- 建造（Constructed）
- 建立（Established）
- 创立（Founded）
- 制定（Formulated）
- 试点（Piloted）

## 分析与解决

- 分析（Analyzed）
- 诊断（Diagnosed）
- 评估（Evaluated）
- 评定（Assessed）
- 识别（Identified）
- 解决（Resolved）
- 排查（Troubleshot）
- 调试（Debugged）
- 纠正（Rectified）
- 缓解（Mitigated）

## 如何使用这些动词

**差的写法**："负责管理一个10人团队"
**好的写法**："指导一个10人工程团队，提前交付3个主要特性"

**差的写法**："帮助社交媒体"
**好的写法**："带头社交媒体策略，6个月内粉丝增长150%"

## 专业技巧

1. **动词与结果匹配**——如果你改进了某事，用"优化"而不仅仅是"管理"
2. **变换你的动词**——不要5次都用"管理"；用"指导"、"监督"、"领导"
3. **动词放在第一位**——用行动动词开始项目符号

## 用强力动词构建你的简历

Craftisle Resume的AI建议包含强力动词推荐。立即开始制作——免费。
    `.trim(),
	},
	"resume-length-guide-2026": {
		title: "How Long Should a Resume Be? (2026 Guide)",
		titleZh: "简历应该多长？（2026指南）",
		date: "2026-06-17",
		body: `
## The Short Answer

- **0-5 years experience**: 1 page
- **5-10 years experience**: 1-2 pages
- **10+ years experience**: 2 pages (max)
- **Executives/C-Suite**: 2-3 pages (exception)

## Why One Page Is Usually Better

Recruiters spend 6-8 seconds scanning a resume. A one-page resume forces you to prioritize what matters most.

## When Two Pages Is OK

- You have 10+ years of relevant experience
- You're in a research/academic field (where publications matter)
- You're applying for a senior/executive role
- You have major achievements that can't fit on one page

## What to Cut If You're Over One Page

1. **Old experience** (1990s jobs don't matter)
2. **Irrelevant jobs** (that internship from college if you're now a manager)
3. **Hobbies/interests** (unless directly relevant)
4. **References** ("Available upon request" is implied)
5. **Long paragraphs** (replace with bullet points)

## Country-Specific Norms

- **US/Canada**: 1-2 pages max
- **UK/Europe**: 2 pages OK for experienced hires
- **Australia**: 3-5 pages (they call it a "CV")
- **Germany**: 2-3 pages + photo (traditional)

## The 2026 Trend: Scannable > Length

ATS systems and hiring managers both prefer:
- Clear section headings
- Bullet points (not paragraphs)
- White space
- Key information above the fold

## Pro Tip: PDF Page Count Trick

If you're just over 1 page, adjust:
- Margins: 0.5" → 0.75"
- Font: 12pt → 11.5pt
- Spacing: 1.5 → 1.15

## Build a Perfect-Length Resume

Craftisle Resume's templates are designed for optimal length. Start building now — free.
    `.trim(),
		bodyZh: `
## 简短答案

- **0-5年经验**：1页
- **5-10年经验**：1-2页
- **10年以上经验**：2页（最多）
- **高管/C级**：2-3页（例外）

## 为什么一页通常更好

招聘人员花6-8秒扫描一份简历。一页简历迫使你优先考虑最重要的事情。

## 两页可以的情况

- 你有10年以上相关经验
- 你从事研究/学术领域（发表论文很重要）
- 你申请高级/高管职位
- 你有无法在一页内放下的重要成就

## 如果超过一页要删减什么

1. **古老经验**（1990年代的工作不重要）
2. **不相关的工作**（如果你现在是经理，大学实习就不重要了）
3. **爱好/兴趣**（除非直接相关）
4. **推荐人**（"如果需要可提供"是隐含的）
5. **长段落**（替换为项目符号）

## 各国规范

- **美国/加拿大**：最多1-2页
- **英国/欧洲**：有经验者2页可以
- **澳大利亚**：3-5页（他们称之为"CV"）
- **德国**：2-3页+照片（传统）

## 2026年趋势：可扫描>长度

ATS系统和招聘经理都更喜欢：
- 清晰的章节标题
- 项目符号（而非段落）
- 空白
- 首屏以上的关键信息

## 专业技巧：PDF页数调整技巧

如果你只超过1页一点，调整：
- 页边距：0.5"→0.75"
- 字体：12pt→11.5pt
- 间距：1.5→1.15

## 构建完美长度的简历

Craftisle Resume的模板设计用于最佳长度。立即开始制作——免费。
    `.trim(),
	},
	"how-to-write-a-cover-letter": {
		title: "How to Write a Cover Letter That Gets Noticed",
		titleZh: "如何写一封引人注目的求职信",
		date: "2026-06-16",
		body: `
## The 3-Part Structure

### 1. Opening (1 paragraph)
State the job you're applying for and where you saw it. Add a hook — one achievement that proves you're worth interviewing.

### 2. Body (1-2 paragraphs)
Match 2-3 requirements from the job description. Give specific examples of how you've delivered similar results.

### 3. Closing (1 paragraph)
Reiterate interest, mention attachments, and include a call to action: "I'd welcome the chance to discuss how I can contribute to [Company]."

## Cover Letter Mistakes to Avoid

- **Copy-pasting the resume**: The cover letter should add context, not repeat
- **"To Whom It May Concern"**: Use "Dear Hiring Manager" or research the recruiter's name
- **Generic templates**: Customize 80% for each application
- **Too long**: Keep it to 3-4 paragraphs, under 1 page
- **Focusing on what you want**: Focus on what you can give them

## The "Why Us" Paragraph (Often Missing)

Companies want to know why you chose them. Add a paragraph:
> "I've followed [Company]'s growth in [industry] for 3 years. Your recent [product launch/initiative] aligns with my experience in [skill], and I'm excited about the opportunity to contribute."

## Email Cover Letter Format

If submitting by email:
- **Subject line**: "Application: [Job Title] - [Your Name]"
- **Body**: Keep it short (the cover letter is an attachment)
- **Attachment**: PDF named "FirstName_LastName_CoverLetter.pdf"

## Pro Tip: The "Referral" Opening

If someone referred you, open with it:
> "Raj Patel suggested I apply for the [Job Title] role at [Company]. Having worked together at [Previous Company], he thought my experience in [skill] would be a strong fit."

## Write Your Resume First

A cover letter references your resume. Build a strong resume with Craftisle Resume first — then write your cover letter.
    `.trim(),
		bodyZh: `
## 3部分结构

### 1. 开头（1段）
说明你申请的工作以及在何处看到的。添加一个钩子——一个证明你值得面试的成就。

### 2. 正文（1-2段）
匹配职位描述中的2-3个要求。给出你如何交付类似结果的具体示例。

### 3. 结尾（1段）
重申兴趣，提及附件，并包含行动号召："我希望有机会讨论我如何为[公司]做出贡献。"

## 求职信要避免的错误

- **复制粘贴简历**：求职信应该添加背景，而不是重复
- **"致有关人士"**：使用"尊敬的招聘经理"或研究招聘人员的名字
- **通用模板**：为每个申请定制80%
- **太长**：保持在3-4段，不到1页
- **关注你想要什么**：关注你能给他们什么

## "为什么选择我们"段落（经常缺失）

公司想知道你为什么选择他们。添加一个段落：
> "我关注[公司]在[行业]的增长已有3年。你们最近的[产品发布/倡议]与我在[技能]方面的经验一致，我很兴奋有机会做出贡献。"

## 电子邮件求职信格式

如果通过电子邮件提交：
- **主题行**："申请：[职位名称]-[你的名字]"
- **正文**：保持简短（求职信是附件）
- **附件**：PDF命名为"姓_名_求职信.pdf"

## 专业技巧："推荐人"开头

如果有人推荐你，以此开头：
> "Raj Patel建议我申请[公司]的[职位名称]角色。我们曾在[前公司]共事，他认为我在[技能]方面的经验会非常合适。"

## 先写你的简历

求职信会引用你的简历。先用Craftisle Resume构建一份强大的简历——然后再写求职信。
    `.trim(),
	},
	"linkedin-profile-optimization-2026": {
		title: "LinkedIn Profile Optimization Guide (2026)",
		titleZh: "LinkedIn资料优化指南（2026）",
		date: "2026-06-15",
		body: `
## Why LinkedIn Matters

- 75% of recruiters check LinkedIn before interviewing
- LinkedIn is your "always-on" resume
- Many jobs are filled through LinkedIn networking (not applications)

## 10 Tactics to Optimize Your Profile

### 1. Professional Headshot
No selfies. No logos. Smile. High contrast. Crop to show face + shoulders.

### 2. Custom URL
linkedin.com/in/yourname — not linkedin.com/in/83920jfwe

### 3. Headline That Sells (Not Just Job Title)
Bad: "Software Engineer at Google"
Good: "Software Engineer | ex-Google | Helping teams ship faster"

### 4. About Section = Personal Pitch
Write in first person. 3-4 short paragraphs. End with CTA: "Message me if you're hiring for..."

### 5. Experience Section = Resume on Steroids
Same as resume, but you can be slightly more descriptive. Add media: link to projects, PDFs of talks.

### 6. Skills Section — Get Endorsements
List 5-10 core skills. Ask colleagues to endorse. Recruiters filter by skills.

### 7. Recommendations (Social Proof)
Ask managers, peers, and reports to write 2-3 line recommendations. Give first to get.

### 8. Featured Section (Show Your Work)
Add links to: your portfolio, articles you've written, projects you've built.

### 9. Open to Work (the Right Way)
Use "Open to Work" but set it to "Recruiters Only" (not public) if you're employed.

### 10. Post Content (Be Visible)
Post 1x/week: share insights, comment on industry news, celebrate wins.

## LinkedIn SEO: Get Found by Recruiters

Recruiters search LinkedIn using keywords. Make sure these fields contain target keywords:
- Headline
- About section
- Experience job titles
- Skills list

## Pro Tip: The "Alumni" Filter

Use LinkedIn's Alumni filter to find people who went to your school AND work at your target company. Message them for a referral.

## Your LinkedIn + Resume Should Match

Inconsistencies look like lies. Make sure your LinkedIn and resume tell the same story. Build your resume with Craftisle Resume first, then update LinkedIn.
    `.trim(),
		bodyZh: `
## 为什么LinkedIn很重要

- 75%的招聘人员在面试前查看LinkedIn
- LinkedIn是你"始终在线"的简历
- 许多工作通过LinkedIn人脉填补（而非申请）

## 优化个人资料的10种策略

### 1. 专业头像
不要自拍。不要Logo。微笑。高对比度。裁剪以显示脸部+肩膀。

### 2. 自定义URL
linkedin.com/in/你的名字——而不是linkedin.com/in/83920jfwe

### 3. 吸引人的标题（不仅仅是职位名称）
差的："谷歌软件工程师"
好的："软件工程师|前谷歌|帮助团队更快交付"

### 4. 关于部分=个人推销
用第一人称写。3-4个短段落。以行动号召结尾："如果你正在招聘...，请给我发消息"

### 5. 经验部分=强化版简历
与简历相同，但你可以稍微更具描述性。添加媒体：链接到项目、演讲PDF。

### 6. 技能部分——获得认可
列出5-10项核心技能。请同事认可。招聘人员按技能筛选。

### 7. 推荐（社会证明）
请经理、同事和下属写2-3行推荐。先给予以获得。

### 8. 精选部分（展示你的作品）
添加链接：你的作品集、你写的文章、你构建的项目。

### 9. 求职状态（正确方式）
使用"求职状态"但设置为"仅招聘人员可见"（如果你在职，不要公开）。

### 10. 发布内容（保持可见）
每周发布1次：分享见解、评论行业新闻、庆祝胜利。

## LinkedIn SEO：让招聘人员找到你

招聘人员使用关键词搜索LinkedIn。确保这些字段包含目标关键词：
- 标题
- 关于部分
- 经验职位名称
- 技能列表

## 专业技巧："校友"筛选器

使用LinkedIn的校友筛选器找到曾就读你的学校**并且**在你目标公司工作的人。给他们发消息寻求推荐。

## 你的LinkedIn+简历应该匹配

不一致看起来像谎言。确保你的LinkedIn和简历讲述相同的故事。先用Craftisle Resume构建简历，然后更新LinkedIn。
    `.trim(),
	},
	"job-search-timeline-how-long": {
		title: "Job Search Timeline: How Long Does It Take?",
		titleZh: "求职时间表：需要多长时间？",
		date: "2026-06-14",
		body: `
## The Numbers (Data from 2026)

- **Average time to find a job**: 3-6 months
- **Average number of applications**: 100-200
- **Average interview-to-offer ratio**: 5-10 interviews = 1 offer

## Realistic Timeline (6-Month Plan)

### Month 1: Prepare
- Week 1-2: Build/update resume (use Craftisle Resume)
- Week 3: Optimize LinkedIn profile
- Week 4: Research target companies, setup job alerts

### Month 2-3: Apply Aggressively
- Apply to 5-10 jobs/week (quality > quantity)
- Tailor resume for each application
- Follow up on applications after 1-2 weeks

### Month 4-5: Network & Interview
- Attend industry events (virtual or in-person)
- Reach out to alumni at target companies
- Go through interview loops (usually 3-5 rounds)

### Month 6: Negotiate & Decide
- Review offers
- Negotiate salary (see our Salary Negotiation Guide)
- Make decision, resign gracefully

## How to Speed It Up

1. **Apply within 48 hours of posting** — early applicants get 40% more interviews
2. **Use referrals** — referred candidates are 3x more likely to get hired
3. **Target your search** — 20 tailored applications > 100 generic ones
4. **Practice interviewing** — record yourself answering common questions
5. **Work with recruiters** — they have access to unposted jobs

## Red Flags: You're Taking Too Long

- Applying to 1-2 jobs/week (not enough volume)
- Not hearing back after 2 weeks (resume not ATS-friendly)
- Getting interviews but no offers (interview skills need work)
- Only applying to "perfect match" jobs (expand your search)

## Unemployment Gap? Don't Panic

- **Do freelance/contract work** (fills the gap)
- **Take online courses** (shows you stayed productive)
- **Be honest in interviews** — a 3-6 month gap is normal in 2026

## Pro Tip: The "Parallel Path" Strategy

Don't quit your job before you have an offer. But if you're unemployed, treat job searching as your full-time job: 8 hours/day, 5 days/week.

## Build Your Resume First

A strong resume is the foundation of every job search. Build yours with Craftisle Resume — free, ATS-friendly, and recruiter-approved.
    `.trim(),
		bodyZh: `
## 数字（2026年数据）

- **找工作的平均时间**：3-6个月
- **平均申请数量**：100-200
- **平均面试到录用比例**：5-10次面试=1个offer

## 现实时间表（6个月计划）

### 第1个月：准备
- 第1-2周：构建/更新简历（使用Craftisle Resume）
- 第3周：优化LinkedIn个人资料
- 第4周：研究目标公司，设置工作提醒

### 第2-3个月：积极申请
- 每周申请5-10个工作（质量>数量）
- 为每个申请定制简历
- 1-2周后跟进申请

### 第4-5个月：人脉与面试
- 参加行业活动（虚拟或面对面）
- 联系目标公司的校友
- 通过面试环节（通常3-5轮）

### 第6个月：谈判与决定
- 审查offer
- 谈判薪资（参见我们的薪资谈判指南）
- 做决定，优雅地辞职

## 如何加速

1. **在发布后48小时内申请**——早期申请者获得面试的几率高40%
2. **使用推荐**——被推荐候选人受雇的几率高3倍
3. **针对性搜索**——20份定制的申请>100份通用申请
4. **练习面试**——录下自己回答常见问题
5. **与招聘人员合作**——他们能获得未发布的工作

## 危险信号：你花的时间太长了

- 每周只申请1-2个工作（数量不够）
- 2周后没有回音（简历不ATS友好）
- 获得面试但没有offer（面试技巧需要改进）
- 只申请"完美匹配"的工作（扩大搜索范围）

## 失业空白期？不要恐慌

- **做自由职业/合同工作**（填补空白）
- **参加在线课程**（显示你保持生产力）
- **在面试中诚实**——3-6个月的空白期在2026年是正常的

## 专业技巧："并行路径"策略

在获得offer之前不要辞职。但如果你失业了，把求职当作你的全职工作：每天8小时，每周5天。

## 先构建你的简历

强大的简历是每次求职的基础。用Craftisle Resume构建你的简历——免费、ATS友好、招聘人员认可。
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
