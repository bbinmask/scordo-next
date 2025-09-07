export const isTabActive = (pathname: string, currentPath: string, start = true) => {
  if (start) {
    return pathname === currentPath || pathname.startsWith(`${currentPath}/`);
  }
  return pathname === currentPath || pathname.endsWith(`${currentPath}/`);
};
