export const isTabActive = (pathname: string, currentPath: string, start = true) => {
  if (start) {
    return pathname === currentPath || pathname.startsWith(`${currentPath}/`);
  }
  return pathname === currentPath || pathname.endsWith(`${currentPath}/`);
};

export const getFullAddress = (
  address: { city?: string; state?: string; country?: string } | null
) => {
  if (!address) return "N/A";

  const { city, state, country } = address;

  if (!city && !state && !country) return "N/A";

  return `${city}, ${state} (${country})`;
};
