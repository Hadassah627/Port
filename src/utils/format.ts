export const truncate = (value: string, length = 140) => {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trim()}...`;
};

export const toCommaList = (value: string[] | string | undefined | null) => {
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
};

export const splitCommaList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const splitLines = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const formatNumber = (value: number | string) => new Intl.NumberFormat('en-US').format(Number(value));

export const classNames = (...values: Array<string | false | undefined | null>) => values.filter(Boolean).join(' ');

export const getEmbedMapUrl = (mapUrl: string | undefined, fallbackAddress: string) => {
  if (!mapUrl) return '';

  const trimmed = mapUrl.trim();

  // Precise mapping for the user's specific short link
  if (trimmed === 'https://maps.app.goo.gl/rtXqea4u5bJaiqBM9' || trimmed.includes('rtXqea4u5bJaiqBM9')) {
    return 'https://maps.google.com/maps?q=13.5555378,80.0266517(IIITS%20Academic%20Block)&t=&z=15&ie=UTF8&iwloc=&output=embed';
  }

  // Already a valid embed link
  if (trimmed.includes('google.com/maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }

  // Extract place name from standard location links
  if (trimmed.includes('/maps/place/')) {
    const parts = trimmed.split('/maps/place/');
    if (parts[1]) {
      const placeName = parts[1].split('/')[0];
      if (placeName) {
        return `https://maps.google.com/maps?q=${placeName}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
    }
  }

  // If it's a sharing link (maps.app.goo.gl / goo.gl), fall back to office address search query
  if (trimmed.includes('goo.gl') || trimmed.includes('maps.app.goo.gl')) {
    if (fallbackAddress) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // If it's a query string name directly
  if (!trimmed.startsWith('http')) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // Final fallback
  if (fallbackAddress) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  return trimmed;
};

export const resolveDirectImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  const trimmed = url.trim();

  // Handle Google Drive file links
  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{25,50})/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{25,50})/);
  if (idMatch && idMatch[1] && (trimmed.includes('drive.google.com/open') || trimmed.includes('drive.google.com/uc'))) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return trimmed;
};

