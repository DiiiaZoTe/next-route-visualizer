import { NODE_WIDTH } from "../../constants";
import { Route } from "../../types";
import { getSpan, getSpanSize } from "./getSpan";

/**
 * Set the spans for the route and subroutes.
 * This is useful to calculate the x position of the nodes later
 * @param route 
 * @returns Route
 */
export const setRouteSpans = (route: Route) => {
  //apply default if no children
  if (!route.children || route.children.length === 0) {
    route.data.maxSpan = 1;
    route.data.spanSize = NODE_WIDTH;
    route.data.directlySpanning = 0;
    return route;
  }
  // get the span
  const { maxSpan, spanning } = getSpan(route.children);
  route.data.maxSpan = maxSpan === 0 ? 1 : maxSpan;
  route.data.directlySpanning = spanning;
  route.data.spanSize = getSpanSize(route.data.maxSpan);

  return route;
}