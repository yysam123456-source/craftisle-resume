export async function onRequestPost(context: { request: Request; env: Record<string, string> }) {
	const { request, env } = context;

	// CORS
	if (request.method === "OPTIONS") {
		return new Response(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	}

	try {
		const body = await request.json();

		const apiKey = env.AGNES_API_KEY;
		if (!apiKey) {
			return new Response(JSON.stringify({ error: "AGNES_API_KEY not configured" }), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		const response = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		// If Agnes API returns an error status, read the body as text and return a friendly error
		if (!response.ok) {
			const text = await response.text().catch(() => "unknown error");
			console.error(`Agnes API error ${response.status}: ${text.slice(0, 200)}`);
			return new Response(
				JSON.stringify({
					error: `AI service error (${response.status}). Please try again in a moment.`,
				}),
				{
					status: 502,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				},
			);
		}

		// Try to parse JSON; if it fails, return a friendly error instead of raw SyntaxError
		let data: unknown;
		try {
			data = await response.json();
		} catch {
			const text = await response.text().catch(() => "unknown error");
			console.error(`Agnes API returned non-JSON: ${text.slice(0, 200)}`);
			return new Response(
				JSON.stringify({
					error: "AI service returned an unexpected response. Please try again.",
				}),
				{
					status: 502,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				},
			);
		}

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch (error) {
		console.error("Cloudflare Function error:", error);
		return new Response(
			JSON.stringify({
				error: "Server error. Please try again in a moment.",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	}
}
