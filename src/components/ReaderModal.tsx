import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Pause,
  Play,
  Quote,
  RotateCcw,
  RotateCw,
  Sliders,
  Volume2,
  X,
} from "lucide-react";
import {
  LibraryItem,
  ReaderFontSize,
  ReaderLineHeight,
  ReaderTheme,
  ReadingProgress,
} from "../types/library";
import { BookCover } from "./BookCover";
import { CitationBlock } from "./CitationBlock";

interface ReaderModalProps {
  item: LibraryItem | null;
  progress?: ReadingProgress;
  onClose: () => void;
  onUpdateProgress: (
    itemId: string,
    chapterIndex: number,
    percent: number,
    audioSeconds?: number
  ) => void;
}

function formatTime(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function ReaderModal({
  item,
  progress,
  onClose,
  onUpdateProgress,
}: ReaderModalProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [theme, setTheme] = useState<ReaderTheme>("paper");
  const [fontSize, setFontSize] = useState<ReaderFontSize>("md");
  const [lineHeight, setLineHeight] = useState<ReaderLineHeight>("comfortable");
  const [showSettings, setShowSettings] = useState(false);
  const [showCitation, setShowCitation] = useState(false);

  // Audio player state
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [useSpeechVoice, setUseSpeechVoice] = useState(false);

  useEffect(() => {
    if (!item) return;
    const startChapter = Math.min(
      progress?.chapterIndex ?? 0,
      Math.max(0, item.chapters.length - 1)
    );
    setChapterIndex(startChapter);
    setIsAudioMode(item.format === "Audiobook");
    setAudioSeconds(progress?.audioSeconds ?? 0);
    setIsPlaying(false);
    setShowSettings(false);
    setShowCitation(false);
  }, [item?.id]);

  // Stop any Web Speech API narration on close or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Audio timer loop when playing
  useEffect(() => {
    if (!item || !isAudioMode || !isPlaying) return;
    const totalDur = item.totalAudioSeconds ?? 1200;
    const interval = setInterval(() => {
      setAudioSeconds((prev) => {
        const next = Math.min(totalDur, prev + playbackRate);
        const pct = Math.min(100, Math.round((next / totalDur) * 100));
        onUpdateProgress(item.id, chapterIndex, pct, next);
        if (next >= totalDur) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [item, isAudioMode, isPlaying, playbackRate, chapterIndex, onUpdateProgress]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const chapters = item.chapters;
  const activeChapter = chapters[chapterIndex] || chapters[0];
  const textPercent = Math.round(((chapterIndex + 1) / chapters.length) * 100);
  const totalAudioDur = item.totalAudioSeconds ?? 1200;
  const audioPercent = Math.min(
    100,
    Math.round((audioSeconds / totalAudioDur) * 100)
  );
  const effectivePercent = isAudioMode ? audioPercent : textPercent;

  const selectChapter = (idx: number) => {
    const bounded = Math.max(0, Math.min(chapters.length - 1, idx));
    setChapterIndex(bounded);
    const pct = Math.round(((bounded + 1) / chapters.length) * 100);
    onUpdateProgress(item.id, bounded, pct, audioSeconds);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleAudioPlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (nextPlay && useSpeechVoice && activeChapter) {
        const utterance = new SpeechSynthesisUtterance(
          `${activeChapter.title}. ${activeChapter.paragraphs.join(" ")}`
        );
        utterance.lang = "id-ID";
        utterance.rate = playbackRate;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const skipAudio = (delta: number) => {
    const next = Math.max(0, Math.min(totalAudioDur, audioSeconds + delta));
    setAudioSeconds(next);
    const pct = Math.min(100, Math.round((next / totalAudioDur) * 100));
    onUpdateProgress(item.id, chapterIndex, pct, next);
  };

  const themeClasses: Record<
    ReaderTheme,
    { bg: string; surface: string; text: string; muted: string; border: string }
  > = {
    paper: {
      bg: "bg-[#FFFFFF]",
      surface: "bg-[#F7F6F2]",
      text: "text-[#1E201D]",
      muted: "text-[#63675E]",
      border: "border-[#E6E4DC]",
    },
    sepia: {
      bg: "bg-[#F4ECD8]",
      surface: "bg-[#EBE0C7]",
      text: "text-[#382C1E]",
      muted: "text-[#6E5C45]",
      border: "border-[#DFD2B5]",
    },
    dark: {
      bg: "bg-[#171816]",
      surface: "bg-[#20221E]",
      text: "text-[#E6E3DA]",
      muted: "text-[#9CA095]",
      border: "border-[#2D302A]",
    },
  };

  const currentTheme = themeClasses[theme];

  const fontSizeClass: Record<ReaderFontSize, string> = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
  };

  const lineHeightClass: Record<ReaderLineHeight, string> = {
    compact: "leading-relaxed",
    comfortable: "leading-[1.8]",
    relaxed: "leading-[2.05]",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Pembaca: ${item.title}`}
      className={`fixed inset-0 z-50 flex flex-col ${currentTheme.bg} ${currentTheme.text} transition-colors duration-200`}
    >
      {/* Top Distraction-Free Toolbar */}
      <header
        className={`relative flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6 ${currentTheme.border}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            aria-label="Keluar dari mode baca"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors cursor-pointer ${currentTheme.border} hover:opacity-80`}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <p className="truncate font-serif text-sm font-semibold sm:text-base">
              {item.title}
            </p>
            <p className={`truncate text-[11px] ${currentTheme.muted}`}>
              {item.author} · {activeChapter.number}
            </p>
          </div>
        </div>

        {/* Mode & Typography Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Switch between Text Reader and Audio Mode */}
          <button
            type="button"
            onClick={() => {
              setIsAudioMode(!isAudioMode);
              setIsPlaying(false);
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${currentTheme.border}`}
          >
            {isAudioMode ? (
              <>
                <BookOpen className="h-3.5 w-3.5" />
                <span>Mode Teks</span>
              </>
            ) : (
              <>
                <Headphones className="h-3.5 w-3.5" />
                <span>Mode Audio</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowCitation(!showCitation);
              setShowSettings(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              showCitation
                ? "border-[#2D5A27] bg-[#2D5A27] text-[#FAF8F5]"
                : currentTheme.border
            }`}
          >
            <Quote className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sitasi</span>
          </button>

          {!isAudioMode && (
            <button
              type="button"
              onClick={() => {
                setShowSettings(!showSettings);
                setShowCitation(false);
              }}
              aria-label="Pengaturan tampilan baca"
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                showSettings
                  ? "border-[#2D5A27] bg-[#2D5A27] text-[#FAF8F5]"
                  : currentTheme.border
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tampilan</span>
            </button>
          )}
        </div>

        {/* Thin Progress Bar at bottom of toolbar */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/5 dark:bg-white/5">
          <div
            className="h-full bg-[#2D5A27] transition-all duration-300 dark:bg-[#7CA974]"
            style={{ width: `${effectivePercent}%` }}
          />
        </div>
      </header>

      {/* Typography Settings Popover */}
      {showSettings && !isAudioMode && (
        <div
          className={`border-b px-4 py-4 sm:px-6 ${currentTheme.surface} ${currentTheme.border}`}
        >
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-5 text-xs">
            {/* Theme Picker */}
            <div className="flex items-center gap-2">
              <span className={`font-medium ${currentTheme.muted}`}>Tema:</span>
              {(
                [
                  { id: "paper", label: "Putih" },
                  { id: "sepia", label: "Sepia" },
                  { id: "dark", label: "Gelap" },
                ] as Array<{ id: ReaderTheme; label: string }>
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`rounded-lg border px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                    theme === t.id
                      ? "border-[#2D5A27] bg-[#2D5A27] text-white"
                      : currentTheme.border
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1.5">
              <span className={`mr-1 font-medium ${currentTheme.muted}`}>
                Ukuran:
              </span>
              {(["sm", "md", "lg", "xl"] as ReaderFontSize[]).map((sz, idx) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  className={`rounded-lg border px-2.5 py-1 font-medium cursor-pointer ${
                    fontSize === sz
                      ? "border-[#2D5A27] bg-[#2D5A27] text-white"
                      : currentTheme.border
                  }`}
                >
                  {["A-", "A", "A+", "A++"][idx]}
                </button>
              ))}
            </div>

            {/* Line Spacing */}
            <div className="flex items-center gap-1.5">
              <span className={`mr-1 font-medium ${currentTheme.muted}`}>
                Spasi:
              </span>
              {(
                [
                  { id: "compact", label: "Rapat" },
                  { id: "comfortable", label: "Nyaman" },
                  { id: "relaxed", label: "Lega" },
                ] as Array<{ id: ReaderLineHeight; label: string }>
              ).map((lh) => (
                <button
                  key={lh.id}
                  type="button"
                  onClick={() => setLineHeight(lh.id)}
                  className={`rounded-lg border px-2.5 py-1 font-medium cursor-pointer ${
                    lineHeight === lh.id
                      ? "border-[#2D5A27] bg-[#2D5A27] text-white"
                      : currentTheme.border
                  }`}
                >
                  {lh.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Citation Panel Drawer */}
      {showCitation && (
        <div
          className={`border-b px-4 py-4 sm:px-6 ${currentTheme.surface} ${currentTheme.border}`}
        >
          <div className="mx-auto max-w-2xl">
            <CitationBlock item={item} compact />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-12">
        {isAudioMode ? (
          /* Integrated Audio Player Canvas */
          <div className="mx-auto max-w-xl">
            <div
              className={`rounded-2xl border p-6 sm:p-8 ${currentTheme.surface} ${currentTheme.border}`}
            >
              <div className="mx-auto aspect-[3/4] w-44 overflow-hidden rounded-xl shadow-lg">
                <BookCover item={item} size="md" className="h-full w-full" />
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs font-medium tracking-wider text-[#D96B43] uppercase">
                  {activeChapter.number}
                </p>
                <h2 className="mt-1 font-serif text-xl font-semibold sm:text-2xl">
                  {activeChapter.title}
                </h2>
                <p className={`mt-1 text-sm ${currentTheme.muted}`}>
                  {item.author}
                </p>
              </div>

              {/* Scrubber */}
              <div className="mt-7">
                <input
                  type="range"
                  min={0}
                  max={totalAudioDur}
                  value={audioSeconds}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAudioSeconds(val);
                    const pct = Math.min(
                      100,
                      Math.round((val / totalAudioDur) * 100)
                    );
                    onUpdateProgress(item.id, chapterIndex, pct, val);
                  }}
                  aria-label="Posisi pemutaran audio"
                  className="w-full accent-[#2D5A27] cursor-pointer"
                />
                <div
                  className={`mt-1.5 flex justify-between font-mono text-xs tabular-nums ${currentTheme.muted}`}
                >
                  <span>{formatTime(audioSeconds)}</span>
                  <span>{formatTime(totalAudioDur)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="mt-6 flex items-center justify-center gap-5">
                <button
                  type="button"
                  onClick={() => skipAudio(-15)}
                  aria-label="Mundur 15 detik"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors cursor-pointer ${currentTheme.border}`}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleAudioPlay}
                  aria-label={isPlaying ? "Jeda audio" : "Putar audio"}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2D5A27] text-[#FAF8F5] shadow-md transition-transform hover:scale-105 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => skipAudio(15)}
                  aria-label="Maju 15 detik"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors cursor-pointer ${currentTheme.border}`}
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>

              {/* Speed & Voice Narration Toggle */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs border-black/10 dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className={currentTheme.muted}>Kecepatan:</span>
                  {([1, 1.25, 1.5] as const).map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPlaybackRate(rate)}
                      className={`rounded-md px-2 py-1 font-mono tabular-nums cursor-pointer ${
                        playbackRate === rate
                          ? "bg-[#2D5A27] text-white"
                          : currentTheme.muted
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setUseSpeechVoice(!useSpeechVoice)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-medium cursor-pointer ${
                    useSpeechVoice
                      ? "border-[#2D5A27] text-[#2D5A27] dark:border-[#8FB987] dark:text-[#8FB987]"
                      : currentTheme.border
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>
                    {useSpeechVoice ? "Narasi Suara Aktif" : "Aktifkan Suara Baca"}
                  </span>
                </button>
              </div>

              {/* Audio Track List */}
              <div className="mt-6 space-y-1.5 border-t pt-4 border-black/10 dark:border-white/10">
                <p className={`text-xs font-semibold uppercase ${currentTheme.muted}`}>
                  Daftar Trek
                </p>
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => selectChapter(idx)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                      idx === chapterIndex
                        ? "bg-[#2D5A27]/15 font-semibold text-[#2D5A27] dark:text-[#8FB987]"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">
                      {ch.number} — {ch.title}
                    </span>
                    <span className="ml-2 shrink-0 font-mono tabular-nums opacity-75">
                      {ch.durationMinutes ? `${ch.durationMinutes} mnt` : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Editorial Long-Form Text Reader Canvas */
          <article className="mx-auto max-w-[66ch]">
            <header className="border-b pb-6 border-black/10 dark:border-white/10">
              <p className="text-xs font-semibold tracking-widest text-[#D96B43] uppercase">
                {activeChapter.number}
              </p>
              <h1
                className="mt-2 font-serif text-2xl font-semibold leading-tight sm:text-4xl"
                style={{ textWrap: "balance" }}
              >
                {activeChapter.title}
              </h1>
            </header>

            <div className="mt-8 space-y-6">
              {activeChapter.paragraphs.map((para, index) => (
                <p
                  key={index}
                  className={`font-serif ${fontSizeClass[fontSize]} ${lineHeightClass[lineHeight]} ${
                    index === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-semibold first-letter:leading-none"
                      : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {activeChapter.pullQuote && (
              <blockquote
                className={`my-10 border-y py-6 text-center font-serif text-xl italic sm:text-2xl ${currentTheme.border}`}
              >
                “{activeChapter.pullQuote}”
              </blockquote>
            )}

            {/* Chapter Navigation Footer */}
            <footer
              className={`mt-12 flex items-center justify-between gap-4 border-t pt-6 ${currentTheme.border}`}
            >
              <button
                type="button"
                disabled={chapterIndex === 0}
                onClick={() => selectChapter(chapterIndex - 1)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium transition-colors disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed ${currentTheme.border}`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Bab Sebelumnya</span>
              </button>

              <span
                className={`font-mono text-xs tabular-nums ${currentTheme.muted}`}
              >
                {chapterIndex + 1} / {chapters.length} ({effectivePercent}%)
              </span>

              <button
                type="button"
                disabled={chapterIndex >= chapters.length - 1}
                onClick={() => selectChapter(chapterIndex + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D5A27] px-4 py-2 text-xs font-medium text-[#FAF8F5] transition-colors hover:bg-[#23471E] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Bab Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}
