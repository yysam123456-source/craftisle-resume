import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { PaperPlaneRightIcon, SparkleIcon, StopIcon, XIcon } from "@phosphor-icons/react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@reactive-resume/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@reactive-resume/ui/components/dialog";
import { ScrollArea } from "@reactive-resume/ui/components/scroll-area";
import { Textarea } from "@reactive-resume/ui/components/textarea";
import { cn } from "@reactive-resume/utils/style";
import { ResumePreviewLoader } from "@/features/resume/preview/preview.shared";

const ResumePreview = lazy(() =>
	import("@/features/resume/preview/preview").then((module) => ({ default: module.ResumePreview })),
);

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	resumeUpdate?: unknown;
};

type SimpleChatProps = {
	resumeId?: string;
	resumeData?: unknown;
	onClose?: () => void;
};

function generateId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Normalize AI-returned resume data to match the expected ResumeData schema.
// AI may return data in various formats: wrapped in {"data":{...}}, missing metadata, etc.
// This function does NOT trust AI output — it validates, unwraps, and merges with original.
function normalizeResumeData(rawUpdate: unknown, originalData?: unknown): Record<string, unknown> {
	const empty: Record<string, unknown> = {};

	if (!rawUpdate || typeof rawUpdate !== "object" || rawUpdate === null) return empty;

	const updateObj = rawUpdate as Record<string, unknown>;

	// Step 1: Unwrap .data wrapper if AI returned {"data": {...}}
	// Check if the wrapper's .data has resume-specific fields (not a nested basics field)
	let resolved = updateObj;
	if ("data" in updateObj && typeof updateObj.data === "object" && updateObj.data !== null) {
		const innerData = updateObj.data as Record<string, unknown>;
		if ("basics" in innerData || "sections" in innerData || "metadata" in innerData) {
			resolved = innerData;
		}
	}

	if (typeof resolved !== "object" || resolved === null) return empty;
	const resolvedObj = resolved as Record<string, unknown>;

	// Step 2: Normalize originalData — handle both localStorage wrapper and raw resume data
	let origData: Record<string, unknown> = {};
	if (originalData && typeof originalData === "object" && originalData !== null) {
		const orig = originalData as Record<string, unknown>;
		// Check if this is a localStorage entry wrapper { id, data: {...}, updatedAt }
		if ("data" in orig && typeof orig.data === "object" && orig.data !== null) {
			origData = orig.data as Record<string, unknown>;
		} else if ("basics" in orig || "sections" in orig) {
			origData = orig as Record<string, unknown>;
		}
	}

	// Step 3: Merge missing structural fields from original
	const criticalKeys = ["metadata", "picture", "customSections", "summary"];
	for (const key of criticalKeys) {
		if (!(key in resolvedObj) && key in origData) {
			resolvedObj[key] = origData[key];
		}
	}

	// Merge missing section types from original
	const origSections = origData.sections as Record<string, unknown> | undefined;
	const resolvedSections = resolvedObj.sections as Record<string, unknown> | undefined;

	if (origSections) {
		if (resolvedSections) {
			for (const key of Object.keys(origSections)) {
				if (!(key in resolvedSections)) {
					resolvedSections[key] = origSections[key];
				}
			}
			resolvedObj.sections = resolvedSections;
		} else {
			resolvedObj.sections = origSections;
		}
	}

	return resolvedObj;
}

