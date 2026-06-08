import type { DialogProps } from "../store";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { DownloadSimpleIcon, FileIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Badge } from "@reactive-resume/ui/components/badge";
import { Button } from "@reactive-resume/ui/components/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@reactive-resume/ui/components/dialog";
import { FormControl, FormItem, FormLabel, FormMessage } from "@reactive-resume/ui/components/form";
import { Input } from "@reactive-resume/ui/components/input";
import { Spinner } from "@reactive-resume/ui/components/spinner";
import { cn } from "@reactive-resume/utils/style";
import { Combobox } from "@/components/ui/combobox";
import { useFormBlocker } from "@/hooks/use-form-blocker";
import { createResume, saveResume } from "@/libs/local-resume";
import { useAppForm } from "@/libs/tanstack-form";
import { useDialogStore } from "../store";

// ---- Rate limiting (same as simple-chat.tsx) ----
const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_KEY = "craftisle-ai-last-request";

// ---- File size limits ----
const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCX_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_JSON_SIZE = 2 * 1024 * 1024; // 2MB

type ImportType = "pdf" | "docx" | "json";

const formSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal(""), file: z.undefined() }),
	z.object({
		type: z.literal("pdf"),
		file: z
			.instanceof(File)
			.refine((f) => f.type === "application/pdf", { message: "File must be a PDF" })
			.refine((f) => f.size <= MAX_PDF_SIZE, { message: "PDF file must be smaller than 5MB" }),
	}),
	z.object({
		type: z.literal("docx"),
		file: z
			.instanceof(File)
			.refine(
				(f) =>
					f.type === "application/msword" ||
					f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				{ message: "File must be a Microsoft Word document" },
			)
			.refine((f) => f.size <= MAX_DOCX_SIZE, { message: "Word file must be smaller than 2MB" }),
	}),
	z.object({
		type: z.literal("json"),
		file: z
			.instanceof(File)
			.refine((f) => f.type === "application/json" || f.name.endsWith(".json"), {
				message: "File must be a JSON file",
			})
			.refine((f) => f.size <= MAX_JSON_SIZE, { message: "JSON file must be smaller than 2MB" }),
	}),
]);

// ---- AI Prompt ----
const RESUME_PARSE_SYSTEM_PROMPT = `You are a resume parsing assistant. Extract all information from the provided resume text and output ONLY valid JSON matching this schema.

RULES:
1. Output ONLY the JSON object — no markdown, no code fences, no extra text.
2. Every item in every section MUST have an "id" field (empty string — will be filled later).
3. Strings should be empty "" if no data available, arrays should be [].
4. The "level" field is a number 0-10 representing skill/language proficiency (0 = not set).
5. All dates and periods should be kept as-is from the original text.
6. Preserve line breaks in descriptions and summaries.

Expected JSON structure (only output these fields — they will be merged into a complete resume template):
{
  "basics": {
    "name": "",
    "headline": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": { "url": "", "label": "" },
    "customFields": []
  },
  "summary": { "title": "", "content": "" },
  "sections": {
    "profiles": { "items": [{ "id": "", "network": "", "username": "", "website": { "url": "", "label": "" } }] },
    "experience": { "items": [{ "id": "", "company": "", "position": "", "location": "", "period": "", "description": "", "website": { "url": "", "label": "" } }] },
    "education": { "items": [{ "id": "", "school": "", "degree": "", "area": "", "grade": "", "location": "", "period": "", "description": "", "website": { "url": "", "label": "" } }] },
    "projects": { "items": [{ "id": "", "name": "", "period": "", "description": "", "website": { "url": "", "label": "" } }] },
    "skills": { "items": [{ "id": "", "name": "", "level": 0, "keywords": [] }] },
    "languages": { "items": [{ "id": "", "language": "", "fluency": "", "level": 0 }] },
    "certifications": { "items": [{ "id": "", "title": "", "issuer": "", "date": "", "description": "", "website": { "url": "", "label": "" } }] },
    "awards": { "items": [{ "id": "", "title": "", "awarder": "", "date": "", "description": "", "website": { "url": "", "label": "" } }] },
    "publications": { "items": [{ "id": "", "title": "", "publisher": "", "date": "", "description": "", "website": { "url": "", "label": "" } }] },
    "volunteer": { "items": [{ "id": "", "organization": "", "location": "", "period": "", "description": "", "website": { "url": "", "label": "" } }] },
    "interests": { "items": [{ "id": "", "name": "", "keywords": [] }] },
    "references": { "items": [{ "id": "", "name": "", "position": "", "phone": "", "description": "", "website": { "url": "", "label": "" } }] }
  }
}`;

