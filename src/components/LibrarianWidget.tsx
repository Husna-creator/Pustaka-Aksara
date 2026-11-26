import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Loader2,
  MessageSquareText,
  Send,
  X,
} from "lucide-react";
import { LibraryItem } from "../types/library";

interface LibrarianMessage {
  id: string;
  role: "user" | "model";
  text: string;
  recommendedIds?: string[];
  followUpPrompts?: string[];
}

interface LibrarianWidgetProps {
  catalog: LibraryItem[];
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  onOpenDetail: (item: LibraryItem) => void;
}

const STARTER_PROMPTS = [
  "Rekomendasikan bacaan sastra yang tenang untuk malam hari",
  "Saya meneliti arsitektur tropis & ruang kampung kota",
  "Ringkaskan buku Atlas Pakis & Ekologi Hutan Hujan",
];

export function LibrarianWidget({
  catalog,
  isOpen,
  onToggleOpen,
  onOpenDetail,
}: LibrarianWidgetProps) {
  const [messages, setMessages] = useState<LibrarianMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Halo, saya Aksara, pustakawan digital Anda. Ceritakan suasana hati membaca Anda, topik riset yang sedang digarap, atau tanyakan ringkasan salah satu koleksi kami.",
      followUpPrompts: STARTER_PROMPTS,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    const userMsg: LibrarianMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/librarian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory
            .filter((m) => m.id !== "welcome")
            .slice(-6)
            .map((m) => ({ role: m.role, text: m.text })),
          catalog: catalog.map((c) => ({
            id: c.id,
            title: c.title,
            author: c.author,
            format: c.format,
            subject: c.subject,
            ddc: c.ddc,
            year: c.year,
            synopsis: c.synopsis,
          })),
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        recommendedIds?: string[];
        followUpPrompts?: string[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal terhubung ke layanan AI Pustakawan."
        );
      }

      const modelMsg: LibrarianMessage = {
        id: `m-${Date.now()}`,
        role: "model",
        text: data.reply || "Berikut rekomendasi yang dapat saya temukan.",
        recommendedIds: data.recommendedIds || [],
        followUpPrompts: data.followUpPrompts || [],
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Terjadi kendala jaringan saat menghubungi AI Pustakawan."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => onToggleOpen(true)}
          aria-label="Buka AI Pustakawan"
          className="fixed right-5 bottom-20 z-40 hidden md:inline-flex items-center gap-2.5 rounded-full border border-[#23471E] bg-[#2D5A27] px-4 py-3 text-sm font-medium text-[#FAF8F5] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#23471E] dark:border-[#4B8A43] dark:bg-[#3A7032] dark:hover:bg-[#46853C] cursor-pointer"
        >
          <MessageSquareText className="h-4 w-4" />
          <span className="whitespace-nowrap">Tanya Pustakawan</span>
        </button>
      )}

      {/* Floating Assistant Panel */}
      {isOpen && (
        <aside
          aria-label="Asisten AI Pustakawan"
          className="fixed right-3 bottom-16 z-50 flex h-[min(560px,calc(100vh-6rem))] w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-[#D8D2C5] bg-[#FAF8F5] shadow-2xl sm:right-5 sm:bottom-5 dark:border-[#2F342A] dark:bg-[#161814]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E0D5] bg-[#F2EFE8] px-4 py-3.5 dark:border-[#262922] dark:bg-[#1D201A]">
            <div>
              <h2 className="font-serif text-base font-semibold text-[#1F241D] dark:text-[#ECE9E1]">
                AI Pustakawan Aksara
              </h2>
              <p className="text-[11px] text-[#61665D] dark:text-[#9CA096]">
                Rekomendasi mood, topik riset & ringkasan koleksi
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleOpen(false)}
              aria-label="Tutup asisten pustakawan"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#61665D] hover:bg-black/5 hover:text-[#1F241D] dark:text-[#9CA096] dark:hover:bg-white/5 dark:hover:text-[#ECE9E1] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg) => {
              const recommendedBooks = (msg.recommendedIds || [])
                .map((id) => catalog.find((c) => c.id === id))
                .filter((item): item is LibraryItem => Boolean(item));

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed sm:text-[13px] ${
                      msg.role === "user"
                        ? "bg-[#2D5A27] text-[#FAF8F5] dark:bg-[#3A7032]"
                        : "border border-[#E5E0D5] bg-[#F4F1EA] text-[#1F241D] dark:border-[#2B2F26] dark:bg-[#1E211C] dark:text-[#ECE9E1]"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Clickable Recommended Books */}
                  {recommendedBooks.length > 0 && (
                    <div className="mt-2 w-full max-w-[92%] space-y-1.5">
                      {recommendedBooks.map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => onOpenDetail(book)}
                          className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-[#DFD9CC] bg-[#FAF8F5] px-3 py-2 text-left transition-colors hover:border-[#2D5A27] dark:border-[#2B2F26] dark:bg-[#191C17] dark:hover:border-[#8FB987] cursor-pointer"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <BookOpen className="h-4 w-4 shrink-0 text-[#D96B43]" />
                            <div className="min-w-0">
                              <p className="truncate font-serif text-xs font-semibold text-[#1F241D] dark:text-[#ECE9E1]">
                                {book.title}
                              </p>
                              <p className="truncate text-[11px] text-[#61665D] dark:text-[#9CA096]">
                                {book.author} · {book.format}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 text-[11px] font-medium text-[#2D5A27] dark:text-[#8FB987]">
                            Lihat →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggested Follow-ups */}
                  {msg.role === "model" &&
                    msg.followUpPrompts &&
                    msg.followUpPrompts.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.followUpPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => void sendMessage(prompt)}
                            className="rounded-lg border border-[#DDD7C9] bg-[#FAF8F5] px-2.5 py-1 text-left text-[11px] text-[#43483F] transition-colors hover:border-[#2D5A27] hover:text-[#2D5A27] dark:border-[#2B2F26] dark:bg-[#191C17] dark:text-[#B8BCB2] dark:hover:border-[#8FB987] cursor-pointer"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#61665D] dark:text-[#9CA096]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2D5A27] dark:text-[#8FB987]" />
                <span>Pustakawan sedang menelusuri katalog...</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2 rounded-xl border border-[#D96B43]/40 bg-[#D96B43]/10 p-3 text-xs text-[#A34220] dark:text-[#F09E7E]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#E5E0D5] bg-[#FAF8F5] p-3 dark:border-[#262922] dark:bg-[#161814]"
          >
            <div className="flex items-center gap-2 rounded-xl border border-[#D8D2C5] bg-[#F4F1EA] px-3 py-1.5 dark:border-[#2F342A] dark:bg-[#1D201A]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya topik riset atau mood bacaan..."
                aria-label="Pertanyaan untuk AI Pustakawan"
                className="w-full bg-transparent py-1 text-xs text-[#1F241D] placeholder:text-[#7D8278] focus:outline-none sm:text-sm dark:text-[#ECE9E1]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Kirim pertanyaan"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2D5A27] text-[#FAF8F5] transition-colors hover:bg-[#23471E] disabled:opacity-40 dark:bg-[#3A7032] cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </aside>
      )}
    </>
  );
}