// Extract hidden resume data marker from AI response
// Supports multiple formats:
// 1. <!--RESUME_DATA:{...}-->
// 2. ```json\n{...}\n```
// 3. Raw JSON object at end of message
function parseResumeUpdate(content: string): { visibleContent: string; update?: unknown } {
	// Try hidden marker first: <!--RESUME_DATA:{...}-->
	const markerRegex = /<!--RESUME_DATA:([\s\S]*?)-->\s*$/;
	const markerMatch = content.match(markerRegex);
	if (markerMatch) {
		try {
			const parsed = JSON.parse(markerMatch[1]);
			const visibleContent = content.replace(markerRegex, "").trim();
			return { visibleContent, update: parsed };
		} catch {
			/* fall through */
		}
	}

	// Try markdown code blocks: extract FULL content between ``` and ```, then parse
	// Fixed: capture group is ([\s\S]*?), NOT ([\s\S]*?}) — the old regex stopped at first "}"
	const codeBlockPattern = /```(?:json)?\s*\n?([\s\S]*?)\n?```/g;
	let codeMatch: RegExpExecArray | null = null;
	let lastValidResult: { visibleContent: string; parsed: unknown } | null = null;

	for (codeMatch = codeBlockPattern.exec(content); codeMatch !== null; codeMatch = codeBlockPattern.exec(content)) {
		const blockContent = codeMatch[1].trim();
		if (!blockContent) continue;
		try {
			const parsed = JSON.parse(blockContent);
			// Prefer blocks that look like resume data
			const looksLikeResume =
				typeof parsed === "object" &&
				parsed !== null &&
				("data" in parsed || "basics" in parsed || "sections" in parsed);
			if (looksLikeResume) {
				const visibleContent = content.replace(codeMatch[0], "").trim();
				return { visibleContent, update: parsed };
			}
			// Save as fallback (may be a non-resume JSON block)
			lastValidResult = {
				visibleContent: content.replace(codeMatch[0], "").trim(),
				parsed,
			};
		} catch {
			// Not valid JSON, try next block
		}
	}

	// Fallback: use the last valid JSON block we found
	if (lastValidResult) {
		return { visibleContent: lastValidResult.visibleContent, update: lastValidResult.parsed };
	}

	// Try finding a raw JSON object at the end of the message
	// Use a simple heuristic: look for the last "{" that starts a top-level object
	const lastBraceIdx = content.lastIndexOf("}");
	if (lastBraceIdx > 0) {
		let depth = 0;
		let startIdx = -1;
		for (let i = lastBraceIdx; i >= 0; i--) {
			if (content[i] === "}") depth++;
			if (content[i] === "{") depth--;
			if (depth === 0) {
				startIdx = i;
				break;
			}
		}
		if (startIdx >= 0) {
			const jsonStr = content.slice(startIdx, lastBraceIdx + 1);
			try {
				const parsed = JSON.parse(jsonStr);
				if (
					typeof parsed === "object" &&
					parsed !== null &&
					("data" in parsed || "basics" in parsed || "experience" in parsed || "education" in parsed)
				) {
					const visibleContent = content.slice(0, startIdx).trim();
					return { visibleContent, update: parsed };
				}
			} catch {
				/* fall through */
			}
		}
	}

	return { visibleContent: content };
}

