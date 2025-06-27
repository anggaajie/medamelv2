import { User as FirebaseUser, Auth as FirebaseAuth } from 'firebase/auth';

export enum UserRole {
  JOB_SEEKER = 'Pencari Kerja',
  COMPANY = 'Perusahaan',
  TRAINING_PROVIDER = 'Penyedia Pelatihan',
  ADMIN = 'Admin',
}

export interface Address {
  street: string;
  city: string;
  province: string;
  zipCode: string;
}

export interface SocialMediaLinks {
  linkedIn?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
}

export interface EducationEntry {
  id: string; // For key in React list
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  gpa?: string;
  graduationYear?: string;
  certificateFile?: File | null;
  certificateUrl?: string;
  certificateFileName?: string;
}

export interface LanguageSkill {
  id: string; // For key in React list
  language: string;
  proficiency: 'Dasar' | 'Percakapan' | 'Mahir' | 'Native';
}

export interface WorkHistoryEntry {
  id: string; // For key in React list
  organization: string;
  role: string;
  startDate?: string; // YYYY-MM
  endDate?: string; // YYYY-MM
  description?: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role: UserRole;
  status: 'active' | 'inactive';

  // Detailed Profile Fields
  dateOfBirth?: string; // YYYY-MM-DD
  
  nationalIdFile?: File | null; // For upload
  nationalIdUrl?: string;
  nationalIdFileName?: string;
  
  taxIdFile?: File | null; // For upload
  taxIdUrl?: string;
  taxIdFileName?: string;
  
  gender?: 'Laki-laki' | 'Perempuan' | 'Lainnya' | '';
  maritalStatus?: 'Belum Menikah' | 'Menikah' | 'Bercerai' | 'Janda/Duda' | '';
  religion?: string;
  nationality?: string;
  motherName?: string;
  
  phoneNumber?: string;
  address?: Address;
  socialMedia?: SocialMediaLinks;
  
  educationHistory?: EducationEntry[];
  languageSkills?: LanguageSkill[];
  workHistory?: WorkHistoryEntry[];
  
  profileLastUpdated?: number; // Timestamp (Date.now())
  createdAt?: number; // Timestamp for user creation
}

export type UserProfileData = Partial<User>;

// --- Job Search System Types ---

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Kontrak',
  INTERNSHIP = 'Magang',
  FREELANCE = 'Freelance',
}

export enum ExperienceLevel {
  ENTRY_LEVEL = 'Entry-level',
  JUNIOR = 'Junior',
  MID_LEVEL = 'Mid-level',
  SENIOR_LEVEL = 'Senior-level',
  MANAGER = 'Manager',
  EXECUTIVE = 'Eksekutif',
}

export interface JobListing {
  id: string; // Firestore document ID
  title: string;
  companyId: string; // UID of the posting company user
  companyName: string; // Denormalized company name
  companyLogoUrl?: string; // Optional company logo
  location: string; // e.g., "Jakarta, Indonesia"
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: ExperienceLevel;
  description: string; // HTML or Markdown
  requirements: string; // HTML or Markdown
  postedAt: number; // Timestamp (Date.now() or Firestore serverTimestamp)
  isActive: boolean; // To control visibility
  industry?: string;
  skillsRequired?: string[];
}

export enum ApplicationStatus {
  PENDING = 'pending', 
  REVIEWED = 'reviewed', 
  INTERVIEWING = 'interviewing', 
  OFFERED = 'offered', 
  ACCEPTED = 'accepted', 
  REJECTED = 'rejected', 
  WITHDRAWN = 'withdrawn', 
}

export interface JobApplication {
  id: string; 
  jobId: string; 
  jobTitle: string; 
  applicantId: string; 
  applicantName: string; 
  applicantEmail?: string; 
  companyId: string; 
  companyName: string; 
  appliedAt: number; 
  status: ApplicationStatus;
  resumeUrl: string; 
  resumeFileName: string;
  coverLetterUrl?: string; 
  coverLetterFileName?: string; 
  coverLetterText?: string; 
  additionalDocuments?: Array<{ url: string; name: string; type: string }>; 
  notes?: string; 
  lastStatusUpdate?: number; 

