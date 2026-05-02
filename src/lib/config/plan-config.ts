// Central plan configuration for the ebook generator
// All plan tiers, format types, page ranges, and monthly limits in one place

export type FormatType =
  | 'playbook'
  | 'cheatsheet'
  | 'ebook'
  | 'research_paper'
  | 'thesis'
  | 'dissertation'
  | 'lecture_notes'
  | 'syllabus'
  | 'whitepaper'
  | 'technical_manual'
  | 'certification_guide';

export type PlanTier = 'free' | 'scholar' | 'librarian';

export interface FormatConfig {
  id: FormatType;
  label: string;
  description: string;
  category: 'standard' | 'academic' | 'professional';
}

export interface PlanConfig {
  tier: PlanTier;
  label: string;
  monthlyLimit: number;
  pageRange: { min: number; max: number };
  allowedFormats: FormatType[];
  qualityTier: string;
}

// All available document formats
export const FORMAT_REGISTRY: Record<FormatType, FormatConfig> = {
  playbook: {
    id: 'playbook',
    label: 'Playbook',
    description: 'Actionable step-by-step guides with frameworks and exercises',
    category: 'standard',
  },
  cheatsheet: {
    id: 'cheatsheet',
    label: 'Cheatsheet',
    description: 'Concise quick-reference documents with key facts and formulas',
    category: 'standard',
  },
  ebook: {
    id: 'ebook',
    label: 'Standard Ebook',
    description: 'Full-length narrative books for any topic or industry',
    category: 'standard',
  },
  research_paper: {
    id: 'research_paper',
    label: 'Research Paper',
    description: 'Academic research papers with abstract, methodology, and citations',
    category: 'academic',
  },
  thesis: {
    id: 'thesis',
    label: 'Thesis',
    description: 'Graduate-level thesis with literature review and analysis',
    category: 'academic',
  },
  dissertation: {
    id: 'dissertation',
    label: 'Dissertation',
    description: 'PhD-level dissertation with comprehensive original research',
    category: 'academic',
  },
  lecture_notes: {
    id: 'lecture_notes',
    label: 'Lecture Notes',
    description: 'Structured educational materials for university courses',
    category: 'academic',
  },
  syllabus: {
    id: 'syllabus',
    label: 'Course Syllabus',
    description: 'Complete course syllabus with schedule, readings, and assessments',
    category: 'academic',
  },
  whitepaper: {
    id: 'whitepaper',
    label: 'Corporate Whitepaper',
    description: 'Authoritative industry reports with data-driven insights',
    category: 'professional',
  },
  technical_manual: {
    id: 'technical_manual',
    label: 'Technical Manual',
    description: 'Comprehensive technical documentation with procedures and specs',
    category: 'professional',
  },
  certification_guide: {
    id: 'certification_guide',
    label: 'Certification Guide',
    description: 'Exam preparation guides with practice questions and study plans',
    category: 'professional',
  },
};

// Plan tier definitions
export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    tier: 'free',
    label: 'Reader',
    monthlyLimit: 50, // Temporarily increased for testing
    pageRange: { min: 22, max: 25 },
    allowedFormats: ['playbook', 'cheatsheet'],
    qualityTier: 'Standard',
  },
  scholar: {
    tier: 'scholar',
    label: 'Scholar',
    monthlyLimit: 10,
    pageRange: { min: 240, max: 300 },
    allowedFormats: [
      'playbook', 'cheatsheet', 'ebook',
      'research_paper', 'thesis', 'dissertation',
      'lecture_notes', 'syllabus',
    ],
    qualityTier: 'High Standard (Scholarly)',
  },
  librarian: {
    tier: 'librarian',
    label: 'Librarian',
    monthlyLimit: 25,
    pageRange: { min: 720, max: 1000 },
    allowedFormats: [
      'playbook', 'cheatsheet', 'ebook',
      'research_paper', 'thesis', 'dissertation',
      'lecture_notes', 'syllabus',
      'whitepaper', 'technical_manual', 'certification_guide',
    ],
    qualityTier: 'Highest Standard (Publication-Grade)',
  },
};

// Helper: Get the plan config for a given plan tier
export function getPlanConfig(tier: PlanTier): PlanConfig {
  return PLAN_CONFIGS[tier];
}

// Helper: Get available formats for a plan tier as FormatConfig[]
export function getAvailableFormats(tier: PlanTier): FormatConfig[] {
  const plan = PLAN_CONFIGS[tier];
  return plan.allowedFormats.map((id) => FORMAT_REGISTRY[id]);
}

// Helper: Check if a format is allowed for a plan tier
export function isFormatAllowed(tier: PlanTier, format: FormatType): boolean {
  return PLAN_CONFIGS[tier].allowedFormats.includes(format);
}
