import { useMemo, useState } from "react";
import {
  Bookmark,
  BookOpen,
  Headphones,
  LayoutGrid,
  List,
  Search,
  X,
} from "lucide-react";
import { CollectionFormat, LibraryItem } from "../types/library";
import { BookCover } from "./BookCover";
import { SearchField } from "./HomeBento";

interface CatalogViewProps {
  catalog: LibraryItem[];
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchField: SearchField;
  onSearchFieldChange: (f: SearchField) => void;
  selectedFormat: CollectionFormat | "Semua";
  onSelectFormat: (fmt: CollectionFormat | "Semua") => void;
  savedIds: string[];
  borrowedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetail: (item: LibraryItem) => void;
  onReadNow: (item: LibraryItem) => void;
  lockFormatToJournal?: boolean;
}

type SortOption = "populer" | "terbaru" | "judul";

export function CatalogView({
  catalog,
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  searchField,
  onSearchFieldChange,
  selectedFormat,
  onSelectFormat,
  savedIds,
  borrowedIds,
  onToggleSave,
  onOpenDetail,
  onReadNow,
  lockFormatToJournal = false,
}: CatalogViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSubject, setSelectedSubject] = useState<string>("Semua");
  const [sortBy, setSortBy] = useState<SortOption>("populer");

  const subjects = useMemo(() => {
    const base = lockFormatToJournal
      ? catalog.filter((i) => i.format === "Jurnal" || i.licenseStatus === "Open Access")
      : catalog;
    const unique = Array.from(new Set(base.map((i) => i.subject)));
    return ["Semua", ...unique];
  }, [catalog, lockFormatToJournal]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return catalog
      .filter((item) => {
        if (lockFormatToJournal) {
          if (item.format !== "Jurnal" && item.licenseStatus !== "Open Access") {
            return false;
          }
        } else if (
          selectedFormat !== "Semua" &&
          item.format !== selectedFormat
        ) {
          return false;
        }

        if (selectedSubject !== "Semua" && item.subject !== selectedSubject) {
          return false;
        }

        if (!q) return true;
        if (searchField === "title") {
          return (
            item.title.toLowerCase().includes(q) ||
            (item.subtitle || "").toLowerCase().includes(q)
          );
        }
        if (searchField === "author") {
          return item.author.toLowerCase().includes(q);
        }
        if (searchField === "subject") {
          return (
            item.subject.toLowerCase().includes(q) ||
            item.ddc.toLowerCase().includes(q)
          );
        }
        return (
          item.title.toLowerCase().includes(q) ||
          (item.subtitle || "").toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.ddc.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "terbaru") return b.year - a.year;
        if (sortBy === "judul") return a.title.localeCompare(b.title, "id");
        return b.borrowCount - a.borrowCount;
      });
  }, [
    catalog,
    lockFormatToJournal,
    selectedFormat,
    selectedSubject,
    searchQuery,
    searchField,
    sortBy,
  ]);

  const formats: Array<CollectionFormat | "Semua"> = [
    "Semua",
    "E-Book",
    "Jurnal",
    "Audiobook",
    "Arsip Digital",
  ];

  const resetFilters = () => {
    onSearchChange("");
    onSearchFieldChange("all");
    if (!lockFormatToJournal) onSelectFormat("Semua");
    setSelectedSubject("Semua");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="rounded-2xl border border-[#E5E0D5] bg-[#F4F0E7] p-5 sm:p-7 dark:border-[#262922] dark:bg-[#191C17]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#1F241D] sm:text-3xl dark:text-[#ECE9E1]">
              {title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-[#555B51] dark:text-[#B1B5AB]">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="font-mono text-xs text-[#61665D] tabular-nums dark:text-[#9CA096]">
              {filteredItems.length} koleksi
            </span>
            <div className="inline-flex rounded-lg border border-[#D8D2C5] bg-[#FAF8F5] p-0.5 dark:border-[#2F342A] dark:bg-[#131512]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Tampilan kisi"
                aria-pressed={viewMode === "grid"}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#2D5A27] text-[#FAF8F5] dark:bg-[#3A7032]"
                    : "text-[#61665D] hover:text-[#1F241D] dark:text-[#9CA096] dark:hover:text-[#ECE9E1]"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Tampilan daftar"
                aria-pressed={viewMode === "list"}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#2D5A27] text-[#FAF8F5] dark:bg-[#3A7032]"
                    : "text-[#61665D] hover:text-[#1F241D] dark:text-[#9CA096] dark:hover:text-[#ECE9E1]"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#D8D2C5] bg-[#FAF8F5] px-3 py-2 dark:border-[#2F342A] dark:bg-[#131512]">
            <Search className="h-4 w-4 shrink-0 text-[#61665D] dark:text-[#9CA096]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Saring judul, penulis, atau DDC..."
              aria-label="Saring katalog"
              className="w-full bg-transparent text-sm text-[#1F241D] placeholder:text-[#7D8278] focus:outline-none dark:text-[#ECE9E1]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Hapus pencarian"
                className="text-[#61665D] hover:text-[#1F241D] dark:text-[#9CA096] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="Filter subjek"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-xl border border-[#D8D2C5] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#1F241D] focus:outline-none dark:border-[#2F342A] dark:bg-[#131512] dark:text-[#ECE9E1] cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub} className="dark:bg-[#191C17]">
                  {sub === "Semua" ? "Semua Subjek" : sub}
                </option>
              ))}
            </select>

            <select
              aria-label="Urutkan koleksi"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-[#D8D2C5] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#1F241D] focus:outline-none dark:border-[#2F342A] dark:bg-[#131512] dark:text-[#ECE9E1] cursor-pointer"
            >
              <option value="populer" className="dark:bg-[#191C17]">
                Urutkan: Paling Populer
              </option>
              <option value="terbaru" className="dark:bg-[#191C17]">
                Urutkan: Tahun Terbaru
              </option>
              <option value="judul" className="dark:bg-[#191C17]">
                Urutkan: Judul A–Z
              </option>
            </select>
          </div>
        </div>

        {!lockFormatToJournal && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {formats.map((fmt) => {
              const active = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => onSelectFormat(fmt)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? "bg-[#2D5A27] text-[#FAF8F5] dark:bg-[#3A7032]"
                      : "border border-[#DDD7C9] bg-[#FAF8F5] text-[#43483F] hover:border-[#2D5A27]/50 dark:border-[#2B2F26] dark:bg-[#131512] dark:text-[#B8BCB2]"
                  }`}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] px-6 py-14 text-center dark:border-[#262922] dark:bg-[#171915]">
          <p className="font-serif text-xl font-medium text-[#1F241D] dark:text-[#ECE9E1]">
            Tidak ada koleksi yang cocok
          </p>
          <p className="mt-2 text-sm text-[#61665D] dark:text-[#9CA096]">
            Coba ubah kata kunci pencarian atau setel ulang filter format dan subjek.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-xl bg-[#2D5A27] px-4 py-2 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#23471E] dark:bg-[#3A7032] cursor-pointer"
          >
            Setel Ulang Filter
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const isBorrowed = borrowedIds.includes(item.id);
            const isAudio = item.format === "Audiobook";

            return (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md dark:border-[#262922] dark:bg-[#171915]"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="block w-full text-left cursor-pointer"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#E5E0D5] dark:border-[#2B2F26]">
                      <BookCover item={item} className="h-full w-full" />
                    </div>
                  </button>

                  {/* Unboxed Metadata */}
                  <div className="mt-3.5 flex items-center justify-between gap-2 text-[11px] font-medium text-[#61665D] dark:text-[#9CA096]">
                    <span className="truncate">
                      <span className="text-[#D96B43] dark:text-[#E58966]">
                        {item.format}
                      </span>
                      {" · "}
                      <span className="font-mono tabular-nums">DDC {item.ddc}</span>
                    </span>
                    <span className="shrink-0 tabular-nums">{item.year}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="mt-1.5 block w-full text-left cursor-pointer"
                  >
                    <h3 className="font-serif text-lg font-semibold leading-snug text-[#1F241D] transition-colors group-hover:text-[#2D5A27] line-clamp-2 dark:text-[#ECE9E1] dark:group-hover:text-[#8FB987]">
                      {item.title}
                    </h3>
                  </button>

                  <p className="mt-1 truncate text-xs font-medium text-[#555B51] dark:text-[#A4A89E]">
                    {item.author}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-[#6B7066] line-clamp-2 dark:text-[#9CA096]">
                    {item.synopsis}
                  </p>
                </div>

                {/* Card Action Bar */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EDE9E0] pt-3 dark:border-[#232720]">
                  <button
                    type="button"
                    onClick={() => onReadNow(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D5A27]/10 px-3 py-1.5 text-xs font-medium text-[#2D5A27] transition-colors hover:bg-[#2D5A27] hover:text-[#FAF8F5] dark:bg-[#3A7032]/20 dark:text-[#A9D1A1] dark:hover:bg-[#3A7032] dark:hover:text-[#FAF8F5] whitespace-nowrap cursor-pointer"
                  >
                    {isAudio ? (
                      <Headphones className="h-3.5 w-3.5" />
                    ) : (
                      <BookOpen className="h-3.5 w-3.5" />
                    )}
                    <span>{isAudio ? "Dengar" : "Baca"}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isBorrowed && (
                      <span className="text-[11px] font-medium text-[#2D5A27] dark:text-[#8FB987]">
                        Dipinjam
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#43483F] transition-colors hover:bg-[#EFECE4] dark:text-[#B8BCB2] dark:hover:bg-[#232720] whitespace-nowrap cursor-pointer"
                    >
                      Detail
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleSave(item.id)}
                      aria-label={
                        isSaved ? "Hapus dari rak simpan" : "Simpan ke rak"
                      }
                      title={isSaved ? "Tersimpan" : "Simpan ke Rak"}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? "border-[#D96B43]/40 bg-[#D96B43]/10 text-[#D96B43] dark:border-[#E58966]/40 dark:text-[#E58966]"
                          : "border-[#E5E0D5] text-[#61665D] hover:border-[#1F241D] hover:text-[#1F241D] dark:border-[#2B2F26] dark:text-[#9CA096] dark:hover:text-[#ECE9E1]"
                      }`}
                    >
                      <Bookmark
                        className="h-3.5 w-3.5"
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="divide-y divide-[#E5E0D5] overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] dark:divide-[#262922] dark:border-[#262922] dark:bg-[#171915]">
          {filteredItems.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const isBorrowed = borrowedIds.includes(item.id);
            const isAudio = item.format === "Audiobook";

            return (
              <article
                key={item.id}
                className="group flex flex-col gap-4 p-4 transition-colors hover:bg-[#F5F2EB]/70 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:hover:bg-[#1D201A]/70"
              >
                <div className="flex min-w-0 flex-1 gap-4">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E5E0D5] dark:border-[#2B2F26] cursor-pointer"
                  >
                    <BookCover item={item} size="sm" className="h-full w-full" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#61665D] dark:text-[#9CA096]">
                      <span className="text-[#D96B43] dark:text-[#E58966]">
                        {item.format}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        DDC {item.ddc}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.year}</span>
                      {isBorrowed && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#2D5A27] dark:text-[#8FB987]">
                            Sedang Dipinjam
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="mt-1 block text-left cursor-pointer"
                    >
                      <h3 className="font-serif text-lg font-semibold text-[#1F241D] group-hover:text-[#2D5A27] dark:text-[#ECE9E1] dark:group-hover:text-[#8FB987]">
                        {item.title}
                      </h3>
                    </button>

                    <p className="mt-0.5 text-xs font-medium text-[#43483F] dark:text-[#C5C8BE]">
                      {item.author} — {item.publisher}
                    </p>

                    <p className="mt-2 text-xs leading-relaxed text-[#61665D] line-clamp-2 dark:text-[#9CA096]">
                      {item.synopsis}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                  <button
                    type="button"
                    onClick={() => onReadNow(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D5A27] px-4 py-2 text-xs font-medium text-[#FAF8F5] transition-colors hover:bg-[#23471E] dark:bg-[#3A7032] whitespace-nowrap cursor-pointer"
                  >
                    {isAudio ? (
                      <Headphones className="h-3.5 w-3.5" />
                    ) : (
                      <BookOpen className="h-3.5 w-3.5" />
                    )}
                    <span>{isAudio ? "Putar Audio" : "Baca Sekarang"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="rounded-lg border border-[#D8D2C5] px-3 py-1.5 text-xs font-medium text-[#43483F] hover:border-[#1F241D] dark:border-[#2F342A] dark:text-[#B8BCB2] whitespace-nowrap cursor-pointer"
                    >
                      Detail & Sitasi
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSave(item.id)}
                      aria-label={
                        isSaved ? "Hapus dari simpanan" : "Simpan ke rak"
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? "border-[#D96B43]/40 bg-[#D96B43]/10 text-[#D96B43] dark:border-[#E58966]/40 dark:text-[#E58966]"
                          : "border-[#D8D2C5] text-[#61665D] hover:text-[#1F241D] dark:border-[#2F342A] dark:text-[#9CA096]"
                      }`}
                    >
                      <Bookmark
                        className="h-3.5 w-3.5"
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