  assessmentNotes?: string; 
  assessmentRating?: 1 | 2 | 3 | 4 | 5; 
  assessmentTags?: string[]; 
  lastAssessmentUpdate?: number; 
}

// --- Training System Types ---

export const TrainingCategories = [
  'Teknologi Informasi',
  'Pengembangan Diri',
  'Bisnis & Manajemen',
  'Desain Kreatif',
  'Bahasa',
  'Pemasaran & Penjualan',
  'Keuangan & Akuntansi',
  'Kesehatan & Kebugaran',
  'Lainnya',
] as const;

export type TrainingCategory = typeof TrainingCategories[number];

export interface TrainingProgram {
  id: string; // Firestore document ID
  title: string;
  providerId: string; // UID of the TrainingProvider user
  providerName: string; // Denormalized name of the provider
  providerLogoUrl?: string; // Optional
  category: TrainingCategory;
  description: string; // HTML content for rich text
  duration: string; // e.g., "4 Minggu", "20 Jam Total"
  location: string; // e.g., "Online via Zoom", "Offline - Gedung Medamel Lt. 5, Jakarta"
  cost: number; // Price in IDR, 0 for free
  instructorInfo: string; // Name and brief bio of instructor(s)
  syllabus: string[]; // Array of module names or topics
  targetAudience: string;
  prerequisites: string;
  learningObjectives: string[]; // Array of learning outcomes
  certificateName?: string; // Name of certificate if issued, e.g., "Sertifikat Penyelesaian Medamel"
  postedAt: number; // Timestamp (Date.now() or Firestore serverTimestamp)
  isActive: boolean; // To control visibility
  updatedAt?: number; // Timestamp for last update
}

export enum TrainingRegistrationStatus {
  PENDING_PAYMENT = 'Menunggu Pembayaran',
  CONFIRMED = 'Terkonfirmasi',
  COMPLETED = 'Selesai',
  CANCELLED_USER = 'Dibatalkan oleh Peserta',
  CANCELLED_PROVIDER = 'Dibatalkan oleh Penyedia',
}

export interface TrainingRegistration {
  id: string; // Firestore document ID
  programId: string;
  programTitle: string; // Denormalized
  userId: string; // UID of the registered user
  userName: string; // Denormalized
  userEmail?: string; // Denormalized
  providerId: string; // UID of the TrainingProvider user (from TrainingProgram)
  registrationDate: any; // Firestore Server Timestamp on creation, number on read
  status: TrainingRegistrationStatus;
  paymentDetails?: { 
    method: string;
    transactionId: string;
    amount: number;
    paidAt: number;
  };
  completionDate?: number; // Timestamp, set when status is COMPLETED
  certificateUrl?: string; // URL to digital certificate if issued
}

export interface TrainingProgress {
  id: string; // programId_userId
  userId: string;
  programId: string;
  completedModules: string[]; // IDs or names of completed syllabus items
  overallProgress: number; // Percentage 0-100
  lastAccessed: number; // Timestamp
  score?: number; // If there's an assessment
}

// --- Internship Program System Types ---

export const InternshipCategories = [
  'Teknologi Informasi',
  'Bisnis & Manajemen',
  'Pemasaran & Penjualan',
  'Keuangan & Akuntansi',
  'Desain & Kreatif',
  'Sumber Daya Manusia',
  'Operasional',
  'Penelitian & Pengembangan',
  'Layanan Pelanggan',
  'Lainnya',
] as const;

export type InternshipCategory = typeof InternshipCategories[number];

export enum InternshipDuration {
  SHORT_TERM = '1-3 Bulan',
  MEDIUM_TERM = '3-6 Bulan',
  LONG_TERM = '6-12 Bulan',
  FLEXIBLE = 'Fleksibel',
}

export enum InternshipType {
  FULL_TIME = 'Full Time',
  PART_TIME = 'Part Time',
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
}

export enum InternshipStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Aktif',
  PAUSED = 'Ditangguhkan',
  CLOSED = 'Ditutup',
}

