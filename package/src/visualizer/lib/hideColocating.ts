import { Route } from '../types';
import { setRouteSpans } from '../utils';

/**
 * hide collocation by removing the route subtrees that don't have a next file
 * @param route 
 * @returns 
 */
export const hideColocating = (route: Route) => {
  // if no children, return route
  if (!route.children || route.children.length === 0) {
    return route;
  }

  //check if children have page or route files
  for (let i = 0; i < route.children.length; i++) {
    const child = route.children[i];

    if (child.data.type === 'Colocating') {
      route.children.splice(i, 1);
      i--;
    }
  }
  route = setRouteSpans(route);

  return route;
}