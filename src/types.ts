export type UserRole = 'student' | 'admin';

export interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  completedLessons: number;
  completedEncounters?: number[];
  confirmationSent: boolean;
  confirmationSentAt?: string;
  enrolledAt: string;
  lastAccess?: string;
}

export interface DynamicCard {
  id: string;
  unitId: string; // 'unit-1', 'unit-2', 'unit-3', 'unit-4'
  column: '1' | '2' | '3';
  title: string;
  description: string;
  createdAt: number;
  author?: string;
}

export interface StudyFolder {
  id: string;
  label: string;
  description?: string;
}

export interface StudyMaterial {
  id: string;
  folder: string; // 'M1', 'M2', 'M3', 'M4'
  type: string;
  title: string;
  description?: string;
  fileUrl?: string;
  addedAt?: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  desc: string;
  category: 'fondamentali' | 'tecnologia' | 'etica_societa' | 'sicurezza' | 'cultura_digitale';
}

export interface CourseSubSection {
  id: string;
  encounterNumber: number;
  number: string;
  title: string;
  subtitle: string;
  keyPoints: string[];
  calloutTitle?: string;
  calloutText?: string;
  footerLabel: string;
  footerValue: string;
  hasOpenDetail?: boolean;
}

export interface CourseUnit {
  id: string;
  unitNumber: number; // Modulo 1..4
  title: string;
  fullTitle: string;
  encountersRange: string;
  dateStr: string;
  dateShort: string;
  shortDesc: string;
  sections: CourseSubSection[];
}

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
