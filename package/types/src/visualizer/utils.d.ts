import { Route, RouteData } from "./types";
/**
 * For debugging purposes
 * @param route - route to log
 * @param indent - not needed for first call
 */
export declare const logRoute: (route: Route, indent?: string) => void;
/**
 * Flatten the route tree into an array
 * @param route - route to convert to array
 * @returns RouteData[]
 */
export declare const routeToArray: (route: Route) => RouteData[];
