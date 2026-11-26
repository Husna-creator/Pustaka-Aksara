export type CollectionFormat =
  | "E-Book"
  | "Jurnal"
  | "Audiobook"
  | "Arsip Digital";

export type LicenseStatus =
  | "Tersedia"
  | "Open Access"
  | "Antrean Terbatas";

export interface ChapterContent {
  id: string;
  number: string;
  title: string;
  durationMinutes?: number;
  paragraphs: string[];
  pullQuote?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorRole?: string;
  format: CollectionFormat;
  subject: string;
  ddc: string;
  isbnOrIssn: string;
  publisher: string;
  year: number;
  language: string;
  pages?: number;
  durationLabel?: string;
  totalAudioSeconds?: number;
  licenseStatus: LicenseStatus;
  availableCopies: number;
  totalCopies: number;
  borrowCount: number;
  isEditorsPick?: boolean;
  isTrending?: boolean;
  synopsis: string;
  coverImage?: string;
  coverPalette: {
    bg: string;
    accent: string;
    ink: string;
    motif: "arch" | "wave" | "botanical" | "compass" | "grid" | "manuscript";
  };
  chapters: ChapterContent[];
  volumeIssue?: string;
  doi?: string;
}

export interface BorrowedRecord {
  itemId: string;
  borrowedAt: number;
  dueAt: number;
}

export interface ReadingProgress {
  itemId: string;
  chapterIndex: number;
  percent: number;
  currentPage: number;
  audioSeconds: number;
  lastReadAt: number;
}

export type ReaderTheme = "paper" | "sepia" | "dark";
export type ReaderFontSize = "sm" | "md" | "lg" | "xl";
export type ReaderLineHeight = "compact" | "comfortable" | "relaxed";

export type AppSection = "beranda" | "katalog" | "rak" | "jurnal";
export type ShelfTab = "dipinjam" | "simpan" | "riwayat";
export type CitationStyle = "APA" | "MLA" | "Chicago";
