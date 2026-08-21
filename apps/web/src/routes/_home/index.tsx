import { createFileRoute } from "@tanstack/react-router";
import { AdBanner } from "@/components/ads";
import { createRootStructuredDataScript, getCanonicalRootUrl } from "@/libs/seo";
import { Faq } from "./-sections/faq";
import { Features } from "./-sections/features";
import { Hero } from "./-sections/hero";
import { Prefooter } from "./-sections/prefooter";
import { Statistics } from "./-sections/statistics";
import { Templates } from "./-sections/templates";
import { Testimonials } from "./-sections/testimonials";

export const Route = createFileRoute("/_home/")({
	component: RouteComponent,
	head: () => {
		const appUrl = typeof window !== "undefined" ? window.location.origin : "https://resume.craftisle.com";
		const canonicalUrl = getCanonicalRootUrl(appUrl);

		return {
			links: [{ rel: "canonical", href: canonicalUrl }],
			scripts: [
				createRootStructuredDataScript(canonicalUrl),
				{
					id: "craftisle-hub-json-ld",
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@graph": [
							{
								"@type": "Organization",
								"@id": "https://craftisle.com/#organization",
								name: "Craftisle",
								url: "https://craftisle.com",
							},
							{
								"@type": "WebSite",
								"@id": "https://resume.craftisle.com/#website",
								url: "https://resume.craftisle.com",
								name: "Craftisle Resume",
								publisher: { "@id": "https://craftisle.com/#organization" },
							},
						],
					}),
				},
			],
		};
	},
});

function RouteComponent() {
	return (
		<main id="main-content" className="relative">
			{/* Top banner ad — below header, above hero */}
			<div className="container mx-auto flex justify-center px-4 py-3 sm:px-6 lg:px-12">
				<AdBanner size="leaderboard" />
			</div>

			<Hero />

			<div className="container mx-auto px-4 sm:px-6 lg:px-12">
				<div className="border-border border-x [&>section:first-child]:border-t-0 [&>section]:border-border [&>section]:border-t">
					<Statistics />
					<Features />
					<Templates />
					<Testimonials />
					<Faq />
					<Prefooter />
				</div>
			</div>

			{/* Bottom banner ad — above footer */}
			<div className="container mx-auto flex justify-center px-4 py-6 sm:px-6 lg:px-12">
				<AdBanner size="leaderboard" />
			</div>
		</main>
	);
}
