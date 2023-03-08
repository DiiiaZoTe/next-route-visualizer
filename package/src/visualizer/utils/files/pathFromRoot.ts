import { isRouteGroup } from "./isType";

/**
 * Determines if the path is a route group
 * @param path 
 * @returns 
 */
export const pathFromRoot = (path: string) => {
  const pathSplit = path.split('/');
  const rootIndex = pathSplit.findIndex((element) => element === 'app');
  // find all route groups and remove them from the path
  const pathNoGroups = pathSplit.filter((element) => !isRouteGroup(element));
  return pathNoGroups.slice(rootIndex + 1).join('/');
};
