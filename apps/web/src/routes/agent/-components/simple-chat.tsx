import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { PaperPlaneRightIcon, SparkleIcon, StopIcon } from "@phosphor-icons/react";
import { useCallback, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@reactive-resume/ui/components/button";
import { ScrollArea } from "@reactive-resume/ui/components/scroll-area";
import { Textarea } from "@reactive-resume/ui/components/textarea";
import { cn } from "@reactive-resume/utils/style";

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

type SimpleChatProps = {
	resumeData?: unknown;
};

function generateId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function SimpleChat({ resumeData }: SimpleChatProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	const sendMessage = useCallback(async () => {
		const text = input.trim();
		if (!text || isLoading) return;

		const userMessage: Message = { id: generateId(), role: "user", content: text };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		const controller = new AbortController();
		abortRef.current = controller;

		try {
			const systemPrompt = resumeData
				? `You are a helpful resume assistant. The user is working on their resume. Here is their current resume data in JSON format:\n\n${JSON.stringify(resumeData, null, 2)}\n\nUse this context to provide relevant advice, suggestions, and improvements. You can suggest changes but do not modify the data directly unless asked.`
				: "You are a helpful resume assistant. The user is working on their resume. Provide advice, suggestions, and improvements.";

			const apiMessages = [
				{ role: "system", content: systemPrompt },
				...messages.map((m) => ({ role: m.role, content: m.content })),
				{ role: "user", content: text },
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
				const error = await response.json().catch(() => ({ error: "Unknown error" }));
				throw new Error(error.error || `HTTP ${response.status}`);
			}

			const data = await response.json();
			const assistantContent = data.choices?.[0]?.message?.content || "No response";

			setMessages((prev) => [...prev, { id: generateId(), role: "assistant", content: assistantContent }]);
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") return;
			toast.error(error instanceof Error ? error.message : t`Failed to get response.`);
		} finally {
			setIsLoading(false);
			abortRef.current = null;
		}
	}, [input, isLoading, messages, resumeData]);

	const stopGeneration = useCallback(() => {
		abortRef.current?.abort();
		abortRef.current = null;
		setIsLoading(false);
	}, []);

	return (
		<section className="flex h-full min-h-0 flex-col bg-background">
			<div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
				<div className="flex min-w-0 items-center gap-2">
					<div className="min-w-0 truncate font-semibold">
						<Trans>AI Assistant</Trans>
					</div>
				</div>
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
												<code className={cn("rounded border bg-muted px-1 py-0.5 font-mono text-[0.85em]", className)}>
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
							disabled={isLoading}
							onChange={(event) => setInput(event.target.value)}
							onKeyDown={(event) => {
								if (event.nativeEvent.isComposing) return;
								if (event.key !== "Enter" || event.shiftKey) return;
								event.preventDefault();
								void sendMessage();
							}}
							placeholder={t`Ask anything about this resume`}
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
							<Button type="submit" size="icon" aria-label={t`Send message`} disabled={!input.trim()}>
								<PaperPlaneRightIcon />
							</Button>
						)}
					</div>
				</div>
			</form>
		</section>
	);
}
