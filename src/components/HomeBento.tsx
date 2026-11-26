import { useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  AppSection,
  CollectionFormat,
  LibraryItem,
  ReadingProgress,
} from "../types/library";
import { BookCover } from "./BookCover";

export type SearchField = "all" | "title" | "author" | "subject";

interface HomeBentoProps {
  catalog: LibraryItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchField: SearchField;
  onSearchFieldChange: (f: SearchField) => void;
  selectedFormat: CollectionFormat | "Semua";
  onSelectFormat: (fmt: CollectionFormat | "Semua") => void;
  onSearchSubmit: () => void;
  continueReadingList: Array<{
    item: LibraryItem;
    progress: ReadingProgress;
  }>;
  borrowedCount: number;
  savedCount: number;
  onOpenDetail: (item: LibraryItem) => void;
  onReadNow: (item: LibraryItem) => void;
  onNavigate: (section: AppSection) => void;
}

export function HomeBento({
  catalog,
  searchQuery,
  onSearchChange,
  searchField,
  onSearchFieldChange,
  selectedFormat,
  onSelectFormat,
  onSearchSubmit,
  continueReadingList,
  borrowedCount,
  savedCount,
  onOpenDetail,
  onReadNow,
  onNavigate,
}: HomeBentoProps) {
  const [carouselTab, setCarouselTab] = useState<"kurasi" | "populer">("kurasi");
  const carouselRef = useRef<HTMLDivElement>(null);

  const carouselItems =
    carouselTab === "kurasi"
      ? catalog.filter((item) => item.isEditorsPick)
      : [...catalog].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const formatOptions: Array<CollectionFormat | "Semua"> = [
    "Semua",
    "E-Book",
    "Jurnal",
    "Audiobook",
    "Arsip Digital",
  ];

  const primaryReading = continueReadingList[0];

  const liveSearchMatches =
    searchQuery.trim().length > 0
      ? catalog
          .filter((item) => {
            const q = searchQuery.trim().toLowerCase();
            if (selectedFormat !== "Semua" && item.format !== selectedFormat) {
              return false;
            }
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
              item.author.toLowerCase().includes(q) ||
              item.subject.toLowerCase().includes(q) ||
              item.ddc.toLowerCase().includes(q)
            );
          })
          .slice(0, 4)
      : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Editorial Search Area */}
      <section className="relative overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#F4F0E7] px-5 py-8 paper-grain sm:px-10 sm:py-11 dark:border-[#262922] dark:bg-[#191C17]">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#61665D] dark:text-[#9CA096]">
            <span>Koleksi Kuratorial · Open Access & Lisensi Digital</span>
            <span className="font-mono tabular-nums">
              {catalog.length} Judul Terindeks · Pembaruan November 2026
            </span>
          </div>

          <h1
            className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[#1F241D] sm:text-5xl sm:leading-[1.12] dark:text-[#ECE9E1]"
            style={{ textWrap: "balance" }}
          >
            Ruang baca tenang untuk sastra, riset, dan arsip Nusantara.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#555B51] sm:text-base dark:text-[#B1B5AB]">
            Temukan buku sastra, monograf ilmiah, jurnal terakreditasi, hingga rekaman
            audiobook dalam satu indeks OPAC yang bersih dan siap sitasi.
          </p>

          {/* Smart Search Bar */}
          <form onSubmit={handleFormSubmit} className="mt-7">
            <div className="flex flex-col gap-2 rounded-xl border border-[#D8D2C5] bg-[#FAF8F5] p-2 shadow-xs sm:flex-row sm:items-center dark:border-[#2F342A] dark:bg-[#121411]">
              <div className="flex flex-1 items-center gap-2.5 px-2.5">
                <Search className="h-4 w-4 shrink-0 text-[#61665D] dark:text-[#9CA096]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari judul buku, penulis, subjek, atau nomor DDC..."
                  aria-label="Cari koleksi perpustakaan"
                  className="w-full bg-transparent py-2 text-sm text-[#1F241D] placeholder:text-[#7D8278] focus:outline-none dark:text-[#ECE9E1] dark:placeholder:text-[#7A7E74]"
                />
              </div>

              <div className="flex items-center gap-2 border-t border-[#EAE5DA] pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-2 dark:border-[#262922]">
                <div className="flex items-center gap-1.5 px-1.5 text-xs text-[#61665D] dark:text-[#9CA096]">
                  <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                  <select
                    aria-label="Lingkup pencarian"
                    value={searchField}
                    onChange={(e) =>
                      onSearchFieldChange(e.target.value as SearchField)
                    }
                    className="bg-transparent py-1.5 text-xs font-medium text-[#1F241D] focus:outline-none dark:text-[#ECE9E1] cursor-pointer"
                  >
                    <option value="all" className="dark:bg-[#191C17]">
                      Semua Bidang
                    </option>
                    <option value="title" className="dark:bg-[#191C17]">
                      Judul
                    </option>
                    <option value="author" className="dark:bg-[#191C17]">
                      Penulis
                    </option>
                    <option value="subject" className="dark:bg-[#191C17]">
                      Subjek / DDC
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#2D5A27] px-4 py-2 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#23471E] dark:bg-[#3A7032] dark:hover:bg-[#46853C] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Cari Katalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Live Quick Match Preview when typing */}
            {liveSearchMatches.length > 0 && (
              <div className="mt-2 rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] p-2 shadow-md dark:border-[#2B2F26] dark:bg-[#161814]">
                <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-medium text-[#61665D] dark:text-[#9CA096]">
                  <span>Hasil Cepat ({liveSearchMatches.length})</span>
                  <button
                    type="button"
                    onClick={onSearchSubmit}
                    className="text-[#2D5A27] hover:underline dark:text-[#8FB987] cursor-pointer"
                  >
                    Lihat semua hasil →
                  </button>
                </div>
                <div className="divide-y divide-[#EDE9E0] dark:divide-[#232720]">
                  {liveSearchMatches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#F2EFE8] dark:hover:bg-[#1E221B] cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1F241D] dark:text-[#ECE9E1]">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-[#61665D] dark:text-[#9CA096]">
                          {item.author} · {item.format} · DDC {item.ddc}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-[#2D5A27] dark:text-[#8FB987]">
                        Buka
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* Format Quick Filter Tabs */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-[#61665D] dark:text-[#9CA096]">
              Format:
            </span>
            {formatOptions.map((fmt) => {
              const active = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => onSelectFormat(fmt)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? "bg-[#2D5A27] text-[#FAF8F5] dark:bg-[#3A7032]"
                      : "border border-[#DDD7C9] bg-[#FAF8F5] text-[#43483F] hover:border-[#2D5A27]/50 hover:text-[#2D5A27] dark:border-[#2B2F26] dark:bg-[#141612] dark:text-[#B8BCB2] dark:hover:border-[#8FB987]/50 dark:hover:text-[#8FB987]"
                  }`}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Neo-Bento Grid: 8 Columns Featured Carousel + 4 Columns Continue Reading & Shelf Overview */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Bento Card 1 (8 cols): Editor's Pick & Trending Carousel */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-5 sm:p-6 lg:col-span-8 dark:border-[#262922] dark:bg-[#171915]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-xl font-semibold text-[#1F241D] sm:text-2xl dark:text-[#ECE9E1]">
                Pilihan Minggu Ini
              </h2>

              <div className="inline-flex rounded-lg bg-[#EFECE4] p-0.5 dark:bg-[#22261F]">
                <button
                  type="button"
                  onClick={() => setCarouselTab("kurasi")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    carouselTab === "kurasi"
                      ? "bg-[#FAF8F5] text-[#1F241D] shadow-xs dark:bg-[#31362D] dark:text-[#ECE9E1]"
                      : "text-[#61665D] hover:text-[#1F241D] dark:text-[#9CA096] dark:hover:text-[#ECE9E1]"
                  }`}
                >
                  Kurasi Editor
                </button>
                <button
                  type="button"
                  onClick={() => setCarouselTab("populer")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    carouselTab === "populer"
                      ? "bg-[#FAF8F5] text-[#1F241D] shadow-xs dark:bg-[#31362D] dark:text-[#ECE9E1]"
                      : "text-[#61665D] hover:text-[#1F241D] dark:text-[#9CA096] dark:hover:text-[#ECE9E1]"
                  }`}
                >
                  Paling Dipinjam
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                aria-label="Geser koleksi ke kiri"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E0D5] bg-[#FAF8F5] text-[#43483F] transition-colors hover:border-[#2D5A27] hover:text-[#2D5A27] dark:border-[#2B2F26] dark:bg-[#1D201A] dark:text-[#B8BCB2] dark:hover:border-[#8FB987] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                aria-label="Geser koleksi ke kanan"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E0D5] bg-[#FAF8F5] text-[#43483F] transition-colors hover:border-[#2D5A27] hover:text-[#2D5A27] dark:border-[#2B2F26] dark:bg-[#1D201A] dark:text-[#B8BCB2] dark:hover:border-[#8FB987] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="mt-6 flex gap-5 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory"
          >
            {carouselItems.map((item) => (
              <article
                key={item.id}
                className="group w-[200px] shrink-0 snap-start sm:w-[216px]"
              >
                <button
                  type="button"
                  onClick={() => onOpenDetail(item)}
                  className="block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5A27]"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#E5E0D5] shadow-xs transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-md dark:border-[#2B2F26]">
                    <BookCover item={item} className="h-full w-full" />
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] font-medium text-[#61665D] dark:text-[#9CA096] truncate">
                      <span className="text-[#D96B43] dark:text-[#E58966]">
                        {item.format}
                      </span>
                      {" · "}
                      <span className="tabular-nums">{item.year}</span>
                    </p>
                    <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-[#1F241D] transition-colors group-hover:text-[#2D5A27] line-clamp-2 dark:text-[#ECE9E1] dark:group-hover:text-[#8FB987]">
                      {item.title}
                    </h3>
                    <p className="mt-1 truncate text-xs text-[#555B51] dark:text-[#A4A89E]">
                      {item.author}
                    </p>
                  </div>
                </button>
              </article>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#EDE9E0] pt-4 text-xs dark:border-[#232720]">
            <span className="text-[#61665D] dark:text-[#9CA096]">
              Dikurasi setiap pekan oleh Dewan Pustakawan
            </span>
            <button
              type="button"
              onClick={() => onNavigate("katalog")}
              className="inline-flex items-center gap-1 font-medium text-[#2D5A27] hover:underline dark:text-[#8FB987] whitespace-nowrap cursor-pointer"
            >
              <span>Jelajahi semua {catalog.length} koleksi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bento Card 2 (4 cols): Lanjutkan Membaca + Ringkasan Rak */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-4">
          {/* Continue Reading Card */}
          <div className="flex flex-1 flex-col justify-between rounded-2xl border border-[#E5E0D5] bg-[#F2EFE8] p-5 sm:p-6 dark:border-[#262922] dark:bg-[#1B1E19]">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-serif text-xl font-semibold text-[#1F241D] dark:text-[#ECE9E1]">
                  Lanjutkan Membaca
                </h2>
                {primaryReading && (
                  <span className="font-mono text-xs font-medium text-[#2D5A27] tabular-nums dark:text-[#8FB987]">
                    {primaryReading.progress.percent}%
                  </span>
                )}
              </div>

              {primaryReading ? (
                <div className="mt-5">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(primaryReading.item)}
                      className="h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-[#DDD7C9] shadow-xs transition-transform hover:-translate-y-0.5 dark:border-[#2F342A] cursor-pointer"
                    >
                      <BookCover
                        item={primaryReading.item}
                        size="sm"
                        className="h-full w-full"
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#D96B43] dark:text-[#E58966]">
                        {primaryReading.item.format}
                      </p>
                      <h3 className="mt-0.5 font-serif text-base font-semibold leading-snug text-[#1F241D] line-clamp-2 dark:text-[#ECE9E1]">
                        {primaryReading.item.title}
                      </h3>
                      <p className="mt-1 truncate text-xs text-[#61665D] dark:text-[#9CA096]">
                        {primaryReading.item.author}
                      </p>

                      <p className="mt-2.5 text-xs text-[#43483F] tabular-nums dark:text-[#C5C8BE]">
                        {primaryReading.item.format === "Audiobook"
                          ? `Trek ${primaryReading.progress.chapterIndex + 1} · ${primaryReading.progress.percent}% selesai`
                          : `Hal. ${primaryReading.progress.currentPage} dari ${primaryReading.item.pages ?? 200}`}
                      </p>
                    </div>
                  </div>

                  {/* Reading Progress Bar */}
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#DFD9CC] dark:bg-[#2A2E26]">
                    <div
                      className="h-full rounded-full bg-[#2D5A27] transition-all duration-300 dark:bg-[#7CA974]"
                      style={{ width: `${primaryReading.progress.percent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#61665D] dark:text-[#9CA096]">
                  Belum ada bacaan aktif. Pilih satu koleksi dari katalog untuk mulai
                  membaca.
                </p>
              )}
            </div>

            {primaryReading && (
              <div className="mt-5 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onReadNow(primaryReading.item)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2D5A27] px-4 py-2.5 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#23471E] dark:bg-[#3A7032] dark:hover:bg-[#46853C] whitespace-nowrap cursor-pointer"
                >
                  {primaryReading.item.format === "Audiobook" ? (
                    <Headphones className="h-4 w-4" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                  <span>
                    {primaryReading.item.format === "Audiobook"
                      ? "Lanjutkan Dengar"
                      : "Lanjutkan Baca"}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Shelf Metrics & Open Access Quick Entry */}
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-5 dark:border-[#262922] dark:bg-[#171915]">
            <div className="grid grid-cols-2 divide-x divide-[#E5E0D5] dark:divide-[#262922]">
              <button
                type="button"
                onClick={() => onNavigate("rak")}
                className="pr-4 text-left transition-colors hover:text-[#2D5A27] dark:hover:text-[#8FB987] cursor-pointer"
              >
                <p className="text-xs text-[#61665D] dark:text-[#9CA096]">
                  Sedang Dipinjam
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#1F241D] tabular-nums dark:text-[#ECE9E1]">
                  {borrowedCount}
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("rak")}
                className="pl-4 text-left transition-colors hover:text-[#D96B43] dark:hover:text-[#E58966] cursor-pointer"
              >
                <p className="text-xs text-[#61665D] dark:text-[#9CA096]">
                  Daftar Simpan
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#1F241D] tabular-nums dark:text-[#ECE9E1]">
                  {savedCount}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Subject Directory Strip */}
      <section className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-5 sm:p-6 dark:border-[#262922] dark:bg-[#171915]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-semibold text-[#1F241D] sm:text-xl dark:text-[#ECE9E1]">
            Indeks Subjek & Klasifikasi DDC
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("jurnal")}
            className="text-xs font-medium text-[#D96B43] hover:underline dark:text-[#E58966] cursor-pointer"
          >
            Lihat Repositori Jurnal Open-Access →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Fiksi Sastra", ddc: "899 · 398", query: "Fiksi Sastra" },
            { label: "Arsitektur & Desain", ddc: "720", query: "Arsitektur" },
            { label: "Teknologi & Kebijakan", ddc: "006", query: "Teknologi" },
            { label: "Sains & Botani", ddc: "587", query: "Sains" },
            { label: "Filsafat & Sejarah", ddc: "115 · 959", query: "Sejarah" },
          ].map((entry) => (
            <button
              key={entry.label}
              type="button"
              onClick={() => {
                onSearchFieldChange("subject");
                onSearchChange(entry.query);
                onSearchSubmit();
              }}
              className="group rounded-xl border border-[#E5E0D5] bg-[#F5F2EB] p-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#2D5A27]/40 dark:border-[#262922] dark:bg-[#1C1F1A] dark:hover:border-[#8FB987]/40 cursor-pointer"
            >
              <span className="font-mono text-[11px] text-[#61665D] tabular-nums dark:text-[#9CA096]">
                DDC {entry.ddc}
              </span>
              <p className="mt-1 text-sm font-medium text-[#1F241D] group-hover:text-[#2D5A27] dark:text-[#ECE9E1] dark:group-hover:text-[#8FB987]">
                {entry.label}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