// ---- PDF text extraction via CDN-loaded pdf.js ----
// pdf.js v3 loaded from CDN — no npm install needed, no native deps.
let pdfJsReady = false;
let pdfJsLoadPromise: Promise<void> | null = null;

function ensurePdfJsLoaded(): Promise<void> {
	if (pdfJsReady) return Promise.resolve();
	if (pdfJsLoadPromise) return pdfJsLoadPromise;

	pdfJsLoadPromise = new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
		script.onload = () => {
			// biome-ignore lint/suspicious/noExplicitAny: pdfjsLib is a global from CDN
			const win = window as any;
			win.pdfjsLib.GlobalWorkerOptions.workerSrc =
				"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
			pdfJsReady = true;
			resolve();
		};
		script.onerror = () => {
			pdfJsLoadPromise = null;
			reject(new Error("Failed to load PDF.js from CDN"));
		};
		document.head.appendChild(script);
	});
	return pdfJsLoadPromise;
}

async function extractPdfText(file: File): Promise<string> {
	await ensurePdfJsLoaded();
	const arrayBuffer = await file.arrayBuffer();
	// biome-ignore lint/suspicious/noExplicitAny: global
	const pdfjsLib = (window as any).pdfjsLib;
	const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

	const pages: string[] = [];
	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const textContent = await page.getTextContent();
		const pageText = (textContent.items as Array<{ str?: string }>)
			.filter((item) => typeof item.str === "string" && item.str.trim())
			.map((item) => item.str as string)
			.join(" ");
		if (pageText) pages.push(pageText);
	}
	return pages.join("\n\n");
}

// ---- DOCX text extraction via mammoth ----
async function extractDocxText(file: File): Promise<string> {
	const mammoth = await import("mammoth");
	const arrayBuffer = await file.arrayBuffer();
	const result = await mammoth.extractRawText({ arrayBuffer });
	return result.value.trim();
}

// ---- Normalize AI response ----
// AI might return { data: {...} } wrapper or raw data. Handle both.
// Also merge into a complete ResumeData by filling missing fields from defaultResumeData.
function normalizeResumeParse(raw: unknown): Record<string, unknown> {
	if (!raw || typeof raw !== "object") return raw as Record<string, unknown>;

	let obj = raw as Record<string, unknown>;

	// Unwrap .data wrapper if AI returned { data: { basics: ..., sections: ... } }
	if ("data" in obj && typeof obj.data === "object" && obj.data !== null) {
		const inner = obj.data as Record<string, unknown>;
		if ("basics" in inner || "sections" in inner) {
			obj = inner;
		}
	}

	return obj;
}

// ---- Deep merge helper ----
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): void {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
			deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else if (sv !== undefined) {
			target[key] = sv;
		}
	}
}

