import { Route } from "../../types";

/**
 * Determines if the path is a route group
 * @param path 
 * @returns 
 */
export const isRouteGroup = (path: string) => {
  const fileName = path.split('/').pop();
  // if file name start with ( and end with ) it is a route group
  if (fileName?.startsWith('(') && fileName?.endsWith(')')) return true;
  return false;
}

/**
 * Determines if the path is a route segment
 * @param path 
 * @returns 
 */
export const isRouteSegment = (path: string) => {
  const fileName = path.split('/').pop();
  // if file name start with [ and end with ] it is a route segment
  if (fileName?.startsWith('[') && fileName?.endsWith(']')) return true;
  return false;
}

/**
 * check if a route is colocating and set the type to Colocating
 * @param route 
 * @returns 
 */
export const isColocating = (route: Route) => {
  // check if contains next files
  const hasPageOrRouteFile = route?.data?.nextFiles?.length ? true : false;

  // check if children are all colocating, if no children then consider possible colocating
  const allChildrenAreColocating = route.children?.every(child => child.data.type === 'Colocating') ?? true;

  if (!hasPageOrRouteFile && allChildrenAreColocating)
    route.data.type = 'Colocating';

  return route;
}