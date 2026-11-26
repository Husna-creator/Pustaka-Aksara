import { useState } from "react";
import { BookOpen, Headphones, FileText, Archive } from "lucide-react";
import { LibraryItem } from "../types/library";

interface BookCoverProps {
  item: LibraryItem;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BookCover({
  item,
  className = "",
  size = "md",
}: BookCoverProps) {
  const [imgError, setImgError] = useState(false);

  const FormatIcon =
    item.format === "Audiobook"
      ? Headphones
      : item.format === "Jurnal"
        ? FileText
        : item.format === "Arsip Digital"
          ? Archive
          : BookOpen;

  if (item.coverImage && !imgError) {
    return (
      <div
        className={`relative overflow-hidden bg-[#EBE6DD] dark:bg-[#1E211C] ${className}`}
      >
        <img
          src={item.coverImage}
          alt={`Sampul ${item.title}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* Subtle book spine crease highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/10 to-transparent"
        />
      </div>
    );
  }

  // Bespoke cloth-bound archival typographic cover when no raster image is assigned or on fallback
  const { bg, accent, ink, motif } = item.coverPalette;
  const titleSizeClass =
    size === "sm"
      ? "text-xs leading-snug"
      : size === "lg"
        ? "text-xl sm:text-2xl leading-tight"
        : "text-sm sm:text-base leading-snug";

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden p-4 select-none ${className}`}
      style={{ backgroundColor: bg, color: ink }}
    >
      {/* Left spine fold effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 via-black/5 to-transparent"
      />

      {/* Hairline inner editorial frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border opacity-25"
        style={{ borderColor: ink }}
      />

      {/* Geometric/Archival SVG Motif */}
      <svg
        aria-hidden="true"
        viewBox="0 0 160 160"
        className="pointer-events-none absolute right-2 bottom-2 h-28 w-28 opacity-20"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
      >
        {motif === "grid" && (
          <>
            <rect x="20" y="20" width="120" height="120" />
            <line x1="60" y1="20" x2="60" y2="140" />
            <line x1="100" y1="20" x2="100" y2="140" />
            <line x1="20" y1="60" x2="140" y2="60" />
            <line x1="20" y1="100" x2="140" y2="100" />
            <circle cx="80" cy="80" r="32" />
          </>
        )}
        {motif === "wave" && (
          <>
            <path d="M10 60 Q 45 30, 80 60 T 150 60" />
            <path d="M10 85 Q 45 55, 80 85 T 150 85" />
            <path d="M10 110 Q 45 80, 80 110 T 150 110" />
            <circle cx="115" cy="38" r="14" />
          </>
        )}
        {motif === "arch" && (
          <>
            <path d="M35 140 V75 A45 45 0 0 1 125 75 V140" />
            <path d="M52 140 V80 A28 28 0 0 1 108 80 V140" />
            <line x1="20" y1="140" x2="140" y2="140" />
          </>
        )}
        {motif === "compass" && (
          <>
            <circle cx="80" cy="80" r="52" />
            <circle cx="80" cy="80" r="32" />
            <line x1="80" y1="16" x2="80" y2="144" />
            <line x1="16" y1="80" x2="144" y2="80" />
          </>
        )}
        {motif === "manuscript" && (
          <>
            <rect x="22" y="34" width="116" height="22" rx="11" />
            <rect x="22" y="69" width="116" height="22" rx="11" />
            <rect x="22" y="104" width="116" height="22" rx="11" />
            <circle cx="45" cy="45" r="2.5" fill={accent} />
            <circle cx="45" cy="80" r="2.5" fill={accent} />
            <circle cx="45" cy="115" r="2.5" fill={accent} />
          </>
        )}
        {motif === "botanical" && (
          <>
            <path d="M80 140 V30" />
            <path d="M80 110 C55 100, 45 80, 50 65 C65 72, 76 85, 80 110Z" />
            <path d="M80 95 C105 85, 115 65, 110 50 C95 57, 84 70, 80 95Z" />
          </>
        )}
      </svg>

      {/* Top archival header */}
      <div className="relative z-10 flex items-center justify-between gap-2 pl-1.5">
        <span className="font-mono text-[10px] tracking-wider uppercase opacity-75">
          DDC {item.ddc}
        </span>
        <FormatIcon className="h-3.5 w-3.5 opacity-75 shrink-0" />
      </div>

      {/* Center Editorial Title */}
      <div className="relative z-10 my-auto py-2 pl-1.5">
        <p
          className="mb-1.5 text-[10px] font-medium tracking-wider uppercase opacity-80"
          style={{ color: accent }}
        >
          {item.format}
        </p>
        <h4
          className={`font-serif font-semibold tracking-tight line-clamp-3 ${titleSizeClass}`}
        >
          {item.title}
        </h4>
      </div>

      {/* Bottom Author & Year */}
      <div className="relative z-10 border-t pt-2 pl-1.5" style={{ borderColor: `${ink}25` }}>
        <p className="truncate text-[11px] font-medium opacity-90">
          {item.author}
        </p>
        <p className="font-mono text-[10px] opacity-65 tabular-nums">
          {item.year}
        </p>
      </div>
    </div>
  );
}