export function ImportResumeDialog(_: DialogProps<"resume.import">) {
	const navigate = useNavigate();
	const closeDialog = useDialogStore((state) => state.closeDialog);

	const inputRef = useRef<HTMLInputElement>(null);
	const [isImporting, setIsImporting] = useState(false);
	const [cooldownRemaining, setCooldownRemaining] = useState(0);

	// ---- Rate limit: restore from localStorage ----
	const hasRestoredRef = useRef(false);
	if (!hasRestoredRef.current) {
		const lastRaw = localStorage.getItem(RATE_LIMIT_KEY);
		if (lastRaw) {
			const remaining = Math.ceil((RATE_LIMIT_MS - (Date.now() - Number(lastRaw))) / 1000);
			if (remaining > 0) setCooldownRemaining(remaining);
		}
		hasRestoredRef.current = true;
	}

	// ---- Cooldown countdown ----
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	if (cooldownRemaining > 0 && !intervalRef.current) {
		intervalRef.current = setInterval(() => {
			const lastRaw = localStorage.getItem(RATE_LIMIT_KEY);
			if (!lastRaw) {
				setCooldownRemaining(0);
				if (intervalRef.current) clearInterval(intervalRef.current);
				intervalRef.current = null;
				return;
			}
			const remaining = Math.ceil((RATE_LIMIT_MS - (Date.now() - Number(lastRaw))) / 1000);
			if (remaining <= 0) {
				setCooldownRemaining(0);
				if (intervalRef.current) clearInterval(intervalRef.current);
				intervalRef.current = null;
			} else {
				setCooldownRemaining(remaining);
			}
		}, 1000);
	}

	const form = useAppForm({
		defaultValues: { type: "" as ImportType | "", file: undefined as File | undefined },
		validators: { onSubmit: formSchema },
		onSubmit: async ({ value }) => {
			if (value.type === "" || !value.file) return;

			// Rate limit check (only for AI-powered PDF/DOCX imports)
			if (value.type !== "json") {
				const lastRaw = localStorage.getItem(RATE_LIMIT_KEY);
				if (lastRaw) {
					const elapsed = Date.now() - Number(lastRaw);
					if (elapsed < RATE_LIMIT_MS) {
						const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
						setCooldownRemaining(remaining);
						toast.warning(`Please wait ${remaining} seconds before importing another resume.`);
						return;
					}
				}
			}

			setIsImporting(true);

			const toastId = toast.loading("Importing your resume...", {
				description:
					value.type === "json"
						? "Parsing JSON resume data..."
						: "Extracting text from file and calling AI to parse your resume...",
			});

			try {
				let parsed: Record<string, unknown>;
				let resumeName: string;

				if (value.type === "json") {
					// ---- JSON import: direct parse, no AI ----
					const text = await value.file.text();
					try {
						parsed = JSON.parse(text);
					} catch {
						throw new Error("Invalid JSON file. Please ensure the file is a valid Craftisle JSON export.");
					}

					parsed = normalizeResumeParse(parsed);

					// Try to get name from parsed data, fallback to filename
					const basics = (parsed.basics || {}) as Record<string, unknown>;
					resumeName =
						typeof basics.name === "string" && basics.name.trim()
							? basics.name.trim()
							: value.file.name.replace(/\.json$/i, "");
				} else {
					// ---- PDF/DOCX import: extract text + AI parse ----
					let extractedText: string;
					if (value.type === "pdf") {
						toast.loading("Extracting text from PDF...", { id: toastId });
						extractedText = await extractPdfText(value.file);
					} else {
						toast.loading("Extracting text from Word document...", { id: toastId });
						extractedText = await extractDocxText(value.file);
					}

					if (!extractedText || extractedText.trim().length < 10) {
						throw new Error("The file contains too little text to parse a resume.");
					}

					// Call AI (same proxy as chat dialog)
					toast.loading("AI is parsing your resume...", { id: toastId });

					const aiResponse = await fetch("/api/ai/chat", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							model: "agnes-2.0-flash",
							messages: [
								{ role: "system", content: RESUME_PARSE_SYSTEM_PROMPT },
								{ role: "user", content: `Parse this resume text into the specified JSON format:\n\n${extractedText}` },
							],
							stream: false,
						}),
					});

					if (!aiResponse.ok) {
						throw new Error(`AI service returned status ${aiResponse.status}`);
					}

					const aiData = await aiResponse.json();
					const content = aiData.choices?.[0]?.message?.content;

					if (!content || typeof content !== "string") {
						throw new Error("AI returned no content.");
					}

					// Parse AI response as JSON
					try {
						const cleaned = content
							.replace(/^```json\s*/i, "")
							.replace(/^```\s*/i, "")
							.replace(/\s*```$/, "")
							.trim();
						parsed = JSON.parse(cleaned);
					} catch {
						throw new Error("AI returned invalid JSON. Please try again.");
					}

					parsed = normalizeResumeParse(parsed);

					const basics = (parsed.basics || {}) as Record<string, unknown>;
					resumeName =
						typeof basics.name === "string" && basics.name.trim()
							? basics.name.trim()
							: value.file.name.replace(/\.(pdf|docx?)$/i, "");

					// Set rate limit after success (only for AI imports)
					localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
					setCooldownRemaining(60);
				}

				// Merge parsed data with default resume data
				const { defaultResumeData } = await import("@reactive-resume/schema/resume/default");
				const mergedData = structuredClone(defaultResumeData) as Record<string, unknown>;
				deepMerge(mergedData, parsed);

				// Create resume in localStorage
				const created = createResume(resumeName, false);
				created.data = mergedData as never;
				saveResume(created);

				toast.success("Your resume has been imported successfully.", { id: toastId, description: null });
				closeDialog();
				void navigate({ to: "/builder/$resumeId", params: { resumeId: created.id } });
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : "An unknown error occurred while importing your resume.";
				toast.error(message, { id: toastId, description: null });
			} finally {
				setIsImporting(false);
			}
		},
	});

	const type = useStore(form.store, (s) => s.values.type);

	const onSelectFile = () => {
		if (!inputRef.current) return;
		inputRef.current.click();
	};

	const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		form.setFieldValue("file", file);
	};

	useFormBlocker(form);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex items-center gap-x-2">
					<DownloadSimpleIcon />
					<Trans>Import an existing resume</Trans>
				</DialogTitle>
				<DialogDescription>
					<Trans>
						Upload a PDF, Microsoft Word, or Craftisle JSON resume. AI will extract the content from PDF/Word files,
						while JSON files will be imported directly without modification.
					</Trans>
				</DialogDescription>
			</DialogHeader>

			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<form.Field name="type">
					{(field) => (
						<FormItem hasError={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
							<FormLabel>
								<Trans>File Type</Trans>
							</FormLabel>
							<FormControl
								render={
									<Combobox
										showClear={false}
										value={field.state.value}
										onValueChange={(value) => {
											const nextType = value as ImportType | "";
											if (nextType !== field.state.value) form.setFieldValue("file", undefined);
											field.handleChange(nextType);
										}}
										options={[
											{
												value: "json",
												label: (
													<div className="flex items-center gap-x-2">
														{t({ comment: "File format label in import source selector", message: "Craftisle JSON" })}
													</div>
												),
											},
											{
												value: "pdf",
												label: (
													<div className="flex items-center gap-x-2">
														{t({ comment: "File format label in import source selector", message: "PDF Document" })}{" "}
														<Badge>{t`AI`}</Badge>
													</div>
												),
											},
											{
												value: "docx",
												label: (
													<div className="flex items-center gap-x-2">
														{t({ comment: "File format label in import source selector", message: "Microsoft Word" })}{" "}
														<Badge>{t`AI`}</Badge>
													</div>
												),
											},
										]}
									/>
								}
							/>
							<FormMessage errors={field.state.meta.errors} />
						</FormItem>
					)}
				</form.Field>

				<form.Field key={type} name="file">
					{(field) => (
						<FormItem
							className={cn(!type && "hidden")}
							hasError={field.state.meta.isTouched && field.state.meta.errors.length > 0}
						>
							<FormControl>
								<Input
									type="file"
									className="hidden"
									ref={inputRef}
									onChange={onUploadFile}
									accept={
										type === "json"
											? ".json,application/json"
											: type === "pdf"
												? ".pdf,application/pdf"
												: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
									}
								/>

								<Button
									variant="outline"
									className="h-auto w-full flex-col border-dashed py-8 font-normal"
									onClick={onSelectFile}
								>
									{field.state.value ? (
										<>
											<FileIcon weight="thin" size={32} />
											<p>{field.state.value.name}</p>
											<p className="text-muted-foreground text-xs">
												{(field.state.value.size / 1024 / 1024).toFixed(1)} MB
											</p>
										</>
									) : (
										<>
											<UploadSimpleIcon weight="thin" size={32} />
											<Trans>Click here to select a file to import</Trans>
										</>
									)}
								</Button>
							</FormControl>
							<FormMessage errors={field.state.meta.errors} />
						</FormItem>
					)}
				</form.Field>

				{/* Rate limit warning (only for AI-powered imports) */}
				{type !== "json" && cooldownRemaining > 0 && (
					<p className="text-amber-600 text-sm">
						Please wait {cooldownRemaining} seconds before importing another resume.
					</p>
				)}

				<DialogFooter>
					<Button type="submit" disabled={!type || isImporting || (type !== "json" && cooldownRemaining > 0)}>
						{isImporting ? <Spinner /> : null}
						{isImporting ? "Importing..." : "Import"}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
