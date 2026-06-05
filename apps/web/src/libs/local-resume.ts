import type { ResumeData } from "@reactive-resume/schema/resume/data";
import { defaultResumeData } from "@reactive-resume/schema/resume/default";

const STORAGE_KEY = "craftisle-resumes";
const CURRENT_RESUME_ID_KEY = "craftisle-current-resume-id";

export interface ResumeMetadata {
  id: string;
  name: string;
  slug: string;
  tags: string[];
  isLocked: boolean;
  updatedAt: string;
  hasPassword?: boolean;
  isPublic?: boolean;
}

export interface Resume extends ResumeMetadata {
  data: ResumeData;
}

function now(): string {
  return new Date().toISOString();
}

function generateId(): string {
  return crypto.randomUUID();
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ---- Public API ----

export function getResumes(): Resume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getResumeMetadata(): ResumeMetadata[] {
  return getResumes().map(({ data: _data, ...meta }) => meta);
}

export function getResume(id: string): Resume | undefined {
  return getResumes().find((r) => r.id === id);
}

export function saveResume(resume: Resume): void {
  const resumes = getResumes();
  const idx = resumes.findIndex((r) => r.id === resume.id);
  if (idx >= 0) {
    resumes[idx] = resume;
  } else {
    resumes.push(resume);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
}

export function deleteResume(id: string): void {
  const resumes = getResumes().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  if (getCurrentResumeId() === id) {
    localStorage.removeItem(CURRENT_RESUME_ID_KEY);
  }
}

export function createResume(name: string, withSampleData: boolean = false): Resume {
  const id = generateId();
  const slug = slugify(name) || generateId().slice(0, 8);
  const data = withSampleData
    ? { ...defaultResumeData } // TODO: merge sample data if needed
    : { ...defaultResumeData };

  // Set a default name/headline so the resume isn't completely empty
  if (!withSampleData) {
    data.basics.name = name;
  }

  const resume: Resume = {
    id,
    name,
    slug,
    tags: [],
    data,
    isLocked: false,
    updatedAt: now(),
  };

  saveResume(resume);
  return resume;
}

export function setCurrentResumeId(id: string): void {
  localStorage.setItem(CURRENT_RESUME_ID_KEY, id);
}

export function getCurrentResumeId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_RESUME_ID_KEY);
}

// Update only metadata fields (name, slug, tags, etc.)
export function updateResumeMetadata(id: string, patch: Partial<ResumeMetadata>): Resume | undefined {
  const resume = getResume(id);
  if (!resume) return undefined;
  Object.assign(resume, patch);
  resume.updatedAt = now();
  saveResume(resume);
  return resume;
}

// Update resume data (the actual resume content)
export function updateResumeData(id: string, data: ResumeData): Resume | undefined {
  const resume = getResume(id);
  if (!resume) return undefined;
  resume.data = data;
  resume.updatedAt = now();
  saveResume(resume);
  return resume;
}
