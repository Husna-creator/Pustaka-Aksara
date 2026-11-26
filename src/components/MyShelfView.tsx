import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarClock,
  Headphones,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  BorrowedRecord,
  LibraryItem,
  ReadingProgress,
  ShelfTab,
} from "../types/library";
import { BookCover } from "./BookCover";

interface MyShelfViewProps {
  catalog: LibraryItem[];
  borrowedRecords: BorrowedRecord[];
  savedIds: string[];
  progressMap: Record<string, ReadingProgress>;
  onOpenDetail: (item: LibraryItem) => void;
  onReadNow: (item: LibraryItem) => void;
  onBorrow: (itemId: string) => void;
  onReturn: (itemId: string) => void;
  onToggleSave: (itemId: string) => void;
  onExploreCatalog: () => void;
}

function formatCountdown(dueAt: number, now: number): string {
  const diff = Math.max(0, dueAt - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `Sisa ${days} hari ${hours} jam`;
  return `Sisa ${hours} jam ${mins} mnt`;
}

function formatLastRead(timestamp: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function MyShelfView({
  catalog,
  borrowedRecords,
  savedIds,
  progressMap,
  onOpenDetail,
  onReadNow,
  onBorrow,
  onReturn,
  onToggleSave,
  onExploreCatalog,
}: MyShelfViewProps) {
  const [activeTab, setActiveTab] = useState<ShelfTab>("dipinjam");
  const [now, setNow] = useState(() => Date.now());

  // Live countdown ticker every minute
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const borrowedItems = borrowedRecords
    .map((rec) => ({
      record: rec,
      item: catalog.find((c) => c.id === rec.itemId),
    }))
    .filter(
      (entry): entry is { record: BorrowedRecord; item: LibraryItem } =>
        Boolean(entry.item)
    );

  const savedItems = savedIds
    .map((id) => catalog.find((c) => c.id === id))
    .filter((item): item is LibraryItem => Boolean(item));

  const historyItems = Object.values(progressMap)
    .sort((a, b) => b.lastReadAt - a.lastReadAt)
    .map((prog) => ({
      progress: prog,
      item: catalog.find((c) => c.id === prog.itemId),
    }))
    .filter(
      (entry): entry is { progress: ReadingProgress; item: LibraryItem } =>
        Boolean(entry.item)
    );

  const tabs: Array<{ id: ShelfTab; label: string; count: number }> = [
    { id: "dipinjam", label: "Sedang Dipinjam", count: borrowedItems.length },
    { id: "simpan", label: "Daftar Simpan", count: savedItems.length },
    { id: "riwayat", label: "Riwayat Bacaan", count: historyItems.length },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl border border-[#E5E0D5] bg-[#F4F0E7] p-5 sm:p-7 dark:border-[#262922] dark:bg-[#191C17]">
        <h1 className="font-serif text-2xl font-semibold text-[#1F241D] sm:text-3xl dark:text-[#ECE9E1]">
          Rak Bukuku
        </h1>
        <p className="mt-1.5 text-sm text-[#555B51] dark:text-[#B1B5AB]">
          Kelola pinjaman digital aktif, koleksi yang disimpan untuk dibaca nanti,
          serta jejak bacaan Anda.
        </p>

        {/* Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Kategori rak buku"
          className="mt-6 inline-flex flex-wrap gap-1 rounded-xl bg-[#E8E3D7] p-1 dark:bg-[#22261F]"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? "bg-[#FAF8F5] text-[#1F241D] shadow-xs dark:bg-[#31362D] dark:text-[#ECE9E1]"
                    : "text-[#5C6158] hover:text-[#1F241D] dark:text-[#9CA096] dark:hover:text-[#ECE9E1]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="font-mono text-[11px] opacity-75 tabular-nums">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Sedang Dipinjam */}
      {activeTab === "dipinjam" && (
        <div>
          {borrowedItems.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] px-6 py-12 text-center dark:border-[#262922] dark:bg-[#171915]">
              <p className="font-serif text-lg font-medium text-[#1F241D] dark:text-[#ECE9E1]">
                Belum ada pinjaman digital aktif
              </p>
              <p className="mt-1.5 text-sm text-[#61665D] dark:text-[#9CA096]">
                Pinjam e-book atau audiobook dari katalog untuk mengaksesnya selama 14
                hari penuh.
              </p>
              <button
                type="button"
                onClick={onExploreCatalog}
                className="mt-5 rounded-xl bg-[#2D5A27] px-4 py-2 text-sm font-medium text-[#FAF8F5] hover:bg-[#23471E] dark:bg-[#3A7032] cursor-pointer"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {borrowedItems.map(({ record, item }) => {
                const prog = progressMap[item.id];
                const percent = prog ? prog.percent : 0;
                const isAudio = item.format === "Audiobook";

                return (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 sm:p-5 dark:border-[#262922] dark:bg-[#171915]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E5E0D5] dark:border-[#2B2F26] cursor-pointer"
                    >
                      <BookCover item={item} size="sm" className="h-full w-full" />
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-[#D96B43] dark:text-[#E58966]">
                            {item.format}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-[#2D5A27] tabular-nums dark:text-[#8FB987]">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {formatCountdown(record.dueAt, now)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenDetail(item)}
                          className="mt-1 block text-left cursor-pointer"
                        >
                          <h3 className="font-serif text-lg font-semibold leading-snug text-[#1F241D] hover:text-[#2D5A27] line-clamp-2 dark:text-[#ECE9E1] dark:hover:text-[#8FB987]">
                            {item.title}
                          </h3>
                        </button>
                        <p className="mt-0.5 truncate text-xs text-[#61665D] dark:text-[#9CA096]">
                          {item.author}
                        </p>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px] text-[#61665D] tabular-nums dark:text-[#9CA096]">
                            <span>Progres Bacaan</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E8E3D7] dark:bg-[#262922]">
                            <div
                              className="h-full rounded-full bg-[#2D5A27] transition-all dark:bg-[#7CA974]"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onReadNow(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D5A27] px-3.5 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#23471E] dark:bg-[#3A7032] whitespace-nowrap cursor-pointer"
                        >
                          {isAudio ? (
                            <Headphones className="h-3.5 w-3.5" />
                          ) : (
                            <BookOpen className="h-3.5 w-3.5" />
                          )}
                          <span>{isAudio ? "Putar" : "Baca"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onReturn(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8D2C5] px-3 py-1.5 text-xs font-medium text-[#43483F] hover:border-[#D96B43] hover:text-[#D96B43] dark:border-[#2F342A] dark:text-[#B8BCB2] whitespace-nowrap cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Kembalikan</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Daftar Simpan (Wishlist) */}
      {activeTab === "simpan" && (
        <div>
          {savedItems.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] px-6 py-12 text-center dark:border-[#262922] dark:bg-[#171915]">
              <p className="font-serif text-lg font-medium text-[#1F241D] dark:text-[#ECE9E1]">
                Daftar simpan masih kosong
              </p>
              <p className="mt-1.5 text-sm text-[#61665D] dark:text-[#9CA096]">
                Tandai buku atau jurnal menarik di katalog untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {savedItems.map((item) => {
                const isBorrowed = borrowedRecords.some(
                  (r) => r.itemId === item.id
                );
                return (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 sm:p-5 dark:border-[#262922] dark:bg-[#171915]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="h-32 w-22 shrink-0 overflow-hidden rounded-xl border border-[#E5E0D5] dark:border-[#2B2F26] cursor-pointer"
                    >
                      <BookCover item={item} size="sm" className="h-full w-full" />
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="text-xs font-medium text-[#61665D] dark:text-[#9CA096]">
                          <span className="text-[#D96B43] dark:text-[#E58966]">
                            {item.format}
                          </span>
                          {" · "}
                          <span>{item.subject}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => onOpenDetail(item)}
                          className="mt-1 block text-left cursor-pointer"
                        >
                          <h3 className="font-serif text-lg font-semibold leading-snug text-[#1F241D] hover:text-[#2D5A27] line-clamp-2 dark:text-[#ECE9E1] dark:hover:text-[#8FB987]">
                            {item.title}
                          </h3>
                        </button>
                        <p className="mt-0.5 truncate text-xs text-[#61665D] dark:text-[#9CA096]">
                          {item.author} · {item.year}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {isBorrowed ? (
                          <button
                            type="button"
                            onClick={() => onReadNow(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D5A27] px-3.5 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#23471E] dark:bg-[#3A7032] whitespace-nowrap cursor-pointer"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Buka Bacaan</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onBorrow(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D5A27] px-3.5 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#23471E] dark:bg-[#3A7032] whitespace-nowrap cursor-pointer"
                          >
                            <CalendarClock className="h-3.5 w-3.5" />
                            <span>Pinjam Digital</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onToggleSave(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8D2C5] px-3 py-1.5 text-xs font-medium text-[#61665D] hover:border-[#D96B43] hover:text-[#D96B43] dark:border-[#2F342A] dark:text-[#9CA096] whitespace-nowrap cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Riwayat Bacaan */}
      {activeTab === "riwayat" && (
        <div>
          {historyItems.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] px-6 py-12 text-center dark:border-[#262922] dark:bg-[#171915]">
              <p className="font-serif text-lg font-medium text-[#1F241D] dark:text-[#ECE9E1]">
                Belum ada riwayat bacaan
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E0D5] overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] dark:divide-[#262922] dark:border-[#262922] dark:bg-[#171915]">
              {historyItems.map(({ progress, item }) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md border border-[#E5E0D5] dark:border-[#2B2F26]">
                      <BookCover item={item} size="sm" className="h-full w-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#61665D] tabular-nums dark:text-[#9CA096]">
                        Terakhir dibuka {formatLastRead(progress.lastReadAt)} ·{" "}
                        {progress.percent}% selesai
                      </p>
                      <h3 className="mt-0.5 truncate font-serif text-base font-semibold text-[#1F241D] dark:text-[#ECE9E1]">
                        {item.title}
                      </h3>
                      <p className="truncate text-xs text-[#555B51] dark:text-[#A4A89E]">
                        {item.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="rounded-lg border border-[#D8D2C5] px-3 py-1.5 text-xs font-medium text-[#43483F] hover:border-[#1F241D] dark:border-[#2F342A] dark:text-[#B8BCB2] whitespace-nowrap cursor-pointer"
                    >
                      Detail & Sitasi
                    </button>
                    <button
                      type="button"
                      onClick={() => onReadNow(item)}
                      className="rounded-lg bg-[#2D5A27] px-3.5 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#23471E] dark:bg-[#3A7032] whitespace-nowrap cursor-pointer"
                    >
                      Baca Lagi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