export function SimpleChat({ resumeId, resumeData, onClose }: SimpleChatProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);
	const RATE_LIMIT_MS = 60_000; // 60 seconds between AI calls
	const RATE_LIMIT_KEY = "craftisle-ai-last-request";
	const [cooldownRemaining, setCooldownRemaining] = useState(0);

	// On mount: read last request time from localStorage and compute remaining cooldown
	useEffect(() => {
		const last = localStorage.getItem(RATE_LIMIT_KEY);
		if (!last) return;
		const remaining = Math.ceil((RATE_LIMIT_MS - (Date.now() - Number(last))) / 1000);
		if (remaining > 0) setCooldownRemaining(remaining);
	}, []);

	// Live countdown timer for rate limit
	useEffect(() => {
		if (cooldownRemaining <= 0) return;
		const interval = setInterval(() => {
			setCooldownRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [cooldownRemaining]);

	// Returns remaining seconds if rate-limited, or 0 if allowed
	const getRateLimitRemaining = useCallback(() => {
		if (cooldownRemaining > 0) return cooldownRemaining;
		const last = localStorage.getItem(RATE_LIMIT_KEY);
		if (!last) return 0;
		const elapsed = Date.now() - Number(last);
		if (elapsed >= RATE_LIMIT_MS) return 0;
		return Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
	}, [cooldownRemaining]);

	// Preview dialog state
	const [previewUpdate, setPreviewUpdate] = useState<unknown>(undefined);
	const [showPreview, setShowPreview] = useState(false);
	const [previewTab, setPreviewTab] = useState<"diff" | "pdf">("diff");

	// Strip base64 images and large blobs from resumeData to avoid token overflow
	const sanitizedResumeData = useMemo(() => {
		if (!resumeData) return undefined;
		try {
			return JSON.parse(
				JSON.stringify(resumeData, (_key, value) => {
					if (typeof value === "string" && value.startsWith("data:") && value.length > 200) {
						return "[image removed]";
					}
					return value;
				}),
			) as unknown;
		} catch {
			return resumeData;
		}
	}, [resumeData]);

	const applyResumeUpdate = useCallback(
		(update: unknown) => {
			if (!resumeId) return;
			try {
				const raw = localStorage.getItem("craftisle-resumes");
				if (!raw) return;
				const resumes = JSON.parse(raw) as Array<{
					id: string;
					data: Record<string, unknown>;
					updatedAt: string;
					// biome-ignore lint/suspicious/noExplicitAny: allow index signature
					[key: string]: any;
				}>;
				const idx = resumes.findIndex((r) => r.id === resumeId);
				if (idx === -1) return;

				// Normalize: unwrap .data, merge missing fields from original
				// Pass resumes[idx].data (the actual resume data), NOT resumes[idx] (the wrapper)
				const normalizedData = normalizeResumeData(update, resumes[idx].data) as Record<string, unknown>;

				// Restore picture URLs if AI replaced them with "[image removed]"
				const origData = resumes[idx].data;
				const normalizedPicture = normalizedData.picture as { url?: string } | undefined;
				const origPicture = origData?.picture as { url?: string } | undefined;
				if (normalizedPicture?.url === "[image removed]" && origPicture?.url) {
					normalizedData.picture = origPicture;
				}

				resumes[idx] = {
					...resumes[idx],
					data: normalizedData,
					updatedAt: new Date().toISOString(),
				};

				localStorage.setItem("craftisle-resumes", JSON.stringify(resumes));
				toast.success(t`Resume updated successfully!`);
				onClose?.();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : t`Failed to update resume.`);
			}
		},
		[resumeId, onClose],
	);

	// Open preview dialog with resume data diff
	const handleApplyClick = useCallback(
		(update: unknown) => {
			// Normalize AI data: unwrap wrappers, merge missing fields from original
			// resumeData may be localStorage wrapper or raw resume data
			const normalized = normalizeResumeData(update, resumeData);
			setPreviewUpdate(normalized);
			setShowPreview(true);
		},
		[resumeData],
	);

	// Confirm from preview dialog: apply the update
	const confirmApply = useCallback(() => {
		if (!previewUpdate) return;
		setShowPreview(false);
		applyResumeUpdate(previewUpdate);
		setPreviewUpdate(undefined);
	}, [previewUpdate, applyResumeUpdate]);

	// Cancel preview
	const cancelPreview = useCallback(() => {
		setShowPreview(false);
		setPreviewUpdate(undefined);
	}, []);

	// Build a simple diff summary between original and updated resume data
	const renderDiffPreview = useCallback(() => {
		if (!previewUpdate || !resumeData) return null;
		try {
			const newData =
				typeof previewUpdate === "object" && previewUpdate !== null ? (previewUpdate as Record<string, unknown>) : {};

			// Unwrap original data if it has .data wrapper (from localStorage entry or AI wrapper)
			const rawOrig = resumeData as Record<string, unknown>;
			const oldData =
				"data" in rawOrig && typeof rawOrig.data === "object" && rawOrig.data !== null
					? (rawOrig.data as Record<string, unknown>)
					: rawOrig;

			type DiffRow = { label: string; before: string; after: string };

			const rows: DiffRow[] = [];
			const truncate = (s: string, max = 80) => (s.length > max ? `${s.slice(0, max)}…` : s);

			// Compare top-level basics fields
			const oldBasics = (oldData as Record<string, unknown>)?.basics as Record<string, unknown> | undefined;
			const newBasics = (newData as Record<string, unknown>)?.basics as Record<string, unknown> | undefined;

			const compareField = (section: string, field: string) => {
				const oldVal =
					section === "basics"
						? (oldBasics?.[field] as string | undefined)
						: (((oldData as Record<string, unknown>)?.[section] as Record<string, unknown> | undefined)?.[field] as
								| string
								| undefined);
				const newVal =
					section === "basics"
						? (newBasics?.[field] as string | undefined)
						: (((newData as Record<string, unknown>)?.[section] as Record<string, unknown> | undefined)?.[field] as
								| string
								| undefined);
				const oldStr = oldVal ? String(oldVal) : "";
				const newStr = newVal ? String(newVal) : "";
				if (oldStr !== newStr) {
					rows.push({
						label: `${section}.${field}`,
						before: oldStr ? truncate(oldStr) : "(empty)",
						after: newStr ? truncate(newStr) : "(empty)",
					});
				}
			};

			compareField("basics", "name");
			compareField("basics", "headline");
			compareField("basics", "phone");
			compareField("basics", "location");
			compareField("basics", "summary");

			// Compare summary (top-level)
			compareField("summary", "summary");

			// Compare sections: experience, education, skills
			const compareSectionItems = (key: string, labelField = "summary") => {
				const oldItems = Array.isArray((oldData as Record<string, unknown>)?.[key])
					? ((oldData as Record<string, unknown>)?.[key] as Array<Record<string, unknown>>)
					: [];
				const newItems = Array.isArray((newData as Record<string, unknown>)?.[key])
					? ((newData as Record<string, unknown>)?.[key] as Array<Record<string, unknown>>)
					: [];
				const maxLen = Math.max(oldItems.length, newItems.length);
				for (let i = 0; i < maxLen; i++) {
					const oldItem = oldItems[i];
					const newItem = newItems[i];
					const oldText = oldItem?.[labelField] ? String(oldItem[labelField]) : "";
					const newText = newItem?.[labelField] ? String(newItem[labelField]) : "";
					if (oldText !== newText) {
						rows.push({
							label: `${key}[${i}].${labelField}`,
							before: oldText ? truncate(oldText, 120) : "(empty)",
							after: newText ? truncate(newText, 120) : "(empty)",
						});
					}
				}
			};

			compareSectionItems("experience", "summary");
			compareSectionItems("experience", "description");
			compareSectionItems("education", "description");
			compareSectionItems("skills", "name");

			if (rows.length === 0) {
				return (
					<p className="py-8 text-center text-muted-foreground text-sm">
						No textual changes detected. The AI may have reformatted data without changing content.
					</p>
				);
			}

			return (
				<div className="max-h-[60vh] overflow-auto">
					<table className="w-full border-collapse text-sm">
						<thead className="sticky top-0 bg-background">
							<tr className="border-b text-left font-medium text-muted-foreground text-xs uppercase">
								<th className="px-3 py-2">Field</th>
								<th className="px-3 py-2">Before</th>
								<th className="px-3 py-2">After</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, i) => (
								<tr key={i} className="border-b last:border-0">
									<td className="px-3 py-2 font-mono text-muted-foreground text-xs">{row.label}</td>
									<td className="line-clamp-3 max-w-[35%] px-3 py-2 align-top text-red-600/80 dark:text-red-400/80">
										{row.before}
									</td>
									<td className="line-clamp-3 max-w-[35%] px-3 py-2 align-top text-green-600/80 dark:text-green-400/80">
										{row.after}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		} catch {
			return <p className="py-4 text-center text-muted-foreground text-sm">Unable to preview changes.</p>;
		}
	}, [previewUpdate, resumeData]);

	// Send a hidden follow-up to get just the JSON data when AI didn't include the marker
	const requestResumeData = useCallback(
		async (assistantMessageId: string) => {
			if (!sanitizedResumeData) return;

			// Rate limit: 60 seconds between AI requests
			const remaining = getRateLimitRemaining();
			if (remaining > 0) {
				toast.warning(`Please wait ${remaining}s before sending another request.`);
				return;
			}

			localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
			setCooldownRemaining(60);
			setIsLoading(true);

			const controller = new AbortController();
			abortRef.current = controller;

			try {
				const followUpPrompt = `The user wants to apply the changes you described. You MUST output ONLY a JSON object in one of these formats (no markdown, no explanations, no other text):

Format 1 (preferred): <!--RESUME_DATA:{"data":{...}}-->
Format 2: {"data":{...}}

Replace {...} with the FULL updated resume data object. Keep image fields as "[image removed]" if they were in the original. Do not include any other text before or after the JSON.`;

				const apiMessages = [
					{ role: "system" as const, content: "You are a resume assistant." },
					{ role: "user" as const, content: `Here is my current resume data: ${JSON.stringify(sanitizedResumeData)}` },
					...messages.map((m) => ({ role: m.role, content: m.content })),
					{ role: "user" as const, content: followUpPrompt },
				];

				const response = await fetch("/api/ai/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						model: "agnes-2.0-flash",
						messages: apiMessages,
						stream: false,
					}),
					signal: controller.signal,
				});

				if (!response.ok) {
					const errBody = await response.json().catch(() => null);
					const errMsg =
						typeof errBody?.error === "string"
							? errBody.error
							: typeof errBody?.error?.message === "string"
								? errBody.error.message
								: (errBody?.message ?? `HTTP ${response.status}`);
					throw new Error(errMsg);
				}

				const data = (await response.json()) as { choices?: Array<{ message?: { content?: unknown } }> };
				const rawContent = data.choices?.[0]?.message?.content;
				const assistantContent = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent) || "";

				const { update } = parseResumeUpdate(assistantContent);

				if (update) {
					// Normalize before storing and opening preview
					const normalized = normalizeResumeData(update, resumeData);
					// Patch the existing assistant message with the extracted data
					setMessages((prev) =>
						prev.map((m) => (m.id === assistantMessageId ? { ...m, resumeUpdate: normalized } : m)),
					);
					// Open preview dialog instead of auto-applying
					handleApplyClick(normalized);
				} else {
					toast.error(t`Could not extract resume data. Please try again.`);
				}
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") return;
				toast.error(error instanceof Error ? error.message : t`Failed to get resume data.`);
			} finally {
				setIsLoading(false);
				abortRef.current = null;
			}
		},
		[getRateLimitRemaining, sanitizedResumeData, messages, handleApplyClick, resumeData],
	);

	const sendMessage = useCallback(async () => {
		const text = input.trim();
		if (!text || isLoading) return;

		// Rate limit: 60 seconds between AI requests
		const remaining = getRateLimitRemaining();
		if (remaining > 0) {
			toast.warning(`Please wait ${remaining}s before sending another request.`);
			return;
		}

		localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
		setCooldownRemaining(60);
		const userMessage: Message = { id: generateId(), role: "user", content: text };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		const controller = new AbortController();
		abortRef.current = controller;

		try {
			const systemPrompt = sanitizedResumeData
				? `You are a helpful resume assistant. The user is working on their resume.

CURRENT RESUME DATA (JSON):
${JSON.stringify(sanitizedResumeData)}

INSTRUCTIONS:
1. When the user asks you to make changes (translate, rewrite, improve, etc.), respond in natural language describing what you changed.
2. You MUST include the complete updated resume data at the very end of your response in ONE of these formats:
   - <!--RESUME_DATA:{"data":{...}}-->
   - {"data":{...}}
3. Replace {...} with the FULL updated resume data object, preserving all structure.
4. Keep image URL values as "[image removed]" — they will be restored automatically.
5. Do NOT show raw JSON in the visible part of your response.
6. Do NOT wrap the JSON in markdown code blocks (no code fences).

EXAMPLE RESPONSE FORMAT:
"I've translated your resume to English. Summary is now... Experience section... Education...

<!--RESUME_DATA:{"data":{"basics":{"name":"John Doe","headline":"..."},...}}-->`
				: "You are a helpful resume assistant. The user is working on their resume. Provide advice, suggestions, and improvements.";

			const apiMessages = [
				{ role: "system" as const, content: systemPrompt },
				...messages.map((m) => ({ role: m.role, content: m.content })),
				{ role: "user" as const, content: text },
			];

			const response = await fetch("/api/ai/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "agnes-2.0-flash",
					messages: apiMessages,
					stream: false,
				}),
				signal: controller.signal,
			});

			if (!response.ok) {
				const errBody = await response.json().catch(() => null);
				const errMsg =
					typeof errBody?.error === "string"
						? errBody.error
						: typeof errBody?.error?.message === "string"
							? errBody.error.message
							: (errBody?.message ?? `HTTP ${response.status}`);
				throw new Error(errMsg);
			}

			const data = (await response.json()) as { choices?: Array<{ message?: { content?: unknown } }> };
			const rawContent = data.choices?.[0]?.message?.content;
			const assistantContent =
				typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent) || "No response";

			const { visibleContent, update } = parseResumeUpdate(assistantContent);

			setMessages((prev) => [
				...prev,
				{ id: generateId(), role: "assistant", content: visibleContent, resumeUpdate: update },
			]);
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") return;
			toast.error(error instanceof Error ? error.message : t`Failed to get response.`);
		} finally {
			setIsLoading(false);
			abortRef.current = null;
		}
	}, [input, isLoading, messages, sanitizedResumeData, getRateLimitRemaining]);

	const stopGeneration = useCallback(() => {
		abortRef.current?.abort();
		abortRef.current = null;
		setIsLoading(false);
	}, []);

	// Determine if a message might contain changes worth applying
	const hasResumeContext = !!sanitizedResumeData;

	return (
		<section className="flex h-full min-h-0 flex-col bg-background">
			<div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
				<div className="flex min-w-0 items-center gap-2">
					<div className="min-w-0 truncate font-semibold">
						<Trans>AI Assistant</Trans>
					</div>
				</div>
				<Button variant="ghost" size="icon" aria-label={t`Close`} onClick={onClose} className="shrink-0">
					<XIcon />
				</Button>
			</div>

			<ScrollArea className="min-h-0 flex-1">
				<div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
					{messages.length === 0 ? (
						<div className="grid gap-6 py-12 text-center">
							<SparkleIcon className="mx-auto size-8 text-muted-foreground" />
							<h2 className="font-semibold text-2xl">
								<Trans>What do you want to do?</Trans>
							</h2>
							<p className="text-muted-foreground text-sm">
								<Trans>
									Ask me anything about your resume — improve content, tailor for a role, or fix formatting.
								</Trans>
							</p>
						</div>
					) : null}

					{messages.map((message) => (
						<div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
							<div
								className={cn(
									"space-y-3 text-sm",
									message.role === "user"
										? "max-w-[86%] rounded-md bg-primary px-4 py-3 text-primary-foreground"
										: "w-full max-w-full py-1 text-foreground",
								)}
							>
								{message.role === "user" ? (
									<div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
								) : (
									<>
										<ReactMarkdown
											skipHtml
											components={{
												p: ({ children }) => <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
												ul: ({ children }) => <ul className="my-2 ms-5 list-disc space-y-1">{children}</ul>,
												ol: ({ children }) => <ol className="my-2 ms-5 list-decimal space-y-1">{children}</ol>,
												li: ({ children }) => <li className="ps-1">{children}</li>,
												a: ({ children, href }) => (
													<a
														className="text-primary underline underline-offset-4"
														href={href}
														target="_blank"
														rel="noreferrer"
													>
														{children}
													</a>
												),
												code: ({ children, className }) => (
													<code
														className={cn("rounded border bg-muted px-1 py-0.5 font-mono text-[0.85em]", className)}
													>
														{children}
													</code>
												),
												pre: ({ children }) => (
													<pre className="my-3 max-w-full overflow-auto rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
														{children}
													</pre>
												),
												blockquote: ({ children }) => (
													<blockquote className="my-3 border-l-2 ps-3 text-muted-foreground">{children}</blockquote>
												),
											}}
										>
											{message.content}
										</ReactMarkdown>
										{hasResumeContext && message.role === "assistant" ? (
											<div className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-3">
												{message.resumeUpdate ? (
													<>
														<p className="mb-2 font-medium text-sm">
															<Trans>AI has prepared an update for your resume.</Trans>
														</p>
														<Button
															size="sm"
															onClick={() => handleApplyClick(message.resumeUpdate)}
															disabled={cooldownRemaining > 0}
														>
															<Trans>Apply Changes</Trans>
														</Button>
													</>
												) : (
													<>
														<p className="mb-2 font-medium text-sm">
															<Trans>Want to apply the changes?</Trans>
														</p>
														<Button
															size="sm"
															variant="outline"
															onClick={() => requestResumeData(message.id)}
															disabled={isLoading || cooldownRemaining > 0}
														>
															<Trans>Apply Changes</Trans>
														</Button>
													</>
												)}
											</div>
										) : null}
									</>
								)}
							</div>
						</div>
					))}

					{isLoading ? (
						<div className="flex justify-start">
							<div className="rounded-md bg-muted px-4 py-3 text-muted-foreground text-sm">
								<Trans>Working…</Trans>
							</div>
						</div>
					) : null}
				</div>
			</ScrollArea>

			<form
				className="border-t p-3"
				onSubmit={(event) => {
					event.preventDefault();
					void sendMessage();
				}}
			>
				<div className="mx-auto max-w-3xl space-y-2">
					<div className="flex items-end gap-1 rounded-md border bg-card p-1.5">
						<Textarea
							value={input}
							rows={1}
							disabled={isLoading || cooldownRemaining > 0}
							onChange={(event) => setInput(event.target.value)}
							onKeyDown={(event) => {
								if (event.nativeEvent.isComposing) return;
								if (event.key !== "Enter" || event.shiftKey) return;
								event.preventDefault();
								void sendMessage();
							}}
							placeholder={
								cooldownRemaining > 0
									? `Wait ${cooldownRemaining}s before next request...`
									: t`Ask anything about this resume`
							}
							className="max-h-40 min-h-9 resize-none border-0 bg-transparent p-2 leading-5 shadow-none focus-visible:ring-0"
						/>
						{isLoading ? (
							<Button
								type="button"
								size="icon"
								variant="outline"
								aria-label={t`Stop generation`}
								onClick={stopGeneration}
							>
								<StopIcon />
							</Button>
						) : (
							<Button
								type="submit"
								size="icon"
								aria-label={t`Send message`}
								disabled={!input.trim() || cooldownRemaining > 0}
							>
								<PaperPlaneRightIcon />
							</Button>
						)}
					</div>
				</div>
			</form>

			{/* Preview Dialog — shows diff + PDF preview before applying changes */}
			<Dialog open={showPreview} onOpenChange={setShowPreview}>
				<DialogContent className="max-h-[90vh] max-w-4xl overflow-auto">
					<DialogHeader>
						<DialogTitle>Preview Changes</DialogTitle>
						<DialogDescription>
							Review the changes the AI wants to apply. Switch to PDF Preview to see how your resume will look.
						</DialogDescription>
					</DialogHeader>

					{/* Tabs */}
					<div className="mb-4 flex gap-1 border-b">
						<button
							type="button"
							onClick={() => setPreviewTab("diff")}
							className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
								previewTab === "diff"
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							Changes
						</button>
						<button
							type="button"
							onClick={() => setPreviewTab("pdf")}
							className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
								previewTab === "pdf"
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							PDF Preview
						</button>
					</div>

					{previewTab === "diff" ? (
						<div className="py-2">
							<h4 className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
								What's Changed
							</h4>
							{renderDiffPreview()}
						</div>
					) : (
						<div className="min-h-[500px] py-2">
							<Suspense fallback={<ResumePreviewLoader pageCount={1} />}>
								{/* biome-ignore lint/suspicious/noExplicitAny: allow any for resume data */}
								<ResumePreview data={previewUpdate as any} showPageNumbers pageLayout="horizontal" />
							</Suspense>
						</div>
					)}

					<DialogFooter className="mt-4 gap-2">
						<Button variant="outline" onClick={cancelPreview}>
							Cancel
						</Button>
						<Button onClick={confirmApply}>Confirm & Apply</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
}
