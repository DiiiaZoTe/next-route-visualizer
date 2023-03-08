import { Route } from "../../types";

/**
 * The best way to apply some modification to the route tree using a postorder traversal.
 * Or how I call it... the saving grace of my problems here! LOL
 * @param route 
 * @param modifierFn A function that takes a route and returns a route modified in some way
 * @returns Route
 */
export const postorderTraversal = (route: Route, modifierFn: (route: Route) => Route) => {
  if (!route.children) {
    return modifierFn(route);
  }
  route.children = route.children.map((child) => postorderTraversal(child, modifierFn)).filter((child) => child !== null) as Route[];
  return modifierFn(route);
}