/**
 * Parses a string of tags separated by commas or whitespace.
 * Ensures each tag has a single '#' prefix and removes duplicates.
 */
export function parseTags(tagsString: string | null | undefined): string[] {
  if (!tagsString) return [];
  
  const rawTags = tagsString
    .split(/[,\s]+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
    
  const normalizedTags = rawTags.map(tag => {
    // Remove all leading # first to avoid ##tag
    const cleanTag = tag.replace(/^#+/, '');
    return cleanTag ? `#${cleanTag}` : '';
  }).filter(Boolean);
  
  // Return unique tags
  return Array.from(new Set(normalizedTags));
}
