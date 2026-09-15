import { createFileRoute, Link } from "@tanstack/react-router";
import { blogPosts } from "@/libs/blog-data";
import { getLocale } from "@/libs/locale";
import { getCanonicalRootUrl } from "@/libs/seo";

export const Route = createFileRoute("/blog/")({
	component: BlogListPage,
	head: () => {
		const canonicalUrl = getCanonicalRootUrl(typeof window !== "undefined" ? window.location.origin : undefined);
		return {
			meta: [
				{
					title: "Resume Writing Blog — Expert Tips & Career Advice | Craftisle Resume",
				},
				{
					name: "description",
					content:
						"Free resume writing guides and career advice: ATS tips, action verbs, resume length, cover letters, LinkedIn optimization and more. Read, then build your resume free.",
				},
				{
					name: "keywords",
					content: "resume blog, resume tips, career advice, ATS resume, cover letter, job search",
				},
				{
					name: "robots",
					content: "index, follow, max-image-preview:large",
				},
			],
			links: [{ rel: "canonical", href: `${canonicalUrl}blog` }],
		};
	},
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
