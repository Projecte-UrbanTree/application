export const formatDateForUrl = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const matchPath = (patterns: string[], pathname: string) =>
  patterns.some((pattern) =>
    pattern.endsWith('*')
      ? pathname.startsWith(pattern.slice(0, -1))
      : pathname.includes(pattern),
  );
