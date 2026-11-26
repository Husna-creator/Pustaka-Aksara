import { useCallback, useEffect, useMemo, useState } from "react";
import { BookDetailModal } from "./components/BookDetailModal";
import { CatalogView } from "./components/CatalogView";
import { HomeBento, SearchField } from "./components/HomeBento";
import { LibrarianWidget } from "./components/LibrarianWidget";
import { MyShelfView } from "./components/MyShelfView";
import { Navbar } from "./components/Navbar";
import { ReaderModal } from "./components/ReaderModal";
import { LIBRARY_CATALOG } from "./data/catalog";
import {
  AppSection,
  BorrowedRecord,
  CollectionFormat,
  LibraryItem,
  ReadingProgress,
} from "./types/library";

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState<AppSection>("beranda");

  // Search & Catalog filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("all");
  const [selectedFormat, setSelectedFormat] = useState<
    CollectionFormat | "Semua"
  >("Semua");

  // Personal Library State
  const [borrowedRecords, setBorrowedRecords] = useState<BorrowedRecord[]>(() => {
    const now = Date.now();
    return [
      {
        itemId: "laut-dan-kertas-aksara",
        borrowedAt: now - 3 * 24 * 60 * 60 * 1000,
        dueAt: now + 11 * 24 * 60 * 60 * 1000,
      },
      {
        itemId: "audio-sejarah-rempah",
        borrowedAt: now - 1 * 24 * 60 * 60 * 1000,
        dueAt: now + 13 * 24 * 60 * 60 * 1000,
      },
    ];
  });

  const [savedIds, setSavedIds] = useState<string[]>([
    "arsitektur-teduh-tropis",
    "filsafat-waktu-senja",
  ]);

  const [progressMap, setProgressMap] = useState<
    Record<string, ReadingProgress>
  >(() => {
    const now = Date.now();
    return {
      "laut-dan-kertas-aksara": {
        itemId: "laut-dan-kertas-aksara",
        chapterIndex: 1,
        percent: 64,
        currentPage: 152,
        audioSeconds: 0,
        lastReadAt: now - 2 * 60 * 60 * 1000,
      },
      "audio-sejarah-rempah": {
        itemId: "audio-sejarah-rempah",
        chapterIndex: 0,
        percent: 32,
        currentPage: 1,
        audioSeconds: 576,
        lastReadAt: now - 26 * 60 * 60 * 1000,
      },
      "ekologi-flora-tropis": {
        itemId: "ekologi-flora-tropis",
        chapterIndex: 1,
        percent: 100,
        currentPage: 342,
        audioSeconds: 0,
        lastReadAt: now - 5 * 24 * 60 * 60 * 1000,
      },
    };
  });

  // Modals & Floating Widget State
  const [detailItem, setDetailItem] = useState<LibraryItem | null>(null);
  const [readerItem, setReaderItem] = useState<LibraryItem | null>(null);
  const [librarianOpen, setLibrarianOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync `.dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleBorrow = useCallback(
    (itemId: string) => {
      setBorrowedRecords((prev) => {
        if (prev.some((r) => r.itemId === itemId)) return prev;
        const now = Date.now();
        return [
          { itemId, borrowedAt: now, dueAt: now + FOURTEEN_DAYS_MS },
          ...prev,
        ];
      });
      const target = LIBRARY_CATALOG.find((c) => c.id === itemId);
      if (target) {
        showToast(`"${target.title}" dipinjam untuk 14 hari.`);
      }
    },
    [showToast]
  );

  const handleReturn = useCallback(
    (itemId: string) => {
      setBorrowedRecords((prev) => prev.filter((r) => r.itemId !== itemId));
      const target = LIBRARY_CATALOG.find((c) => c.id === itemId);
      if (target) {
        showToast(`"${target.title}" telah dikembalikan ke katalog.`);
      }
    },
    [showToast]
  );

  const handleToggleSave = useCallback(
    (itemId: string) => {
      setSavedIds((prev) => {
        const exists = prev.includes(itemId);
        const target = LIBRARY_CATALOG.find((c) => c.id === itemId);
        if (exists) {
          if (target) showToast(`"${target.title}" dihapus dari Daftar Simpan.`);
          return prev.filter((id) => id !== itemId);
        } else {
          if (target) showToast(`"${target.title}" disimpan ke Rak Bukuku.`);
          return [itemId, ...prev];
        }
      });
    },
    [showToast]
  );

  const handleUpdateProgress = useCallback(
    (
      itemId: string,
      chapterIndex: number,
      percent: number,
      audioSeconds = 0
    ) => {
      const target = LIBRARY_CATALOG.find((c) => c.id === itemId);
      const totalPages = target?.pages ?? 200;
      const computedPage = Math.max(1, Math.round((percent / 100) * totalPages));

      setProgressMap((prev) => ({
        ...prev,
        [itemId]: {
          itemId,
          chapterIndex,
          percent,
          currentPage: computedPage,
          audioSeconds,
          lastReadAt: Date.now(),
        },
      }));
    },
    []
  );

  const handleOpenReader = useCallback(
    (item: LibraryItem) => {
      setDetailItem(null);
      setReaderItem(item);
      setProgressMap((prev) => {
        if (prev[item.id]) {
          return {
            ...prev,
            [item.id]: {
              ...prev[item.id],
              lastReadAt: Date.now(),
            },
          };
        }
        return {
          ...prev,
          [item.id]: {
            itemId: item.id,
            chapterIndex: 0,
            percent: Math.round((1 / item.chapters.length) * 100),
            currentPage: 1,
            audioSeconds: 0,
            lastReadAt: Date.now(),
          },
        };
      });
    },
    []
  );

  const handleNavigate = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueReadingList = useMemo(() => {
    return Object.values(progressMap)
      .filter((p) => p.percent < 100)
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
      .map((prog) => {
        const item = LIBRARY_CATALOG.find((c) => c.id === prog.itemId);
        return item ? { item, progress: prog } : null;
      })
      .filter(
        (entry): entry is { item: LibraryItem; progress: ReadingProgress } =>
          Boolean(entry)
      );
  }, [progressMap]);

  const borrowedIds = useMemo(
    () => borrowedRecords.map((r) => r.itemId),
    [borrowedRecords]
  );

  return (
    <div className="min-h-screen bg-[#bca4d9] border-[#ab8585] text-[#1F241D] transition-colors duration-200 dark:bg-[#131512] dark:text-[#ECE9E1]">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        borrowedCount={borrowedRecords.length}
        onOpenLibrarian={() => setLibrarianOpen(true)}
      />

      <main className="mx-auto max-w-7xl bg-[#bca4d9] px-4 pt-6 pb-20 sm:px-6 md:pb-12 lg:px-8">
        {activeSection === "beranda" && (
          <HomeBento
            catalog={LIBRARY_CATALOG}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchField={searchField}
            onSearchFieldChange={setSearchField}
            selectedFormat={selectedFormat}
            onSelectFormat={(fmt) => {
              setSelectedFormat(fmt);
            }}
            onSearchSubmit={() => handleNavigate("katalog")}
            continueReadingList={continueReadingList}
            borrowedCount={borrowedRecords.length}
            savedCount={savedIds.length}
            onOpenDetail={setDetailItem}
            onReadNow={handleOpenReader}
            onNavigate={handleNavigate}
          />
        )}

        {activeSection === "katalog" && (
          <CatalogView
            catalog={LIBRARY_CATALOG}
            title="Katalog Koleksi OPAC"
            subtitle="Telusuri seluruh koleksi e-book, jurnal ilmiah, audiobook, dan arsip digital dengan klasifikasi Dewey Decimal."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchField={searchField}
            onSearchFieldChange={setSearchField}
            selectedFormat={selectedFormat}
            onSelectFormat={setSelectedFormat}
            savedIds={savedIds}
            borrowedIds={borrowedIds}
            onToggleSave={handleToggleSave}
            onOpenDetail={setDetailItem}
            onReadNow={handleOpenReader}
          />
        )}

        {activeSection === "jurnal" && (
          <CatalogView
            catalog={LIBRARY_CATALOG}
            title="Repositori Jurnal & Arsip Open Access"
            subtitle="Publikasi ilmiah tinjauan sejawat dan manuskrip digital bebas akses tanpa batas lisensi peminjaman."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchField={searchField}
            onSearchFieldChange={setSearchField}
            selectedFormat="Semua"
            onSelectFormat={() => {}}
            savedIds={savedIds}
            borrowedIds={borrowedIds}
            onToggleSave={handleToggleSave}
            onOpenDetail={setDetailItem}
            onReadNow={handleOpenReader}
            lockFormatToJournal
          />
        )}

        {activeSection === "rak" && (
          <MyShelfView
            catalog={LIBRARY_CATALOG}
            borrowedRecords={borrowedRecords}
            savedIds={savedIds}
            progressMap={progressMap}
            onOpenDetail={setDetailItem}
            onReadNow={handleOpenReader}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
            onToggleSave={handleToggleSave}
            onExploreCatalog={() => handleNavigate("katalog")}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E5E0D5] bg-[#F4F0E7]/60 py-8 pb-24 md:pb-8 dark:border-[#262922] dark:bg-[#161814]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 text-xs text-[#61665D] sm:flex-row sm:items-center sm:px-6 lg:px-8 dark:text-[#9CA096]">
          <div>
            <span className="font-serif text-sm font-semibold text-[#1F241D] dark:text-[#ECE9E1]">
              Pustaka Aksara
            </span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>Perpustakaan Digital & Repositori Terbuka</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate("katalog")}
              className="hover:text-[#2D5A27] dark:hover:text-[#8FB987] cursor-pointer"
            >
              Katalog OPAC
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("jurnal")}
              className="hover:text-[#2D5A27] dark:hover:text-[#8FB987] cursor-pointer"
            >
              Jurnal Terbuka
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("rak")}
              className="hover:text-[#2D5A27] dark:hover:text-[#8FB987] cursor-pointer"
            >
              Rak Bukuku
            </button>
          </div>
        </div>
      </footer>

      {/* Book Detail Modal */}
      <BookDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        isBorrowed={
          detailItem
            ? borrowedRecords.some((r) => r.itemId === detailItem.id)
            : false
        }
        borrowedRecord={
          detailItem
            ? borrowedRecords.find((r) => r.itemId === detailItem.id)
            : undefined
        }
        isSaved={detailItem ? savedIds.includes(detailItem.id) : false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
        onToggleSave={handleToggleSave}
        onReadNow={handleOpenReader}
      />

      {/* Integrated E-Reader & Audio Player */}
      <ReaderModal
        item={readerItem}
        progress={readerItem ? progressMap[readerItem.id] : undefined}
        onClose={() => setReaderItem(null)}
        onUpdateProgress={handleUpdateProgress}
      />

      {/* Floating AI Pustakawan Widget */}
      <LibrarianWidget
        catalog={LIBRARY_CATALOG}
        isOpen={librarianOpen}
        onToggleOpen={setLibrarianOpen}
        onOpenDetail={(item) => {
          setLibrarianOpen(false);
          setDetailItem(item);
        }}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-[#2D5A27]/30 bg-[#1F241D] px-4 py-2.5 text-xs font-medium text-[#FAF8F5] shadow-lg md:bottom-6 dark:border-[#8FB987]/30 dark:bg-[#ECE9E1] dark:text-[#131512]"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
