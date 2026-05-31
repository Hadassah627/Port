export const truncate = (value: string, length = 140) => {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trim()}...`;
};

export const toCommaList = (value: string[] | undefined) => (value && value.length ? value.join(', ') : '');

export const splitCommaList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const formatNumber = (value: number | string) => new Intl.NumberFormat('en-US').format(Number(value));

export const classNames = (...values: Array<string | false | undefined | null>) => values.filter(Boolean).join(' ');
