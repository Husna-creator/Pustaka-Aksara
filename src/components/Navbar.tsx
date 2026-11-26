import { BookMarked, Compass, Home, Moon, Sparkles, Sun, FileText } from "lucide-react";
import { AppSection } from "../types/library";

interface NavbarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  borrowedCount: number;
  onOpenLibrarian: () => void;
}

export function Navbar({
  activeSection,
  onNavigate,
  isDark,
  onToggleTheme,
  borrowedCount,
  onOpenLibrarian,
}: NavbarProps) {
  const navItems: Array<{ id: AppSection; label: string }> = [
    { id: "beranda", label: "Beranda" },
    { id: "katalog", label: "Katalog" },
    { id: "jurnal", label: "Jurnal Terbuka" },
    { id: "rak", label: "Rak Bukuku" },
  ];

  return (
    <>
      {/* Desktop & Mobile Top Navigation — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-[#E5E0D5] bg-[#FAF8F5]/95 backdrop-blur-sm dark:border-[#262922] dark:bg-[#131512]/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate("beranda")}
            className="font-['Playfair_Display'] text-xl font-semibold tracking-tight text-[#1F241D] transition-colors hover:text-[#2D5A27] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5A27] dark:text-[#ECE9E1] dark:hover:text-[#8FB987] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Pustaka Aksara
          </button>

          {/* Zone 2: Clean Typography Nav Links */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-7"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5A27] ${
                    isActive
                      ? "text-[#2D5A27] dark:text-[#8FB987]"
                      : "text-[#5C6158] hover:text-[#1F241D] dark:text-[#A4A89E] dark:hover:text-[#ECE9E1]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-[#2D5A27] dark:bg-[#8FB987]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Switch & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
              title={isDark ? "Mode Terang" : "Mode Gelap"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E0D5] bg-[#F4F1EA] text-[#43483F] transition-colors hover:border-[#2D5A27]/40 hover:text-[#2D5A27] dark:border-[#2B2F26] dark:bg-[#1C1E19] dark:text-[#C5C8BE] dark:hover:border-[#8FB987]/50 dark:hover:text-[#8FB987] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5A27]"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => onNavigate("rak")}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#2D5A27] px-4 py-2 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#23471E] dark:bg-[#3A7032] dark:hover:bg-[#46853C] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5A27]"
            >
              <BookMarked className="h-4 w-4" />
              <span>Rak Saya</span>
              <span className="font-mono text-xs opacity-90 tabular-nums">
                ({borrowedCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar — Compact 56px height (<15% viewport cap) */}
      <nav
        aria-label="Navigasi seluler"
        className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-[#E5E0D5] bg-[#FAF8F5]/95 px-2 backdrop-blur-md md:hidden dark:border-[#262922] dark:bg-[#131512]/95"
      >
        <button
          type="button"
          onClick={() => onNavigate("beranda")}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeSection === "beranda"
              ? "text-[#2D5A27] dark:text-[#8FB987]"
              : "text-[#6B7066] dark:text-[#9CA096]"
          }`}
        >
          <Home className="h-4 w-4" />
          <span className="whitespace-nowrap">Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("katalog")}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeSection === "katalog"
              ? "text-[#2D5A27] dark:text-[#8FB987]"
              : "text-[#6B7066] dark:text-[#9CA096]"
          }`}
        >
          <Compass className="h-4 w-4" />
          <span className="whitespace-nowrap">Katalog</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("jurnal")}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeSection === "jurnal"
              ? "text-[#2D5A27] dark:text-[#8FB987]"
              : "text-[#6B7066] dark:text-[#9CA096]"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span className="whitespace-nowrap">Jurnal</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("rak")}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeSection === "rak"
              ? "text-[#2D5A27] dark:text-[#8FB987]"
              : "text-[#6B7066] dark:text-[#9CA096]"
          }`}
        >
          <BookMarked className="h-4 w-4" />
          <span className="whitespace-nowrap tabular-nums">
            Rak ({borrowedCount})
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenLibrarian}
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#D96B43] dark:text-[#E58966]"
        >
          <Sparkles className="h-4 w-4" />
          <span className="whitespace-nowrap">Pustakawan</span>
        </button>
      </nav>
    </>
  );
}
