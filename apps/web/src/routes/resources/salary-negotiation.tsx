import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { getLocale } from "@/libs/locale";

const negotiationSteps = [
	{
		step: 1,
		title: "Wait for the Offer — Don't Bring It Up First",
		titleZh: "等offer——不要先提",
		body: `**Never** bring up salary in the first interview. Let them fall in love with you first.

If they ask "What's your salary expectation?" — say:
> "I'm focused on finding the right role first. Once we both feel it's a good match, I'm confident we can agree on fair compensation."

Then SHUT UP. Let them name the first number.`,
		bodyZh: `**切勿**在第一次面试时提起薪资。让他们先对你产生好感。

如果他们问"你的薪资期望是多少？"——这样回答：
> "我首先专注于找到合适的岗位。一旦我们都认为匹配良好，我相信我们能就公平薪酬达成一致。"

然后**闭嘴**。让他们先出价。`,
	},
	{
		step: 2,
		title: "Research Market Rate (Before Negotiating)",
		titleZh: "调研市场行情（谈判前）",
		body: `Before you counter-offer, know your market value:

- **Levels.fyi** — salary data by company/level
- **Glassdoor** — self-reported salaries
- **Blind** — anonymous tech salaries
- **Craftisle Research** — our 2026 salary report (downloadable)

**Rule of thumb**: Ask for 10-20% above the middle of the range.`,
		bodyZh: `在还价之前，了解你的市场价值：

- **Levels.fyi** — 按公司/级别查看薪资数据
- **Glassdoor** — 求职者自报告的薪资
- **Blind** — 匿名科技行业薪资
- **Craftisle Research** — 我们的2026年薪资报告（可下载）

**经验法则**：要价范围中值的110-120%。`,
	},
	{
		step: 3,
		title: "Counter-Offer Strategy (The 'Flinch' Trick)",
		titleZh: "还价策略（退缩技巧）",
		body: `When they give you a number — **don't accept immediately**, even if it's good.

**The script**:
> "That's a great starting point. Based on my research and the value I'll bring to the team, I was expecting something closer to [X]. Is there flexibility to move toward that?"

Then **go silent**. Let THEM fill the awkwardness. 70% of the time, they'll improve the offer.`,
		bodyZh: `当他们给出一个数字时——**不要立即接受**，即使它很好。

**话术**：
> "这是一个很好的起点。根据我的调研以及我将为团队带来的价值，我期望更接近[X]。这方面有灵活性吗？"

然后**保持沉默**。让**他们**来填补尴尬。70%的情况下，他们会改进offer。`,
	},
	{
		step: 4,
		title: "Negotiate the Whole Package (Not Just Base)",
		titleZh: "谈判整体待遇（不只是底薪）",
		body: `If they say "We can't go higher on base" — negotiate OTHER things:

- **Signing bonus** — one-time payment (easier to get)
- **Equity/Stock options** — especially at startups
- **Remote work** — save on commute/housing
- **Professional development budget** — $5k-10k/year for courses
- **Extra PTO** — 5-10 more days/year

**Pro tip**: Get the company to compete with *your* value, not just match a number.`,
		bodyZh: `如果他们说"底薪我们无法提高"——谈判**其他**事项：

- **签约奖金** — 一次性付款（更容易获得）
- **股权/股票期权** — 尤其是初创公司
- **远程工作** — 节省通勤/住房成本
- **职业发展预算** — 每年5k-10k用于课程
- **额外PTO** — 每年多5-10天假期

**专业技巧**：让公司**竞争你的**价值，而不只是匹配一个数字。`,
	},
	{
		step: 5,
		title: "Get It in Writing (Before You Resign)",
		titleZh: "拿到书面offer（辞职前）",
		body: `**Never** resign until you have a **signed offer letter** with ALL terms:

- Base salary
- Bonus structure
- Equity details
- Start date
- Benefits summary

If they say "We'll send it later" — say:
> "I'm excited to join! To finalize my resignation timeline, could you send the written offer today? I want to review all terms before handing in my notice."

**Red flag**: If they resist putting it in writing, WALK AWAY.`,
		bodyZh: `**切勿**在收到**签署的offer信**之前辞职，其中必须包含**所有**条款：

- 底薪
- 奖金结构
- 股权细节
- 入职日期
- 福利摘要

如果他们说"我们稍后会发给你"——这样说：
> "我很兴奋能加入！为了最终确定我的辞职时间表，你能今天把书面offer发给我吗？我想在提交辞呈之前审查所有条款。"

**危险信号**：如果他们拒绝书面确认，**转身离开**。`,
	},
];

export const Route = createFileRoute("/resources/salary-negotiation")({
	component: SalaryNegotiationPage,
});

function SalaryNegotiationPage() {
	const locale = getLocale();
	const isZh = locale.startsWith("zh");

	useEffect(() => {
		document.title = isZh ? "薪资谈判指南2026 — Craftisle Resume" : "Salary Negotiation Guide 2026 — Craftisle Resume";
	}, [isZh]);

	return (
		<div className="mx-auto max-w-3xl px-4 py-12">
			<header className="mb-12 text-center">
				<h1 className="mb-4 font-bold text-4xl">{isZh ? "薪资谈判指南 2026" : "Salary Negotiation Guide 2026"}</h1>
				<p className="text-gray-500 text-lg dark:text-gray-400">
					{isZh
						? "在签署offer之前，确保你的薪资达到市场水平。包含话术和技巧。"
						: "Make sure your compensation matches market rate before signing. Includes scripts & tactics."}
				</p>
			</header>

			<div className="space-y-10">
				{negotiationSteps.map((item) => (
					<section
						key={item.step}
						className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="mb-4 flex items-center gap-4">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-sm text-white">
								{item.step}
							</span>
							<h2 className="font-semibold text-2xl">{isZh ? item.titleZh : item.title}</h2>
						</div>
						{item.body.split("\n").map((line, i) => {
							if (line.startsWith("**") && line.endsWith("**")) {
								return (
									<h3 key={i} className="mt-6 mb-3 font-semibold text-lg">
										{line.replace(/\*\*/g, "")}
									</h3>
								);
							}
							if (line.startsWith("> ")) {
								return (
									<blockquote
										key={i}
										className="my-4 border-blue-600 border-l-4 pl-4 text-gray-600 italic dark:text-gray-300"
									>
										{line.replace("> ", "")}
									</blockquote>
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
						})}
					</section>
				))}
			</div>

			<footer className="mt-12 rounded-2xl bg-blue-50 p-8 text-center dark:bg-blue-900/20">
				<h2 className="mb-4 font-bold text-2xl">
					{isZh ? "准备好涨薪了吗？" : "Ready to Get Paid What You're Worth?"}
				</h2>
				<p className="mb-6 text-gray-600 dark:text-gray-300">
					{isZh
						? "用Craftisle Resume的12+个ATS友好模板，免费制作专业简历。拿到offer后再谈判。"
						: "Use Craftisle Resume's 12+ ATS-friendly templates to build a professional resume for free. Negotiate after you get the offer."}
				</p>
				<Link
					to="/"
					className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
				>
					{isZh ? "免费制作简历" : "Build Your Resume — Free"}
				</Link>
			</footer>
		</div>
	);
}
