import { CitationStyle, LibraryItem } from "../types/library";

function formatAuthorAPA(author: string): string {
  const parts = author.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastName = parts[parts.length - 1];
  const initials = parts
    .slice(0, -1)
    .map((name) => `${name.charAt(0).toUpperCase()}.`)
    .join(" ");
  return `${lastName}, ${initials}`;
}

function formatAuthorMLA(author: string): string {
  const parts = author.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastName = parts[parts.length - 1];
  const firstNames = parts.slice(0, -1).join(" ");
  return `${lastName}, ${firstNames}`;
}

export function generateCitation(
  item: LibraryItem,
  style: CitationStyle
): string {
  const titleFull = item.subtitle
    ? `${item.title}: ${item.subtitle}`
    : item.title;

  if (style === "APA") {
    const apaAuthor = formatAuthorAPA(item.author);
    if (item.format === "Jurnal") {
      const vol = item.volumeIssue ? `, ${item.volumeIssue}` : "";
      const doiPart = item.doi ? ` https://doi.org/${item.doi}` : "";
      return `${apaAuthor} (${item.year}). ${titleFull}. ${item.publisher}${vol}.${doiPart}`;
    }
    const formatNote =
      item.format === "Audiobook"
        ? " [Audiobook]"
        : item.format === "Arsip Digital"
          ? " [Arsip digital]"
          : "";
    return `${apaAuthor} (${item.year}). ${titleFull}${formatNote}. ${item.publisher}.`;
  }

  if (style === "MLA") {
    const mlaAuthor = formatAuthorMLA(item.author);
    if (item.format === "Jurnal") {
      const vol = item.volumeIssue ? `, ${item.volumeIssue}` : "";
      return `${mlaAuthor}. "${titleFull}." ${item.publisher}${vol}, ${item.year}. Pustaka Aksara Digital Archive.`;
    }
    return `${mlaAuthor}. ${titleFull}. ${item.publisher}, ${item.year}. Pustaka Aksara, ${item.format}.`;
  }

  // Chicago 17th Notes & Bibliography
  const chicagoAuthor = formatAuthorMLA(item.author);
  if (item.format === "Jurnal") {
    const vol = item.volumeIssue ? ` ${item.volumeIssue}` : "";
    const doiPart = item.doi ? ` https://doi.org/${item.doi}.` : ".";
    return `${chicagoAuthor}. "${titleFull}." ${item.publisher}${vol} (${item.year})${doiPart}`;
  }
  return `${chicagoAuthor}. ${titleFull}. ${item.publisher}, ${item.year}. ${item.isbnOrIssn}.`;
}
