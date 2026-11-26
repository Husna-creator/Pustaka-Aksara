import { useState } from "react";
import { Check, Copy, Quote } from "lucide-react";
import { CitationStyle, LibraryItem } from "../types/library";
import { generateCitation } from "../utils/citations";

interface CitationBlockProps {
  item: LibraryItem;
  compact?: boolean;
}

export function CitationBlock({ item, compact = false }: CitationBlockProps) {
  const [style, setStyle] = useState<CitationStyle>("APA");
  const [copied, setCopied] = useState(false);

  const citationText = generateCitation(item, style);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback textarea copy
      const el = document.createElement("textarea");
      el.value = citationText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const styles: Array<{ id: CitationStyle; label: string }> = [
    { id: "APA", label: "APA 7th" },
    { id: "MLA", label: "MLA 9th" },
    { id: "Chicago", label: "Chicago" },
  ];

  return (
    <div
      className={`rounded-xl border border-[#E5E0D5] bg-[#F5F2EB] dark:border-[#2B2F26] dark:bg-[#191C17] ${
        compact ? "p-3.5" : "p-4 sm:p-5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#43483F] uppercase dark:text-[#B8BCB2]">
          <Quote className="h-3.5 w-3.5 text-[#D96B43]" />
          <span>Sitasi Otomatis</span>
        </div>

        <div
          role="tablist"
          aria-label="Format sitasi"
          className="inline-flex items-center rounded-lg bg-[#EAE5DA] p-0.5 dark:bg-[#232720]"
        >
          {styles.map((tab) => {
            const active = style === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStyle(tab.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? "bg-[#FAF8F5] text-[#1F241D] shadow-xs dark:bg-[#31362D] dark:text-[#ECE9E1]"
                    : "text-[#61665D] hover:text-[#1F241D] dark:text-[#9CA096] dark:hover:text-[#ECE9E1]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 font-mono text-xs leading-relaxed text-[#2C3129] select-all dark:text-[#D9D7CE]">
        {citationText}
      </p>

      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            copied
              ? "bg-[#2D5A27] text-[#FAF8F5] dark:bg-[#3A7032]"
              : "border border-[#D5CFC2] bg-[#FAF8F5] text-[#1F241D] hover:border-[#2D5A27] hover:text-[#2D5A27] dark:border-[#34392F] dark:bg-[#22261F] dark:text-[#ECE9E1] dark:hover:border-[#8FB987] dark:hover:text-[#8FB987]"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Sitasi Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Sitasi ({style})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