export interface InternshipProgram {
  id: string; // Firestore document ID
  title: string;
  companyId: string; // UID of the posting company user
  companyName: string; // Denormalized company name
  companyLogoUrl?: string; // Optional company logo
  category: InternshipCategory;
  description: string; // HTML content for rich text
  duration: InternshipDuration;
  internshipType: InternshipType;
  location: string; // e.g., "Jakarta Selatan", "Remote"
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
  applicationDeadline?: string; // YYYY-MM-DD format
  stipend?: number; // Monthly stipend in IDR, 0 for unpaid
  benefits: string[]; // Array of benefits like "BPJS", "Transport Allowance", etc.
  requirements: string; // HTML content for requirements
  responsibilities: string[]; // Array of job responsibilities
  learningObjectives: string[]; // Array of what intern will learn
  skillsRequired: string[]; // Array of required skills
  preferredSkills?: string[]; // Array of preferred skills
  maxApplicants?: number; // Maximum number of applicants
  currentApplicants: number; // Current number of applicants
  mentorInfo?: string; // Information about the mentor/supervisor
  postedAt: number; // Timestamp (Date.now() or Firestore serverTimestamp)
  status: InternshipStatus;
  isActive: boolean; // To control visibility
  updatedAt?: number; // Timestamp for last update
}

export enum InternshipApplicationStatus {
  PENDING = 'Menunggu Review',
  UNDER_REVIEW = 'Sedang Direview',
  SHORTLISTED = 'Shortlisted',
  INTERVIEW_SCHEDULED = 'Interview Dijadwalkan',
  INTERVIEW_COMPLETED = 'Interview Selesai',
  OFFERED = 'Diterima',
  ACCEPTED = 'Diterima oleh Kandidat',
  REJECTED = 'Ditolak',
  WITHDRAWN = 'Ditarik',
}

export interface InternshipApplication {
  id: string; // Firestore document ID
  internshipId: string;
  internshipTitle: string; // Denormalized
  applicantId: string; // UID of the applicant
  applicantName: string; // Denormalized
  applicantEmail: string; // Denormalized
  companyId: string; // UID of the company
  companyName: string; // Denormalized
  appliedAt: number; // Timestamp
  status: InternshipApplicationStatus;
  
  // Application materials
  resumeUrl: string;
  resumeFileName: string;
  coverLetterUrl?: string;
  coverLetterFileName?: string;
  coverLetterText?: string;
  portfolioUrl?: string;
  transcriptUrl?: string;
  transcriptFileName?: string;
  additionalDocuments?: Array<{ url: string; name: string; type: string }>;
  
  // Interview details
  interviewDate?: number; // Timestamp
  interviewLocation?: string;
  interviewNotes?: string;
  
  // Assessment
  assessmentNotes?: string;
  assessmentRating?: 1 | 2 | 3 | 4 | 5;
  assessmentTags?: string[];
  lastAssessmentUpdate?: number;
  
  // Status updates
  lastStatusUpdate?: number;
  statusHistory?: Array<{
    status: InternshipApplicationStatus;
    timestamp: number;
    notes?: string;
  }>;
}

export interface InternshipProgress {
  id: string; // internshipId_applicantId
  internshipId: string;
  applicantId: string;
  startDate: number; // Timestamp when internship starts
  endDate?: number; // Timestamp when internship ends
  status: 'ONGOING' | 'COMPLETED' | 'TERMINATED';
  progressReports?: Array<{
    week: number;
    reportDate: number;
    tasksCompleted: string[];
    challenges: string[];
    learnings: string[];
    nextWeekGoals: string[];
    mentorFeedback?: string;
  }>;
  finalReport?: {
    overallExperience: string;
    skillsGained: string[];
    recommendations: string;
    rating: 1 | 2 | 3 | 4 | 5;
  };
  certificateUrl?: string; // URL to completion certificate
}

// --- Psychometric Testing System Types ---
export enum PsychometricTestType {
  MBTI = 'MBTI',
  KRAEPELIN = 'Tes Kraepelin', 
  PAPI_KOSTICK = 'PAPI Kostick', 
}

