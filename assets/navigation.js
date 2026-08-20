export const DEFAULT_TAB = 'budget';

export const resolveTabName = (requestedName, availableTabs, defaultTab = DEFAULT_TAB) => {
  if (availableTabs.has(requestedName)) return requestedName;
  if (availableTabs.has(defaultTab)) return defaultTab;
  return availableTabs.values().next().value;
};
