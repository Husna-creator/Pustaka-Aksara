import { useEffect } from "react";
import {
  Bookmark,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Headphones,
  RotateCcw,
  X,
} from "lucide-react";
import { BorrowedRecord, LibraryItem } from "../types/library";
import { BookCover } from "./BookCover";
import { CitationBlock } from "./CitationBlock";

interface BookDetailModalProps {
  item: LibraryItem | null;
  onClose: () => void;
  isBorrowed: boolean;
  borrowedRecord?: BorrowedRecord;
  isSaved: boolean;
  onBorrow: (itemId: string) => void;
  onReturn: (itemId: string) => void;
  onToggleSave: (itemId: string) => void;
  onReadNow: (item: LibraryItem) => void;
}

export function BookDetailModal({
  item,
  onClose,
  isBorrowed,
  borrowedRecord,
  isSaved,
  onBorrow,
  onReturn,
  onToggleSave,
  onReadNow,
}: BookDetailModalProps) {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const isAudio = item.format === "Audiobook";
  const remainingDays = borrowedRecord
    ? Math.max(
        0,
        Math.ceil((borrowedRecord.dueAt - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 14;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#131512]/60 p-3 backdrop-blur-xs sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] shadow-2xl dark:border-[#2B2F26] dark:bg-[#161814]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail koleksi"
          className="sticky top-4 float-right z-20 mr-4 mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D5] bg-[#FAF8F5]/95 text-[#43483F] transition-colors hover:border-[#1F241D] hover:text-[#1F241D] dark:border-[#2B2F26] dark:bg-[#1E211C]/95 dark:text-[#C5C8BE] dark:hover:text-[#ECE9E1] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 md:grid-cols-12">
          {/* Left Column: Editorial Cover Presentation */}
          <div className="md:col-span-5">
            <div className="sticky top-6 rounded-xl border border-[#E5E0D5] bg-[#F2EFE8] p-5 dark:border-[#262922] dark:bg-[#1D201A]">
              <div className="mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-lg shadow-lg">
                <BookCover item={item} size="lg" className="h-full w-full" />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E0DBD0] pt-4 text-xs text-[#5C6158] dark:border-[#2B2F26] dark:text-[#A4A89E]">
                <span>Ketersediaan</span>
                <span className="font-medium text-[#2D5A27] dark:text-[#8FB987] tabular-nums">
                  {item.licenseStatus === "Open Access"
                    ? "Open Access · Tanpa Batas"
                    : `${item.availableCopies}/${item.totalCopies} Lisensi Aktif`}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Actions, Synopsis, OPAC Metadata & Citation */}
          <div className="md:col-span-7 md:pr-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#61665D] dark:text-[#9CA096]">
              <span className="text-[#D96B43] dark:text-[#E58966]">
                {item.format}
              </span>
              <span aria-hidden="true">·</span>
              <span>{item.subject}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">DDC {item.ddc}</span>
            </div>

            <h2
              id="modal-book-title"
              className="mt-2 font-serif text-2xl font-semibold leading-tight text-[#1F241D] sm:text-3xl dark:text-[#ECE9E1]"
              style={{ textWrap: "balance" }}
            >
              {item.title}
            </h2>

            {item.subtitle && (
              <p className="mt-1.5 text-base text-[#555B51] dark:text-[#B1B5AB]">
                {item.subtitle}
              </p>
            )}

            <p className="mt-3 text-sm font-medium text-[#1F241D] dark:text-[#DCE0D7]">
              Oleh {item.author}
              {item.authorRole && (
                <span className="font-normal text-[#61665D] dark:text-[#9CA096]">
                  {" "}
                  — {item.authorRole}
                </span>
              )}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onReadNow(item)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2D5A27] px-5 py-2.5 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#23471E] dark:bg-[#3A7032] dark:hover:bg-[#46853C] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isAudio ? (
                  <Headphones className="h-4 w-4" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                <span>{isAudio ? "Putar Audio Sekarang" : "Baca Sekarang"}</span>
              </button>

              {isBorrowed ? (
                <button
                  type="button"
                  onClick={() => onReturn(item.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#2D5A27]/40 bg-[#2D5A27]/10 px-4 py-2.5 text-sm font-medium text-[#2D5A27] transition-colors hover:bg-[#2D5A27]/15 dark:border-[#8FB987]/40 dark:bg-[#3A7032]/20 dark:text-[#A9D1A1] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Kembalikan ({remainingDays} hari)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onBorrow(item.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D5CFC2] bg-[#F4F1EA] px-4 py-2.5 text-sm font-medium text-[#1F241D] transition-colors hover:border-[#D96B43] hover:text-[#D96B43] dark:border-[#2F342A] dark:bg-[#1F221C] dark:text-[#ECE9E1] dark:hover:border-[#E58966] dark:hover:text-[#E58966] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <CalendarClock className="h-4 w-4" />
                  <span>Pinjam Digital (14 Hari)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleSave(item.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSaved
                    ? "border-[#D96B43]/50 bg-[#D96B43]/10 text-[#C2542D] dark:border-[#E58966]/50 dark:bg-[#D96B43]/15 dark:text-[#F09E7E]"
                    : "border-[#D5CFC2] bg-transparent text-[#43483F] hover:border-[#1F241D] hover:text-[#1F241D] dark:border-[#2F342A] dark:text-[#B8BCB2] dark:hover:border-[#ECE9E1] dark:hover:text-[#ECE9E1]"
                }`}
              >
                {isSaved ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                <span>{isSaved ? "Tersimpan di Rak" : "Simpan ke Rak"}</span>
              </button>
            </div>

            {/* Synopsis */}
            <div className="mt-7 border-t border-[#E5E0D5] pt-6 dark:border-[#262922]">
              <h3 className="text-xs font-semibold tracking-wider text-[#61665D] uppercase dark:text-[#9CA096]">
                Sinopsis & Abstrak
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#2C3129] dark:text-[#D6D4CB]">
                {item.synopsis}
              </p>
            </div>

            {/* Complete OPAC Metadata Table */}
            <div className="mt-6 border-t border-[#E5E0D5] pt-6 dark:border-[#262922]">
              <h3 className="text-xs font-semibold tracking-wider text-[#61665D] uppercase dark:text-[#9CA096]">
                Metadata Katalog OPAC
              </h3>
              <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <div className="border-b border-[#EDE9E0] pb-2 dark:border-[#22251E]">
                  <dt className="text-xs text-[#6B7066] dark:text-[#91958B]">
                    Nomor Identifikasi
                  </dt>
                  <dd className="mt-0.5 font-mono text-xs text-[#1F241D] tabular-nums dark:text-[#ECE9E1]">
                    {item.isbnOrIssn}
                  </dd>
                </div>

                <div className="border-b border-[#EDE9E0] pb-2 dark:border-[#22251E]">
                  <dt className="text-xs text-[#6B7066] dark:text-[#91958B]">
                    Penerbit & Tahun
                  </dt>
                  <dd className="mt-0.5 text-xs font-medium text-[#1F241D] tabular-nums dark:text-[#ECE9E1]">
                    {item.publisher} ({item.year})
                  </dd>
                </div>

                <div className="border-b border-[#EDE9E0] pb-2 dark:border-[#22251E]">
                  <dt className="text-xs text-[#6B7066] dark:text-[#91958B]">
                    Klasifikasi Subjek / DDC
                  </dt>
                  <dd className="mt-0.5 text-xs font-medium text-[#1F241D] tabular-nums dark:text-[#ECE9E1]">
                    {item.subject} · {item.ddc}
                  </dd>
                </div>

                <div className="border-b border-[#EDE9E0] pb-2 dark:border-[#22251E]">
                  <dt className="text-xs text-[#6B7066] dark:text-[#91958B]">
                    {item.durationLabel ? "Durasi Rekaman" : "Jumlah Halaman"}
                  </dt>
                  <dd className="mt-0.5 text-xs font-medium text-[#1F241D] tabular-nums dark:text-[#ECE9E1]">
                    {item.durationLabel
                      ? `${item.durationLabel} · ${item.language}`
                      : `${item.pages} halaman · ${item.language}`}
                  </dd>
                </div>

                {item.doi && (
                  <div className="border-b border-[#EDE9E0] pb-2 sm:col-span-2 dark:border-[#22251E]">
                    <dt className="text-xs text-[#6B7066] dark:text-[#91958B]">
                      DOI / Edisi
                    </dt>
                    <dd className="mt-0.5 font-mono text-xs text-[#2D5A27] dark:text-[#8FB987]">
                      {item.volumeIssue} · https://doi.org/{item.doi}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 1-Click Citation Generator */}
            <div className="mt-6">
              <CitationBlock item={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
