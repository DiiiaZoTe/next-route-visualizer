import { NODE_SPACING_X, NODE_WIDTH } from "../../constants";
import { Route } from "../../types";

/**
 * Get the span for all the children of the route.
 * Handles the groups of children too
 * @param routes 
 * @returns 
 */
export const getSpan = (routes: Route[]) => {
  let routeGroupsSpan = 0;
  let routesSpan = 0;
  let numberOfGroups = 0;
  // filter out the groups from the routes (children)
  const childrenNotGroup = routes.filter((route) => route.data.type !== 'Group')

  childrenNotGroup.forEach(route => {
    // for each route, find the groups and add their maxSpan to the routeGroupsSpan
    const routeGroups = route.children?.filter(child => child.data.type === 'Group');
    routeGroups?.forEach(group => {
      numberOfGroups++;
      routeGroupsSpan += group.data.maxSpan;
    });
    // add the maxSpan of the route to the routesSpan
    routesSpan += route.data.maxSpan;
  });

  return {
    maxSpan: routeGroupsSpan + routesSpan,
    spanning: childrenNotGroup.length + numberOfGroups,
  }
}

/**
 * calculate the span size from the max span
 * @param span 
 * @returns 
 */
export const getSpanSize = (span: number) => {
  return (span * NODE_WIDTH + (span - 1) * NODE_SPACING_X);
}