export const PsychometricTestDescriptions: Record<PsychometricTestType, { name: string; description: string; icon?: string, pathSuffix: string, available: boolean }> = {
  [PsychometricTestType.MBTI]: {
    name: 'MBTI (Myers-Briggs Type Indicator)',
    description: 'Tes kepribadian untuk memahami preferensi dalam melihat dunia dan membuat keputusan. (Versi simulasi untuk ilustrasi)',
    icon: 'fas fa-brain',
    pathSuffix: 'mbti',
    available: true,
  },
  [PsychometricTestType.KRAEPELIN]: {
    name: 'Tes Kraepelin/Pauli',
    description: 'Tes kemampuan numerik dan konsentrasi yang mengukur kecepatan, ketelitian, dan daya tahan kerja. (Simulasi Sederhana)',
    icon: 'fas fa-calculator',
    pathSuffix: 'kraepelin',
    available: true,
  },
  [PsychometricTestType.PAPI_KOSTICK]: {
    name: 'PAPI Kostick Test',
    description: 'Inventory kepribadian yang mengukur aspek-aspek peran dan kebutuhan individu dalam konteks pekerjaan. (Simulasi Sederhana)',
    icon: 'fas fa-user-tie',
    pathSuffix: 'papi-kostick',
    available: true,
  },
};

export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP';
export type MBTIChoice = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MBTIQuestion {
  id: string;
  text: string;
  dimension: MBTIDimension; 
  optionA: { text: string; value: MBTIChoice }; 
  optionB: { text: string; value: MBTIChoice }; 
}

export interface MBTIResultData {
  scores: Record<MBTIChoice, number>;
  mbtiType: string; 
  mbtiTitle?: string; 
  mbtiDescription?: string; 
}

export type KraepelinAspect = 'concentration' | 'speed' | 'accuracy' | 'stamina';

export interface KraepelinOption {
  text: string;
  score: number; 
  aspect: KraepelinAspect;
}

export interface KraepelinQuestion {
  id: string;
  text: string;
  options: KraepelinOption[];
}

export interface KraepelinResultData {
  scores: Record<KraepelinAspect, number>;
  profileSummary: string;
  profileDescription?: string;
}

export enum PAPIKostickDimension {
  LEADERSHIP = 'L', 
  ACTIVITY_PACE = 'P', 
  SOCIAL_EXTROVERSION = 'X', 
  NEED_TO_CONTROL_OTHERS = 'A', 
  THEORETICAL_TYPE = 'R', 
  INTEREST_IN_WORKING_WITH_DETAILS = 'D', 
  ORGANIZED_TYPE = 'C', 
  NEED_FOR_CLOSENESS_AND_AFFECTION = 'O', 
  NEED_TO_BELONG_TO_GROUP = 'B', 
  NEED_FOR_RULES_AND_SUPERVISION = 'Z', 
  ROLE_OF_HARD_INTENSE_WORKER = 'N', 
  ROLE_OF_FINISHER_OF_TASKS = 'G', 
  ROLE_OF_PLANNER_AND_ORGANIZER = 'I', 
  ROLE_OF_EMOTIONALLY_RESTRAINED_PERSON = 'E', 
  NEED_TO_BE_SUPPORTIVE = 'S', 
  NEED_TO_BE_AGGRESSIVE = 'K', 
  NEED_FOR_CHANGE = 'T', 
  NEED_TO_BE_FORCEFUL = 'V', 
  EASE_IN_DECISION_MAKING = 'W', 
  NEED_TO_FINISH_A_TASK_BEGUN = 'F', 
}

export interface PAPIKostickStatement {
    text: string;
    dimension: PAPIKostickDimension;
}
export interface PAPIKostickPair {
    id: string;
    statementA: PAPIKostickStatement;
    statementB: PAPIKostickStatement;
}
export interface PAPIKostickResultData {
    scores: Record<PAPIKostickDimension, number>;
    dominantDimensions: Array<{ dimension: PAPIKostickDimension; name: string; description: string; score: number }>;
    profileSummary: string;
}

export interface PsychometricTestResult {
  id: string; // Firestore document ID
  userId: string;
  testType: PsychometricTestType;
  testDate: number; // Timestamp
  resultData: MBTIResultData | KraepelinResultData | PAPIKostickResultData | any; // Specific data structure
  careerRecommendations?: string[]; // Array of career recommendation strings
}

// --- CV Builder System Types ---

export enum CVSectionType {
  PERSONAL_DETAILS = 'Data Pribadi',
  CONTACT = 'Kontak',
  SUMMARY = 'Ringkasan Profesional',
  EXPERIENCE = 'Pengalaman Kerja',
  EDUCATION = 'Pendidikan',
  SKILLS = 'Keterampilan',
  LANGUAGES = 'Bahasa',
  PROJECTS = 'Proyek',
  AWARDS = 'Penghargaan & Sertifikasi',
  REFERENCES = 'Referensi',
  CUSTOM = 'Bagian Kustom',
}

