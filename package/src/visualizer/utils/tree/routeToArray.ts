import { Route, RouteData } from "../../types";

/**
 * Flatten the route tree into an array
 * @param route - route to convert to array
 * @returns RouteData[]
 */
export const routeToArray = (route: Route) => {
  const routeArray = [] as RouteData[];
  return routeToArrayHelper(route, routeArray);
};
const routeToArrayHelper = (
  route: Route,
  result: RouteData[],
) => {
  result.push(route.data);
  route.children?.forEach((child) => {
    routeToArrayHelper(child, result);
  });
  return result;
};