export enum CVFieldType {
  TEXT_INPUT = 'text',
  TEXT_AREA = 'textarea', 
  DATE_INPUT = 'date', 
  MONTH_YEAR_INPUT = 'month-year', 
  LIST_EDITOR = 'list_editor', 
}

export interface CVField<T = any> {
  id: string; 
  label: string;
  value: T;
  type: CVFieldType;
  placeholder?: string;
}

export interface CVExperienceEntry {
  id: string; 
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string; 
  endDate: string; 
  isCurrent?: boolean;
  description: string; 
}

export interface CVEducationEntry {
  id: string; 
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  graduationYear: string; 
  gpa?: string;
  description?: string; 
}

export interface CVSkillEntry {
  id: string; 
  skillName: string;
  proficiency?: 'Dasar' | 'Menengah' | 'Mahir' | 'Ahli'; 
}

export interface CVLanguageEntry {
  id: string; 
  language: string;
  proficiency: 'Dasar' | 'Percakapan' | 'Mahir' | 'Native';
}

export interface CVProjectEntry {
  id: string; 
  projectName: string;
  description: string; 
  url?: string;
  technologiesUsed?: string; 
}

export interface CVSection {
  id: string; 
  type: CVSectionType;
  title: string; 
  order: number;
  fields?: CVField<string>[]; 
  data?: CVExperienceEntry[] | CVEducationEntry[] | CVSkillEntry[] | CVProjectEntry[] | CVLanguageEntry[]; 
  customContent?: string; 
}


export const DefaultCVSectionTitles: Record<CVSectionType, string> = {
  [CVSectionType.PERSONAL_DETAILS]: 'Data Pribadi',
  [CVSectionType.CONTACT]: 'Informasi Kontak',
  [CVSectionType.SUMMARY]: 'Ringkasan Profesional',
  [CVSectionType.EXPERIENCE]: 'Pengalaman Kerja',
  [CVSectionType.EDUCATION]: 'Riwayat Pendidikan',
  [CVSectionType.SKILLS]: 'Keterampilan',
  [CVSectionType.LANGUAGES]: 'Kemampuan Bahasa',
  [CVSectionType.PROJECTS]: 'Proyek Pribadi & Portofolio',
  [CVSectionType.AWARDS]: 'Penghargaan & Sertifikasi',
  [CVSectionType.REFERENCES]: 'Referensi',
  [CVSectionType.CUSTOM]: 'Bagian Tambahan',
};

export interface UserCV {
  id: string; // Firestore document ID
  userId: string;
  title: string; // User-defined title for this CV, e.g., "CV untuk Posisi Frontend"
  templateId: string; // For now, will be "default"
  sections: CVSection[];
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp for versioning
  version: number; // Simple version number
}

export interface UserActivityLog {
  id: string; // Firestore document ID
  userId: string;
  userDisplayName?: string | null;
  userEmail?: string | null;
  action: string; // e.g., "LOGIN", "PROFILE_UPDATE", "JOB_APPLY"
  timestamp: any; // Firestore Server Timestamp
  details?: Record<string, any>; // e.g., { jobId: "xyz", newRole: "Company" }
}

// --- LiveKit / Video Interview Types ---
export interface VideoInterviewSession {
  id: string; // Firestore document ID / Unique room ID
  roomName: string;
  companyId: string;
  companyName: string;
  // candidateId?: string; // Optional: if directly tied to a user
  // candidateName?: string; // Optional
  // jobId?: string; // Optional: if tied to a specific job application
  scheduledTime?: number; // Timestamp for scheduled interviews
  createdAt: number; // Timestamp
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

// --- Message and Notification System Types ---

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: number;
  readAt?: number;
  actionUrl?: string;
  actionText?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  timestamp: number;
  isRead: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: Message;
  lastActivity: number;
  unreadCount: Record<string, number>; // userId -> count
  isGroupChat: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: number;
}

export interface MBTIResult {
  type: string;
  description: string;
  traits: string[];
}
